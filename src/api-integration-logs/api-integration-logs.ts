import {TimesTamps} from "../timestamps/timestamps";
import {EndpointType} from "./endpoint-type";

export interface ApiIntegrationLogs extends TimesTamps {
    userUuid?: string
    apiIntegrationUuid?: string
    fetchResponse?: ApiIntegrationLogsFetchResponse
    endpoint?: EndpointType
    error?: boolean
    errorLog?: ApiIntegrationLogsError
    startedAt?: Date
    finishedAt?: Date
}

export interface ApiIntegrationLogsFetchResponse {
    body?: object | string,
    headers?: object,
    response?: object
}

export interface ApiIntegrationLogsError {
    message?: any
    errorHandled?: boolean
    error?: any
}


