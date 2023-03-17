import { NextFunction, Request, Response } from "express";
import { RestError } from "./rest-error";
import { userRequestService } from "../user-request/user-request.service";
import { RequestError } from "../user-request/user-request";

export class RequestErrorMiddleware {
    async validateErrors(error: Error & Partial<RestError>, req: Request, res: Response, next: NextFunction) {
        const statusCode = error?.statusCode || 500
        const message = error?.message || 'Internal Server Error'
        const stack = error?.stack || ''
        const name = error?.name
        const origin = error?.origin

        const requestError: RequestError = {
            errorMessage: message,
            errorName: name,
            stack: stack,
            origin: origin,
            errorLog: error
        }
        if (!res.headersSent) {
            res.status(statusCode).json({ message: message, name: name, stack: stack, origin })

            await userRequestService.createUserRequest(req, res, requestError)
            return
        } else {
            res.status(statusCode).json({ message: message, name: name, stack: stack, origin })
            await userRequestService.createUserRequest(req, res, requestError)
            return
        }
    }
}

export const requestErrorMiddleware = new RequestErrorMiddleware()