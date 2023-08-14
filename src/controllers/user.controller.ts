import { Response } from "express";
import { validation } from "../utils/validations/user";
import { encrypt } from "../utils/bcrypt.service";
import { UserAuthRequest } from "../interfaces/authUser";
import {
    findUsers,
    findUserById,
    updateUser,
    deleteUser
} from "../services/user.service";

export class UserController {
    async getAllUser(req: UserAuthRequest, res: Response) {
        try {
            const { value, error } = validation.getAllUsers(req.query)
            if (error) return res.status(403).json({ status: 403, message: error.details[0].message, data: null });

            const { skip, limit } = value;

            const user = await findUsers(skip, limit);

            if (!user) return res.status(404).json({ status: 404, message: "User not found.", data: null });

            res.status(200).json({ status: 200, message: "Updated user.", data: user });
        } catch (error: any) {
            res.status(400).json({ status: 400, message: "Something went wrong.", data: null });
        }
    }

    async getUser(req: UserAuthRequest, res: Response) {
        try {
            const { id } = req.params;

            const user = await findUserById(id);

            if (!user) return res.status(404).json({ status: 404, message: "User not found.", data: null });

            res.status(200).json({ status: 200, message: "Updated user.", data: user });
        } catch (error: any) {
            res.status(400).json({ status: 400, message: "Something went wrong.", data: null });
        }
    }

    async update(req: UserAuthRequest, res: Response) {
        try {
            const { id } = req.user;
            const { value, error } = validation.update(req.body);
            if (error) return res.status(403).json({ status: 403, message: error.details[0].message, data: null });

            const { first_name, last_name, email, password } = value;

            if (!first_name && !last_name && !email && !password) return res.status(403).json({ status: 403, message: "Atleast one field required.", data: null });

            const user: any = {};
            if (first_name) user["first_name"] = first_name;
            if (last_name) user["last_name"] = last_name;
            if (email) user["email"] = email;
            if (password) {
                let newPass: string = await encrypt(password);
                user["password"] = newPass;
            }

            const updatedUser = await updateUser(id, user);

            if (!updatedUser) return res.status(400).json({ status: 400, message: "Something went wrong.", data: null });
            res.status(200).json({
                status: 200,
                message: "Updated user.",
                data: {
                    id: updatedUser?._id
                }
            });
        } catch (error: any) {
            if (error.code === 11000 && error.codeName === "DuplicateKey") return res.status(400).json({
                status: 400,
                message: "Email already exists.",
                data: null
            });
            res.status(400).json({ status: 400, message: "Something went wrong.", data: null });
        }
    }

    async delete(req: UserAuthRequest, res: Response) {
        try {
            const { id } = req.user;

            const deletedUser = await deleteUser(id);
            if (!deletedUser) return res.status(404).json({ status: 404, message: "Id not found.", data: null });

            res.status(200).json({ status: 200, message: "Delete user.", data: deletedUser });
        } catch (error) {
            res.status(400).json({ status: 400, message: "Something went wrong.", data: null });
        }
    }
}