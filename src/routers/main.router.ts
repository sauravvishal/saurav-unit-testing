import { Router, Request, Response } from "express";
import { authRouter } from "./auth.router";
import { userRouter } from "./user.router";

class MainRouter {
    router: any;
    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.use("/auth", authRouter.getRouters());
        this.router.use("/user", userRouter.getRouters());

        this.router.get('*', function (req: Request, res: Response) {
            res.status(404).json({
                code: 404,
                data: null,
                message: 'Not Found.',
                error: null
            });
        });
    }

    getRouters() {
        return this.router;
    }
}

export const mainRouter = new MainRouter();