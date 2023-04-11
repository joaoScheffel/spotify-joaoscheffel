import { Request, Response} from "express";
import {authService} from "../utils/factory";

export class AuthController {
    async refreshToken (req: Request, res: Response) {
        const accessToken: string = await authService.refreshToken(req)

        return res.status(201).json({
            message: 'Successfully refreshed token!',
            accessToken: accessToken
        })
    }
}