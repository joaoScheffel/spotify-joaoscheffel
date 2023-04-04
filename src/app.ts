import 'express-async-errors'
import express, { Express } from "express"
import morgan from 'morgan'
import dotenv from 'dotenv'
import { requestErrorMiddleware } from './error/request-error.middleware'
import {routes} from './routes'
import {Mongoose} from './database'

class AppServer {
    protected _express: Express

    constructor() {
        this._express = express()
        this.mainConfiguration()
        this.runMongooseConfiguration()
    }

    mainConfiguration() {
        dotenv.config()

        this.middlewares()
        this.routes()

        this.appListen()
    }

    middlewares() {
        this._express.use(morgan('dev'))
        this._express.use(express.json())
        this._express.use(express.urlencoded({extended: true}))
        this._express.use(requestErrorMiddleware.validateErrors)
    }

    routes () {
        this._express.use(routes.mainConfiguration)
    }

    runMongooseConfiguration() {
        new Mongoose()
    }



    appListen() {
        this._express.listen(process.env.PORT, () => {
            console.log(`Server running in http://localhost:${process.env.PORT} `)
        })
    }
}

new AppServer()