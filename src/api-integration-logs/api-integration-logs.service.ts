import {ApiIntegrationLogs, ApiIntegrationLogsError, ApiIntegrationLogsFetchResponse} from "./api-integration-logs";
import {ServerError} from "../error/server-error";
import {v4 as uuid} from 'uuid'
import {apiIntegrationLogsRepository} from "../utils/factory";
import {EndpointType} from "./endpoint-type";

export class ApiIntegrationLogsService {

    protected logs: ApiIntegrationLogs

    constructor(endpoint: EndpointType) {
        this.logs = {
            apiIntegrationUuid: uuid(),
            endpoint: endpoint,
            error: false,
            startedAt: new Date()
        }
    }

    async setFetchResponse (fetchResponse: ApiIntegrationLogsFetchResponse): Promise<void> {
        if (!fetchResponse) {
            throw new ServerError('ApiIntegrationLogsService.setFetchResponse at !fetchResponse')
        }

        this.logs.fetchResponse = fetchResponse
        return
    }

    async setUserUuid (userUuid: string) {
        if (!userUuid) {
            throw new ServerError('ApiIntegrationLogsService.setUserUuid at !userUuid')
        }

        this.logs.userUuid = userUuid
        return
    }

    async setError(errorLog: ApiIntegrationLogsError): Promise<void> {
        if (!errorLog) {
            throw new ServerError('ApiIntegrationLogsService.setError at !errorLog')
        }
        this.logs.errorLog = errorLog
        this.logs.error = true

        await this.setFinish()
        return
    }

    async setFinish(): Promise<void> {
        this.logs.finishedAt = new Date()

        await this.insertApiIntegrationLogs()

        return
    }

    protected async insertApiIntegrationLogs () {
        await apiIntegrationLogsRepository.insertNewApiIntegrationLogs(this.logs)
    }
}