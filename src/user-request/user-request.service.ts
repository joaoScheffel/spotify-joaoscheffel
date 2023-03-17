import { Request, Response } from "express";
import { RequestError, UserRequest } from "./user-request";
import { userRequestRepository } from "./user-request.repository";

export class UserRequestService {
    async createUserRequest(req: Request, res: Response, requestError?: RequestError) {

        const userRequestToInsert: UserRequest = {
            userIp: req.ip,
            endpoint: req?.url,
            statusCode: res?.statusCode,
            message: res?.statusMessage,
            userAgent: req.headers["user-agent"],
            error: false,
            requestError,
            apiKey: req.headers['api-key'] as string || 'undefined'
        }

        if (res.statusCode >= 400) userRequestToInsert.error = true

        await userRequestRepository.createUserRequest(userRequestToInsert)

    }
}

export const userRequestService = new UserRequestService()