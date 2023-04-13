import {Router} from "express";
import {authController, authService, spotifyController} from "./utils/factory";

export class Routes {
    private routes = Router()

    get mainConfiguration() {
        this.spotifyRoutes()
        this.authRoutes()

        return this.routes
    }

    private authRoutes() {
        this.routes.post('/auth/refresh-token', authService.authorization, authController.refreshToken)
    }

    private spotifyRoutes() {
        this.routes.post('/spotify/auth', spotifyController.authorization)
        this.routes.get('/spotify/callback', spotifyController.getAndSaveUser)
    }
}