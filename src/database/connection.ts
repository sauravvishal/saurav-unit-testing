import mongoose from "mongoose";
import { ConnectionOptions } from "tls";
import { config } from "../config/config"

export class Connection {
    url: string;
    constructor() {
        this.url = config.MONGO_URL;
    }

    async connect() {
        try {
            await mongoose.connect(this.url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            } as ConnectionOptions);
            console.log('MongoDB connected successfully!');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }
}