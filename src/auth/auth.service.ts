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
        if (!req.headers["authorization"]) {
            throw new UnauthorizedError('Authorization Bearer must be informed!')
        }
        if (req.headers["authorization"].split('Bearer ').length <= 1) {
            throw new UnauthorizedError('Authorization Bearer token not provide!')
        }
        const token = req.headers["authorization"].split('Bearer ')[1]
        const decodedToken: AuthorizationToken = await authService.verifyAuthorization<AuthorizationToken>(token)
        const refreshToken: RefreshToken = await authService.verifyAuthorization<RefreshToken>(decodedToken.refreshToken)

        if (req.path === "/auth/refresh-token") {
            await authService.validateRefreshToken(decodedToken, refreshToken)
        } else {
            await authService.validateRefreshToken(decodedToken)
        }

        if (!await spotifyUserProfileRepository.findUserProfileByUserUuid(decodedToken.userUuid)) {
            throw new UnauthorizedError('User not found!')
        }

        next()
    }

    async refreshToken(req: Request): Promise<string> {
        const token = req.headers["authorization"].split('Bearer ')[1]
        const decodedToken: AuthorizationToken = await authService.verifyAuthorization<AuthorizationToken>(token)
        await authService.verifyAuthorization<RefreshToken>(decodedToken.refreshToken)

        const userProfile: SpotifyUserProfile = await spotifyUserProfileRepository.findUserProfileByUserUuid(decodedToken.userUuid)

        if (!userProfile) {
            throw new UnauthorizedError('User not found!')
        }

        return await new JsonWebTokenService().generateAuthorizationToken(userProfile.userUuid)
    }

    async validateRefreshToken(decodedToken: AuthorizationToken, refreshToken?: RefreshToken) {
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

    async verifyAuthorization<T>(token: string): Promise<{}> {
        if (!token) {
            throw new ServerError('AuthService.verifyAuthorization at !token')
        }

        let payloadToReturn = {}

        await verify(token, process.env.SECRET, (error, decoded) => {
            if (error) {
                throw new UnauthorizedError('Invalid authorization token!')
            }
            if (Object.keys(decoded).length) {
                for (const obj of Object.keys(decoded)) {
                    payloadToReturn[obj] = decoded[obj]
                }
            }
        })

        if (!payloadToReturn) {
            throw new UnauthorizedError('Invalid authorization payload!')
        }

        return payloadToReturn
    }
}