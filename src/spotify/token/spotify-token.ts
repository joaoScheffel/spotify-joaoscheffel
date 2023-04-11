import {TimesTamps} from "../../timestamps/timestamps";

export interface SpotifyToken extends TimesTamps {
    userUuid?: string
    spotifyTokenUuid?: string
    isLastToken?: boolean
    lasTokenUuid?: string
    accessToken?: SpotifyTokenResponse
}

export interface SpotifyTokenResponse {
    access_token?: string,
    expires_in?: number,
    refresh_token?: string,
    scope?: string
    error?: any
}