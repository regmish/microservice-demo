import { Request, Response, Router } from "express";
import { BaseController } from "../interfaces/IBaseController";

export class UserController extends BaseController {
    routes(): Router {
        const router = Router();

        router.get("/", this.getUsers.bind(this));
        return router;
    }

    private async getUsers(req: Request, res: Response) {
        res.json({ message: "Hello World!" });
    }
}