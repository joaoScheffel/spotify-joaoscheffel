import mongoose from 'mongoose'

export class MongooseConfiguration {
    protected databaseURL: string = process.env.DATABASE_URL as string
    constructor () {
        mongoose.connect(this.databaseURL)
        .then(() => {
            console.log('Connected to database')
        })
        .catch((e) => {
            console.log('MongoDB connection error!')
            console.log(e)
            return
        })
    }
}