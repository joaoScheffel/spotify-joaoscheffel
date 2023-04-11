import {Router} from "express";
import {spotifyController} from "./utils/factory";

class Routes {
    private routes = Router()

    get mainConfiguration() {
        this.spotifyRoutes()

        return this.routes
    }

    private spotifyRoutes() {
        this.routes.post('/spotify/auth', spotifyController.authorization)
        this.routes.get('/spotify/callback', spotifyController.getAndSaveUser)
    }
}

export const routes = new Routes