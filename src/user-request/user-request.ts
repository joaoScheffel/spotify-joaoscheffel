import { TimesTamps } from "../timestamps/timestamps"

export interface UserRequest extends TimesTamps {
    userIp?: string
    endpoint?: string
    userAgent?: string
    message?: string
    statusCode?: number
    error?: boolean
    requestError?: RequestError
    apiKey?: string
}

export interface RequestError {
    errorMessage?: string
    errorName?: string
    stack?: string
    origin?: string
    errorLog?: any
}