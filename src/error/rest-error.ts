export class RestError extends Error {
    readonly statusCode: number
    readonly name: string
    readonly origin?: string

    constructor (message: string, statusCode: number, name: string, origin?: string) {
        super(message)
        this.statusCode = statusCode
        this.name = name
        this.origin = origin
    }
}