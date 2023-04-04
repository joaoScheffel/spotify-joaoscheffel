import mongoose from 'mongoose'

export class Mongoose {
    protected _uri: string = process.env.DATABASE_URL as string

    constructor() {
        this.mainConfiguration()
    }

    mainConfiguration() {
        this.connectToDatabase()
    }

    connectToDatabase(): Promise<void> {
        mongoose.connect(this._uri)
            .then(() => {
                console.log('Successfully connected to database!')
            })
            .catch((e) => {
                console.log('Error connecting to database, error log: ' + e)
                return
            })
        return
    }
}