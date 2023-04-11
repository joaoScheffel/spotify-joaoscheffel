import {sign} from 'jsonwebtoken'
import {ServerError} from "../error/server-error";
import {AuthorizationToken, RefreshToken, TokenType} from "../auth/auth";

export class JsonWebTokenService {
    readonly payload?: object

    constructor(payload?: object) {
        this.payload = payload
    }

    async generateToken(): Promise<string> {
        if (!this.payload) {
            throw new ServerError('JsonWebToken.generateToken at !this.payload')
        }
        return sign(this.payload, process.env.SECRET)
    }

    async generateAuthorizationToken(userUuid: string): Promise<string> {
        if (!userUuid) {
            throw new ServerError('JsonWebTokenService.generateAuthorizationToken at !userUuid')
        }
        const refreshToken = await new JsonWebTokenService().generateRefreshToken(userUuid)

        const payload: AuthorizationToken = {
            userUuid: userUuid,
            tokenType: TokenType.AUTHORIZATION_TOKEN,
            refreshToken: refreshToken,
            expiresIn: Date.now() + (60 * 60 * 1000)
        }

        return await new JsonWebTokenService(payload).generateToken()
    }

    async generateRefreshToken(userUuid: string): Promise<string> {
        if (!userUuid) {
            throw new ServerError('JsonWebTokenService.generateRefreshToken at !userUuid')
        }

        const refreshTokenPayload: RefreshToken = {
            userUuid: userUuid,
            tokenType: TokenType.REFRESH_TOKEN,
            expiresIn: Date.now() + (60 * 60 * 2000)
        }

        return await new JsonWebTokenService(refreshTokenPayload).generateToken()
    }
}