import {ApiIntegrationLogsRepository} from "../api-integration-logs/api-integration-logs.repository";
import {SpotifyAuthService} from "../spotify/auth/spotify-auth.service";
import {SpotifyController} from "../spotify/spotify.controller";
import {SpotifyUserProfileRepository} from "../spotify/spotify-user-profile-repository";
import {SpotifyService} from "../spotify/spotify.service";
import {RequestErrorMiddleware} from "../error/request-error.middleware";
import {SpotifyTokenRepository} from "../spotify/token/spotify-token.repository";
import {SpotifyTokenService} from "../spotify/token/spotify-token.service";
import {AuthService} from "../auth/auth.service";
import {AuthController} from "../auth/auth.controller";
export const authService = new AuthService()
export const apiIntegrationLogsRepository = new ApiIntegrationLogsRepository()
export const spotifyUserProfileRepository = new SpotifyUserProfileRepository()
export const spotifyService = new SpotifyService()
export const spotifyAuthService = new SpotifyAuthService()
export const spotifyController = new SpotifyController()

export const requestErrorMiddleware = new RequestErrorMiddleware()

export const spotifyTokenRepository = new SpotifyTokenRepository()
export const spotifyTokenService = new SpotifyTokenService()

export const authController = new AuthController()