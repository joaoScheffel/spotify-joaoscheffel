import {SpotifyUserProfile, SpotifyUserProfileResponse} from "./spotify";
import {ServerError} from "../error/server-error";
import fetch from "node-fetch";
import {v4 as uuid} from 'uuid'
import {SpotifyTokenResponse} from "./token/spotify-token";
import {spotifyService, spotifyTokenService, spotifyUserProfileRepository} from "../utils/factory";
import {ApiIntegrationLogsService} from "../api-integration-logs/api-integration-logs.service";
import {EndpointType} from "../api-integration-logs/endpoint-type";
import {JsonWebTokenService} from "../json-web-token/json-web-token.service";
import {BadRequestError} from "../error/bad-request-error";
import querystring from "querystring";

export class SpotifyService {
    async saveNewUserAndAccessToken(spotifyTokenResponse: SpotifyTokenResponse): Promise<string> {
        if (!spotifyTokenResponse) {
            throw new ServerError('SpotifyService.createNewSpotifyUser at !spotifyTokenResponse')
        }

        const spotifyUserProfileResponse: SpotifyUserProfileResponse = await spotifyService.callGetSpotifyUserProfile(spotifyTokenResponse.access_token)

        const spotifyUserProfile: SpotifyUserProfile = await spotifyService.insertNewUserProfileFromResponse(spotifyUserProfileResponse)

        await spotifyTokenService.insertNewSpotifyTokenFromSpotifyUserProfile(spotifyTokenResponse, spotifyUserProfile)

        return await new JsonWebTokenService().generateAuthorizationToken(spotifyUserProfile.userUuid)
    }

    private async callGetUserTopItems(accessToken: string, type: string, timeRange: string, limit: number, offset: number) {
        if (!accessToken) {
            throw new ServerError('SpotifyService.callGetUserTopItems at !accessToken')
        }
        const urlApi: string = `https://api.spotify.com/v1/me/top/${type}`

        const body = querystring.stringify({
            limit: limit,
            time_range: timeRange,
            offset: offset
        })

        const fetchRequest = await fetch(urlApi + body, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        })


    }

    private async callGetSpotifyUserProfile(accessToken: string): Promise<SpotifyUserProfileResponse> {
        if (!accessToken) {
            throw new ServerError('SpotifyService.callGetSpotifyUserProfile at !accessToken')
        }

        const apiIntegrationLogs = new ApiIntegrationLogsService(EndpointType.SPOTIFY_GET_CURRENT_USER_PROFILE)

        const fetchRequest = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        })

        const fetchResponse = await fetchRequest.json()

        if (fetchResponse?.error) {
            let errorMessage = 'Spotify integration system failed!'
            await apiIntegrationLogs.setError({
                error: fetchResponse,
                message: errorMessage,
                errorHandled: false
            })
            throw new BadRequestError(errorMessage)
        }

        await apiIntegrationLogs.setFinish()

        return fetchResponse
    }

    private async insertNewUserProfileFromResponse(spotifyUserProfileResponse: SpotifyUserProfileResponse): Promise<SpotifyUserProfile> {
        if (!spotifyUserProfileResponse) {
            throw new ServerError('.insertNewUserProfile at !spotifyUserProfileResponse')
        }

        const spotifyUserProfile: SpotifyUserProfile = {
            userUuid: uuid(),
            href: spotifyUserProfileResponse.href,
            spotifyId: spotifyUserProfileResponse.id,
            email: spotifyUserProfileResponse.email,
            uri: spotifyUserProfileResponse.uri,
            images: spotifyUserProfileResponse.images,
            displayName: spotifyUserProfileResponse.display_name,
            followers: spotifyUserProfileResponse.followers,
            type: spotifyUserProfileResponse.type
        }

        return spotifyUserProfileRepository.insertNewUserProfile(spotifyUserProfile)
    }
}