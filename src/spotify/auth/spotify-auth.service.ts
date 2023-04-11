import {Request} from "express";
import * as querystring from "querystring";
import {BadRequestError} from "../../error/bad-request-error";
import fetch from "node-fetch"
import {spotifyAuthService} from "../../utils/factory";
import {ApiIntegrationLogsService} from "../../api-integration-logs/api-integration-logs.service";
import {EndpointType} from "../../api-integration-logs/endpoint-type";
import {SpotifyTokenResponse} from "../token/spotify-token";
import {ServerError} from "../../error/server-error";

export class SpotifyAuthService {
    async authorization(): Promise<string> {
        const state: string = process.env.SPOTIFY_STATE
        const clientId: string = process.env.SPOTIFY_CLIENT_ID
        const scope = 'user-read-private user-read-email'
        const redirectUri: string = 'http://localhost:3333/spotify/callback'

        const query = querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectUri,
            state: state
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

    async getAccessToken(req: Request): Promise<SpotifyTokenResponse> {
        const clientId: string = process.env.SPOTIFY_CLIENT_ID
        const clientSecret: string = process.env.SPOTIFY_CLIENT_SECRET
        const redirectUri: string = 'http://localhost:3333/spotify/callback'
        const code: string = await spotifyAuthService.callback(req)

        const apiIntegrationLogs = new ApiIntegrationLogsService(EndpointType.SPOTIFY_AUTH)
        let errorMessage = ''

        const body = querystring.stringify({
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code: code
        })

        const fetchRequest = await fetch('https://accounts.spotify.com/api/token', {
            method: "POST",
            headers: {
                "Authorization": "Basic " + (Buffer.from(clientId + ':' + clientSecret).toString('base64')),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body
        })

        const spotifyTokenResponse: SpotifyTokenResponse = await fetchRequest.json()

        if (spotifyTokenResponse?.error) {
            errorMessage = 'Get spotify token error!'
            await apiIntegrationLogs.setError({
                error: spotifyTokenResponse,
                message: errorMessage
            })

            throw new BadRequestError(errorMessage)
        }

        return spotifyTokenResponse
    }

    async callback(req: Request): Promise<string> {
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
}