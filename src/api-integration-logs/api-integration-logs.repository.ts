import {model, Schema} from "mongoose";
import {ApiIntegrationLogs} from "./api-integration-logs";
import {ServerError} from "../error/server-error";

export const apiIntegrationLogSchema: Schema = new Schema<ApiIntegrationLogs>({
    userUuid: {
        type: String
    },
    apiIntegrationUuid: {
        type: String,
        required: [true, 'The apiIntegrationLogSchema.apiIntegrationUuid must be informed!']
    },
    endpoint: {
        type: String,
        required: [true, 'The apiIntegrationLogSchema.endpoint must be informed!']
    },
    error: {
        type: Boolean
    },
    errorLog: {
        type: Object
    },
    fetchResponse: {
        type: Object
    },
    finishedAt: {
        type: Date,
        required: [true, 'The apiIntegrationLogSchema.finishedAt must be informed!']
    },
    startedAt: {
        type: Date,
        required: [true, 'The apiIntegrationLogSchema.startedAt must be informed!']
    }
}, {timestamps: true})

export const ApiIntegrationLogCollection = model<ApiIntegrationLogs>('apiIntegrationLogCollection', apiIntegrationLogSchema, 'apiIntegrationLogs')

export class ApiIntegrationLogsRepository {
    async insertNewApiIntegrationLogs(config: ApiIntegrationLogs): Promise<ApiIntegrationLogs> {
        if (!config) {
            throw new ServerError('ApiIntegrationLogsRepository.insertNewApiIntegrationLogs at !config')
        }

        return await ApiIntegrationLogCollection.create({...config})
    }
}