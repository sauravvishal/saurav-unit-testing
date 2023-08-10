import { Request, Response } from "express";
import { validation } from "../utils/validations/user";
import { encrypt, decrypt } from "../utils/bcrypt.service";
import { createToken } from "../utils/jwt.service";
import {
    createUser,
    findOneUser
} from "../services/user.service";

export class Auth {
    async register(req: Request, res: Response) {
        try {
            const { value, error } = validation.register(req.body);
            if (error) return res.status(403).json({ status: 403, message: error.details[0].message, data: null });

            const { first_name, last_name, email, password } = value;

            const ifUserExist = await findOneUser({ email });
            if (ifUserExist) return res.status(409).json({ status: 409, message: "Email already exist.", data: null });

            const newPassword = await encrypt(password);

            const created = await createUser({ first_name, last_name, email, password: newPassword });

            res.status(201).json({
                status: 201,
                message: "User registed successfully",
                data: {
                    id: created._id,
                    email,
                    first_name,
                    last_name
                }
            });
        } catch (error) {
            res.status(400).json({ status: 403, message: "Something went wrong.", data: null });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { value, error } = validation.login(req.body);
            if (error) return res.status(403).json({ status: 403, message: error.details[0].message, data: null });

            const { email, password } = value;

            const ifUserExist = await findOneUser({ email });
            if (!ifUserExist) return res.status(404).json({ status: 404, message: "Email not found.", data: null });

            const isMatch = await decrypt(password, ifUserExist.password);
            if (!isMatch) return res.status(401).json({ status: 401, message: "Incorrect password", data: null });

            const token = createToken(ifUserExist._id.toString());

            res.status(200).json({
                status: 200,
                message: "Logged in successfully",
                data: { token }
            });
        } catch (error) {
            res.status(400).json({ status: 403, message: "Something went wrong.", data: null });
        }
    }
}