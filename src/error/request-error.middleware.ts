import {NextFunction, Request, Response} from "express";
import {RestError} from "./rest-error";

export class RequestErrorMiddleware {
    async validateErrors(error: Error & Partial<RestError>, req: Request, res: Response, next: NextFunction) {
        const statusCode = error?.statusCode || 500
        const message = error?.message || 'Internal Server Error'
        const stack = error?.stack || ''
        const name = error?.name
        const origin = error?.origin

        if (!res.headersSent) {
            res.status(statusCode).json({ message: message, name: name, stack: stack, origin })

            return
        } else {
            res.status(statusCode).json({ message: message, name: name, stack: stack, origin })
            return
        }
    }
}

