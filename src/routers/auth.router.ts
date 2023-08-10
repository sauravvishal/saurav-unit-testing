import { Router } from "express";

import { Auth } from "../controllers/auth.controller";

class AuthRouter {
    router: any;
    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post("/register", new Auth().register);
        this.router.post("/login", new Auth().login);
    }

    getRouters() {
        return this.router;
    }
}

export const authRouter = new AuthRouter();