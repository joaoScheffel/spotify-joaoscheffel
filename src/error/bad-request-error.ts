import { RestError } from "./rest-error";

export class BadRequestError extends RestError {
    constructor (message: string) {
        super(message, 400, 'BadRequestError')
    }
}