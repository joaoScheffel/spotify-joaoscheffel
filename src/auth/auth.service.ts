import {NextFunction, Request, Response} from "express";
import {ServerError} from "../error/server-error";
import {verify} from "jsonwebtoken";
import {AuthorizationToken, RefreshToken} from "./auth";
import {UnauthorizedError} from "../error/unauthorized-error";
import {authService, spotifyUserProfileRepository} from "../utils/factory";
import {SpotifyUserProfile} from "../spotify/spotify";
import {JsonWebTokenService} from "../json-web-token/json-web-token.service";

export class AuthService {
    async authorization(req: Request, res: Response, next: NextFunction) {
        const token: string = this.extractTokenFromHeader(req)
        const decodedToken: AuthorizationToken = await authService.verifyAuthorization<AuthorizationToken>(token)
        const refreshToken: RefreshToken = await authService.verifyAuthorization<RefreshToken>(decodedToken.refreshToken)

        if (req.path === "/auth/refresh-token") {
            await authService.checkTokenExpiration(decodedToken, refreshToken)
        } else {
            await authService.checkTokenExpiration(decodedToken)
        }

        if (!await spotifyUserProfileRepository.findUserProfileByUserUuid(decodedToken.userUuid)) {
            throw new UnauthorizedError('User not found!')
        }

        next()
    }

    private extractTokenFromHeader(req: Request): string {
        const authHeader = req.headers["authorization"]
        if (!authHeader) {
            throw new UnauthorizedError("Authorization Bearer must be informed!")
        }
        const parts = authHeader.split("Bearer ")
        if (parts.length <= 1) {
            throw new UnauthorizedError("Authorization Bearer token not provided.")
        }
        return parts[1]
    }

    async refreshToken(req: Request): Promise<string> {
        const token: string = this.extractTokenFromHeader(req)

        const decodedToken: AuthorizationToken = await authService.verifyAuthorization<AuthorizationToken>(token)
        await authService.verifyAuthorization<RefreshToken>(decodedToken.refreshToken)

        const userProfile: SpotifyUserProfile = await spotifyUserProfileRepository.findUserProfileByUserUuid(decodedToken.userUuid)

        if (!userProfile) {
            throw new UnauthorizedError('User not found!')
        }

        return await new JsonWebTokenService().generateAuthorizationToken(userProfile.userUuid)
    }
    private async verifyAuthorization<T>(token: string): Promise<T> {
        const secret = process.env.SECRET
        return await this.verifyToken<T>(token, secret)
    }

    private async verifyToken<T>(token: string, secret: string): Promise<T> {
        if (!token) {
            throw new ServerError('AuthService.verifyAuthorization at !token')
        }

        return new Promise<T>((resolve, reject) => {
            verify(token, secret, (error, decoded) => {
                if (error) {
                    reject(new UnauthorizedError('Invalid authorization token!'))
                } else if (decoded) {
                    resolve(decoded as T)
                } else {
                    reject(new UnauthorizedError('Invalid authorization payload!'))
                }
            })
        })
    }

    private async checkTokenExpiration(decodedToken: AuthorizationToken, refreshToken?: RefreshToken) {
        if (decodedToken.expiresIn < Date.now()) {
            throw new UnauthorizedError('Expired authorization token!')
        }

        if (refreshToken && refreshToken.expiresIn < Date.now()) {
            throw new UnauthorizedError('Expired refresh authorization token!')
        }

        if (!await spotifyUserProfileRepository.findUserProfileByUserUuid(decodedToken.userUuid)) {
            throw new UnauthorizedError('User not found!')
        }

        return
    }
}