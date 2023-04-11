import {Request, Response} from "express";
import {spotifyAuthService, spotifyService} from "../utils/factory";
import {SpotifyTokenResponse} from "./token/spotify-token";

export class SpotifyController {

    async authorization (req: Request, res: Response) {
        const url = await spotifyAuthService.authorization()

        return res.status(200).json({
            message: 'Authorization url successfully obtained!',
            url: url
        })
    }
    async getAndSaveUser(req: Request, res: Response) {
        const spotifyTokenResponse: SpotifyTokenResponse = await spotifyAuthService.getAccessToken(req)

        const accessToken: string = await spotifyService.getAndSaveUser(spotifyTokenResponse)

        return res.status(201).json({
            message: 'User successfully saved!',
            accessToken: accessToken
        })
    }
}