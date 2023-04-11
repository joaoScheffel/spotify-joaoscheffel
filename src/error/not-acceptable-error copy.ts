import { RestError } from "./rest-error";

export class NotAcceptableError extends RestError {
    constructor (message: string) {
        super(message, 406, 'Not Acceptable')
    }
}