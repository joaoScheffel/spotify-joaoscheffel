import { model, Schema } from "mongoose";
import { UserRequest } from "./user-request";

export const UserRequestSchema: Schema<UserRequest> = new Schema<UserRequest>({
    userIp: {
        type: String,
        required: [true, 'The userIp must be informed!']
    },
    endpoint: {
        type: String,
        required: [true, 'The endpoint must be informed!']
    },
    message: {
        type: String,
        required: [true, 'The message must be informed!']
    },
    error: {
        type: Boolean,
        required: false
    },
    statusCode: {
        type: Number,
        required: [true, 'The statusCode must be informed!']
    },
    userAgent: {
        type: String,
        required: [true, 'The userAgent must be informed!']
    },
    requestError: {
        type: Object,
        required: false
    },
    apiKey: {
        type: String,
        required: [true, 'The apiKey must be informed!']
    }
}, { timestamps: true })

export const UserRequestCollection = model<UserRequest>('userRequestCollection', UserRequestSchema, 'userRequests')

export class UserRequestRepository {
    async createUserRequest(config: UserRequest): Promise<UserRequest> {
        const userRequestToReturn: UserRequest = await UserRequestCollection.create({ ...config })

        if (!userRequestToReturn) {
            throw new Error('UserRequestRepository.createUserRequest at !userRequestToReturn')
        }

        return userRequestToReturn
    }
}

export const userRequestRepository = new UserRequestRepository()