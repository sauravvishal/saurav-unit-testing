import { Document } from "mongoose";

export interface User extends Document {
    _id?: string,
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    createdAt?: Date;
    updatedAt?: Date;
}