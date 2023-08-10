import { Router } from "express";

import { UserController } from "../controllers/user.controller"
import { authenticateToken } from "../middlewares/auth.middleware";

class UserRouter {
    router: any;
    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.use(authenticateToken);
        this.router.get("/:id", new UserController().getUser);
        this.router.put("/", new UserController().update);
        this.router.delete("/", new UserController().delete);
    }

    getRouters() {
        return this.router;
    }
}

export const userRouter = new UserRouter();