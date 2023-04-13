import 'express-async-errors'
import express, {Express} from "express"
import morgan from 'morgan'
import dotenv from 'dotenv'
import {Routes} from './routes'
import {Mongoose} from './database'
import {requestErrorMiddleware} from "./utils/factory";
import Config from "./config";


const routes = new Routes()

class AppServer {
    protected _express: Express

    constructor() {
        this._express = express()
        this.mainConfiguration()
        this.runMongooseConfiguration()
        this.runEnvVariables()
    }

    mainConfiguration() {
        dotenv.config()

        this.middlewares()
        this.routes()

        this._express.use(requestErrorMiddleware.validateErrors)
        this.appListen()
    }

    middlewares() {
        this._express.use(morgan('dev'))
        this._express.use(express.json())
        this._express.use(express.urlencoded({extended: true}))
    }

    routes () {
        this._express.use(routes.mainConfiguration)
    }

    runMongooseConfiguration() {
        new Mongoose()
    }

    runEnvVariables(): void {
        Config.load()
    }

    appListen(): void {
        const port = process.env.PORT || 3333;
        this._express.listen(port, () => {
            console.log(`Server running in http://localhost:${port} `);
        });
    }
}

new AppServer()