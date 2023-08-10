import express from "express";

import { config } from "./config/config";
import { mainRouter } from "./routers/main.router";
import { Connection } from "./database/connection"

class App {
    app: any;
    port: number;
    constructor() {
        this.app = express();
        this.port = config.PORT || 3000;
    }

    init() {
        this.addRoutesAndMiddlewares(this.app);
        const connection = new Connection;
        connection.connect()
        this.listenToPort(this.app, this.port);
    }

    addRoutesAndMiddlewares(app: any) {
        app.use(express.json(), express.urlencoded({ extended: true }));
        app.use('/api', mainRouter.getRouters());
    }

    listenToPort(app: any, port: number) {
        app.listen(port, () => {
            console.log(`Server listening to port : ${port}.`);
        });
    }
}

export const app = new App();