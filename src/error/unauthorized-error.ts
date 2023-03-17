import { RestError } from "./rest-error";

export class UnauthorizedError extends RestError {
    constructor (message: string) {
        super(message, 401, 'UnauthorizedError')
    }
}