import { RestError } from "./rest-error";

export class NotAcepptableError extends RestError {
    constructor (message: string) {
        super(message, 406, 'Not Acceptable')
    }
}