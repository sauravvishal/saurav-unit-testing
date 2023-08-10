import dotenv from "dotenv";
dotenv.config();

class Config {
    PORT: number;
    MONGO_URL: string;
    JWT_SECRET: string;
    constructor() {
        this.PORT = +process.env.PORT! || 3000;
        this.MONGO_URL = process.env.MONGO_URL as string;
        this.JWT_SECRET = process.env.JWT_SECRET as string;
    }
} 

export const config = new Config();