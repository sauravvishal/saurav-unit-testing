import jwt from "jsonwebtoken";
import { config } from "../config/config";

const JWT_SECRET = config.JWT_SECRET;

export const createToken = (id: string) => jwt.sign({ id }, JWT_SECRET, { expiresIn: 60 * 60 });

export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET);