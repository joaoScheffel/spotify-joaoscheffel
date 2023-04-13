import dotenv from "dotenv";

class Config {
    static PORT: number
    static NODE_ENV: string
    static DATABASE_URL: string
    static SECRET: string
    static API_KEY: string
    static SPOTIFY_CLIENT_ID: string
    static SPOTIFY_STATE: string
    static SPOTIFY_CLIENT_SECRET: string
    static TOKEN_SECRET: string

    static load(): void {
        dotenv.config()

        this.PORT = parseInt(process.env.PORT || "3333", 10)
        this.NODE_ENV = process.env.NODE_ENV || "development"
        this.DATABASE_URL = process.env.DATABASE_URL || ""
        this.SECRET = process.env.SECRET || ""
        this.API_KEY = process.env.API_KEY || ""
        this.SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || ""
        this.SPOTIFY_STATE = process.env.SPOTIFY_STATE || ""
        this.SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || ""
        this.TOKEN_SECRET = process.env.TOKEN_SECRET || ""

        this.validate()
    }

    private static validate(): void {
        const requiredVariables = [
            "DATABASE_URL",
            "SECRET",
            "API_KEY",
            "SPOTIFY_CLIENT_ID",
            "SPOTIFY_STATE",
            "SPOTIFY_CLIENT_SECRET",
            "TOKEN_SECRET",
        ];

        for (const variable of requiredVariables) {
            if (!this[variable]) {
                throw new Error(`Environment variable ${variable} is not set.`)
            }
        }
    }
}

export default Config