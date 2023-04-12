import {Request} from "express";
import * as querystring from "querystring";
import {BadRequestError} from "../../error/bad-request-error";
import fetch from "node-fetch"
import {spotifyAuthService} from "../../utils/factory";
import {ApiIntegrationLogsService} from "../../api-integration-logs/api-integration-logs.service";
import {EndpointType} from "../../api-integration-logs/endpoint-type";
import {SpotifyTokenResponse} from "../token/spotify-token";
import {ServerError} from "../../error/server-error";
import {SpotifyGrantType} from "./grant-type";

export class SpotifyAuthService {
    readonly clientId: string
    readonly clientSecret: string
    readonly redirectUri: string
    readonly state: string

    constructor() {
        this.clientId = process.env.SPOTIFY_CLIENT_ID
        this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET
        this.state = process.env.SPOTIFY_STATE
        this.redirectUri = 'http://localhost:3333/spotify/callback'
    }

    async userAuthorization(): Promise<string> {
        return spotifyAuthService.callAuthorize('code', 'user-read-private user-read-email user-top-read')
    }

    async getAccessToken(req: Request): Promise<SpotifyTokenResponse> {
        return spotifyAuthService.callApiToken(SpotifyGrantType.authorization_code, req)
    }

    async refreshAccessToken(): Promise<SpotifyTokenResponse> {
        return spotifyAuthService.callApiToken(SpotifyGrantType.refresh_token)
    }

    async verifyCallback(req: Request): Promise<string> {
        const apiIntegrationLogs = new ApiIntegrationLogsService(EndpointType.SPOTIFY_CALLBACK)
        let errorMessage = ""

        if (req.query?.error) {
            errorMessage = 'Spotify callback error!'
            await apiIntegrationLogs.setError({
                error: req.query.error,
                message: errorMessage,
                errorHandled: false
            })
            throw new BadRequestError(errorMessage)
        }

        if (!req.query?.code || !req.query?.state) {
            errorMessage = 'Missing Spotify state or code!'
            await apiIntegrationLogs.setError({
                error: req.query.code || req.query.state,
                message: errorMessage,
                errorHandled: false
            })
            throw new BadRequestError(errorMessage)
        }

        const code = req.query.code as string
        const state = req.query.state as string
        const envState: string = process.env.SPOTIFY_STATE

        if (state != envState) {
            errorMessage = 'Invalid state credential!'
            await apiIntegrationLogs.setError({
                error: state,
                message: errorMessage,
                errorHandled: false
            })
            throw new BadRequestError(errorMessage)
        }

        await apiIntegrationLogs.setFinish()

        return code
    }

    private async callAuthorize(responseType: string, scope: string): Promise<string> {
        const query = querystring.stringify({
            response_type: responseType,
            client_id: this.clientId,
            scope: scope,
            redirect_uri: this.redirectUri,
            state: this.state
        })

        const apiIntegrationLogs = new ApiIntegrationLogsService(EndpointType.SPOTIFY_AUTH)

        const fetchRequest = await fetch('https://accounts.spotify.com/authorize?' + query, {
            method: "GET"
        })

        if (fetchRequest?.status > 400) {
            await apiIntegrationLogs.setError({
                error: fetchRequest,
                message: 'Spotify Authorization Error',
                errorHandled: false
            })
            throw new ServerError('SpotifyAuthService.authorization at fetchRequest?.status > 400')
        }

        await apiIntegrationLogs.setFinish()

        return fetchRequest.url
    }

    private async callApiToken(grantType: SpotifyGrantType, req?: Request): Promise<SpotifyTokenResponse> {
        const apiIntegrationLogs = new ApiIntegrationLogsService(EndpointType.SPOTIFY_AUTH)
        let body: string

        if (req) {
            body = querystring.stringify({
                grant_type: grantType,
                redirect_uri: this.redirectUri,
                code: await spotifyAuthService.verifyCallback(req)
            })
        } else {
            body = querystring.stringify({
                grant_type: grantType,
                redirect_uri: this.redirectUri
            })
        }

        const fetchRequest = await fetch('https://accounts.spotify.com/api/token', {
            method: "POST",
            headers: {
                "Authorization": "Basic " + (Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body
        })

        const spotifyTokenResponse: SpotifyTokenResponse = await fetchRequest.json()

        if (spotifyTokenResponse?.error) {
            let errorMessage = 'Get spotify token error!'
            await apiIntegrationLogs.setError({
                error: spotifyTokenResponse,
                message: errorMessage
            })

            throw new BadRequestError(errorMessage)
        }

        return spotifyTokenResponse
    }
}