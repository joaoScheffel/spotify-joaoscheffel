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

export class SpotifyService {
    async getAndSaveUser(spotifyTokenResponse: SpotifyTokenResponse): Promise<string> {
        if (!spotifyTokenResponse) {
            throw new ServerError('SpotifyService.createNewSpotifyUser at !spotifyTokenResponse')
        }

        const spotifyUserProfileResponse: SpotifyUserProfileResponse = await spotifyService.getSpotifyUserProfileResponse(spotifyTokenResponse)

        const spotifyUserProfile: SpotifyUserProfile = await spotifyService.insertNewUserProfileFromResponse(spotifyUserProfileResponse)

        await spotifyTokenService.insertNewSpotifyTokenFromSpotifyUserProfile(spotifyTokenResponse, spotifyUserProfile)

        return await new JsonWebTokenService().generateAuthorizationToken(spotifyUserProfile.userUuid)
    }

    async getSpotifyUserProfileResponse(spotifyTokenResponse: SpotifyTokenResponse): Promise<SpotifyUserProfileResponse> {
        if (!spotifyTokenResponse) {
            throw new ServerError('SpotifyService.getUserFromAccessToken at !spotifyTokenResponse')
        }

        const apiIntegrationLogs = new ApiIntegrationLogsService(EndpointType.SPOTIFY_GET_CURRENT_USER_PROFILE)
        let errorMessage = ''

        const fetchRequest = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + spotifyTokenResponse.access_token
            }
        })

        const fetchResponse = await fetchRequest.json()

        if (fetchResponse?.error) {
            errorMessage = 'Spotify integration system failed!'
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

    async insertNewUserProfileFromResponse(spotifyUserProfileResponse: SpotifyUserProfileResponse): Promise<SpotifyUserProfile> {
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