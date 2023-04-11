import {model, Schema} from "mongoose";
import {SpotifyToken} from "./spotify-token";
import {ServerError} from "../../error/server-error";
import {spotifyTokenRepository} from "../../utils/factory";

export const spotifyTokensSchema: Schema = new Schema<SpotifyToken>({
    spotifyTokenUuid: {
        type: String,
    },
    lasTokenUuid: {
        type: String
    },
    userUuid: {
        type: String,
        required: [true, 'The spotifyTokensSchema.userUuid must be informed!']
    },
    accessToken: {
        type: Object,
        required: [true, 'The spotifyTokensSchema.accessToken must be informed!']
    },
    isLastToken: {
        type: Boolean
    }
}, {timestamps: true})

export const SpotifyTokensCollection = model<SpotifyToken>('SpotifyTokensCollection', spotifyTokensSchema, 'tokens')

export class SpotifyTokenRepository {
    async insertNewToken(config: SpotifyToken): Promise<SpotifyToken> {
        if (!config) {
            throw new ServerError('SpotifyTokenRepository.insertNewToken at !config')
        }

        const hasUserRegistration = await spotifyTokenRepository.findByUserUuid(config.spotifyTokenUuid)

        if (hasUserRegistration) {
            await spotifyTokenRepository.setIsLastTokenToFalse(hasUserRegistration.spotifyTokenUuid)
            config.lasTokenUuid = hasUserRegistration.spotifyTokenUuid
        }

        config.isLastToken = true

        return await SpotifyTokensCollection.create({...config})
    }

    async findByUserUuid(userUuid: string): Promise<SpotifyToken> {
        if (!userUuid) {
            throw new ServerError('SpotifyTokenRepository.findByUserUuid at !userUuid')
        }

        return SpotifyTokensCollection.findOne({userUuid: userUuid}).sort({createdAt: -1})
    }

    async setIsLastTokenToFalse(tokenUuid: string) {
        if (!tokenUuid) {
            throw new ServerError('SpotifyTokenRepository.setIsLastToken at !tokenUuid')
        }

        return SpotifyTokensCollection.findOneAndUpdate({spotifyTokenUuid: tokenUuid}, {
            $set: {
                isLastToken: false
            }
        })
    }
}