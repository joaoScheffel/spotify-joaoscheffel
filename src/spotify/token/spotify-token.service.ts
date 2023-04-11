import {SpotifyToken, SpotifyTokenResponse} from "./spotify-token";
import {ServerError} from "../../error/server-error";
import {SpotifyUserProfile} from "../spotify";
import {spotifyTokenRepository} from "../../utils/factory";
import {v4 as uuid} from 'uuid'

export class SpotifyTokenService {
    async insertNewSpotifyTokenFromSpotifyUserProfile (spotifyTokenResponse: SpotifyTokenResponse, user: SpotifyUserProfile): Promise<SpotifyToken> {
        if (!spotifyTokenResponse || !user) {
            throw new ServerError('SpotifyTokenService.insertNewSpotifyToken at !spotifyTokenResponse || !user')
        }
        let spotifyTokenToInsert: SpotifyToken = {
            spotifyTokenUuid: uuid(),
            userUuid: user.userUuid,
            accessToken: spotifyTokenResponse
        }

        return await spotifyTokenRepository.insertNewToken(spotifyTokenToInsert)
    }
}