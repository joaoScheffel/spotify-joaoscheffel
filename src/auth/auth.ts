export interface AuthorizationToken extends UserToken{
    tokenType?: TokenType.AUTHORIZATION_TOKEN
    refreshToken?: string
}

export interface RefreshToken extends UserToken{
    tokenType?: TokenType.REFRESH_TOKEN
}

export interface UserToken {
    token?: string
    userUuid?: string
    expiresIn?: number
}
export enum TokenType {
    AUTHORIZATION_TOKEN = "AUTHORIZATION_TOKEN",
    REFRESH_TOKEN = "REFRESH_TOKEN"
}