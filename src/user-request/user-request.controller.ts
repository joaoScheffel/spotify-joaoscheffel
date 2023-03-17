import { Request, Response } from "express";
import { userRequestService } from "./user-request.service";

export class UserRequestController {
    async registerUserRequest(req: Request, res: Response) {
        await userRequestService.createUserRequest(req, res)
    }
}

export const userRequestController = new UserRequestController()