import {model, Schema} from "mongoose";
import {SpotifyUserProfile} from "./spotify";
import {ServerError} from "../error/server-error";
import {spotifyUserProfileRepository} from "../utils/factory";
import {BadRequestError} from "../error/bad-request-error";

export const spotifyUserProfileSchema: Schema = new Schema<SpotifyUserProfile>({
    userUuid: {
        type: String,
        required: [true, 'The spotifyUserProfileSchema.userUuid must be informed!']
    },
    email: {
        type: String,
        required: [true, 'The spotifyUserProfileSchema.email must be informed!']
    },
    spotifyId: {
        type: String,
    },
    displayName: {
        type: String,
    },
    href: {
        type: String
    },
    followers: {
        type: Object
    },
    images: {
        type: [Object]
    },
    uri: {
        type: String
    }
}, {timestamps: true})

export const SpotifyUserProfileCollection = model<SpotifyUserProfile>('spotifyUserProfileCollection', spotifyUserProfileSchema, 'users')

export class SpotifyUserProfileRepository {
    async insertNewUserProfile(config: SpotifyUserProfile): Promise<SpotifyUserProfile> {
        if (!config) {
            throw new ServerError('SpotifyUserProfileRepository.insertNewDocument at !config')
        }

        if (await spotifyUserProfileRepository.findUserProfileBySpotifyId(config.spotifyId)) {
            throw new BadRequestError('There is already a registered user with this spotify id!')
        }

        return await SpotifyUserProfileCollection.create(config)
    }

    async findUserProfileBySpotifyId(spotifyId: string): Promise<SpotifyUserProfile> {
        if (!spotifyId) {
            throw new ServerError('SpotifyUserProfileRepository.findUserProfileByUuid at !spotifyId')
        }

        return SpotifyUserProfileCollection.findOne({spotifyId: spotifyId});
    }

    async findUserProfileByUserUuid(userUuid: string): Promise<SpotifyUserProfile> {
        if (!userUuid) {
            throw new ServerError('SpotifyUserProfileRepository.findUserProfileByUserUuid at !userUuid')
        }

        return SpotifyUserProfileCollection.findOne({userUuid: userUuid})
    }
}