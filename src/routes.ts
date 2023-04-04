import {Router} from "express";
import {spotifyAuthService} from "./utils/factory";

class Routes {
    private routes = Router()

    get mainConfiguration() {
        this.spotifyRoutes()

        return this.routes
    }

    private spotifyRoutes() {
        this.routes.post('/spotify/auth', spotifyAuthService.authorization)
        this.routes.get('/spotify/callback', spotifyAuthService.getAuthToken)
    }
}

export const routes = new Routes