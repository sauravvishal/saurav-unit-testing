import Joi from "joi";
import { User } from "../../interfaces/user";

class Validation {
    register(user: User) {
        const userSchema = Joi.object<User>({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(5).max(50).required(),
        });
        return userSchema.validate(user);
    }

    login(user: User) {
        const userSchema = Joi.object<User>({
            email: Joi.string().email().required(),
            password: Joi.string().min(5).max(50).required(),
        });
        return userSchema.validate(user);
    }

    update(user: User) {
        const userSchema = Joi.object<User>({
            first_name: Joi.string(),
            last_name: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string().min(5).max(50),
        });
        return userSchema.validate(user);
    }

    getAllUsers(user: any) {
        const userSchema = Joi.object<any>({
            skip: Joi.number().positive().allow(0).default(0),
            limit: Joi.number().positive().default(10)
        });
        return userSchema.validate(user);
    }
}

export const validation = new Validation;