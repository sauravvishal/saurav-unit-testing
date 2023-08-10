import mongoose, { Schema } from "mongoose";

import { User } from "../interfaces/user";

const userSchema = new Schema<User>({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model<User>("User", userSchema);