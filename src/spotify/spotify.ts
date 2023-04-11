import {TimesTamps} from "../timestamps/timestamps";
import {SpotifyTokenResponse} from "./token/spotify-token";

export interface SpotifyUserProfile extends TimesTamps {
    userUuid?: string
    displayName?: string
    email?: string
    followers?: SpotifyUserProfileFollowers
    href?: string
    spotifyId?: string
    images?: SpotifyUserProfileImages[]
    type?: string
    uri?: string
}

export interface SpotifyUserProfileResponse {
    country?: string
    display_name?: string
    email?: string
    explicit_content?: SpotifyUserProfileExplicitContent
    external_urls?: SpotifyUserProfileExternalUrls
    followers?: SpotifyUserProfileFollowers
    href?: string
    id?: string
    images?: SpotifyUserProfileImages[]
    product?: string
    type?: string
    uri?: string
    accessToken?: SpotifyTokenResponse
    status?: number
    message?: string
}

export interface SpotifyUserProfileImages {
    url?: string
    height?: number
    width?: number
}

export interface SpotifyUserProfileFollowers {
    href?: string
    total?: number
}

export interface SpotifyUserProfileExplicitContent {
    filter_enabled?: boolean
    filter_locked?: boolean
}

export interface SpotifyUserProfileExternalUrls {
    spotify?: string
}