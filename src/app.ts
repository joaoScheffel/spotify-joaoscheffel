import 'express-async-errors'
import express, { Express } from "express"
import morgan from 'morgan'
import dotenv from 'dotenv'
import { requestErrorMiddleware } from './error/request-error.middleware'
import { routesApi } from './routes'
import { MongooseConfiguration } from './database'

export class AppServer {
    protected _express: Express

    constructor () {
        this._express = express()
        this.inputServerConfiguration()
    }

    inputServerConfiguration() {
        dotenv.config()
        this._express.use(morgan('dev'))
        this._express.use(express.json())
        this._express.use(express.urlencoded({ extended: true }))

        this._express.use(routesApi())

        this._express.use(requestErrorMiddleware.validateErrors)

        this._express.listen(process.env.PORT, () => {
            console.log(`Server running in http://localhost:${process.env.PORT} `)
        })
    }
}

new AppServer()
new MongooseConfiguration()