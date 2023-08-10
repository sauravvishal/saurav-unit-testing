import { FilterQuery } from "mongoose";
import UserModel from "../models/user.model";
import { User } from "../interfaces/user";

export const createUser = async (input: any) => {
    try {
        const user = await UserModel.create(input);
        return user.toJSON();
    } catch (err: any) {
        throw new Error(err);
    }
}

export const findOneUser = async (query: FilterQuery<User>) => {
    return UserModel.findOne(query).lean();
}

export const findUserById = async (id: string) => UserModel.findById(id).select({
    email: 1, first_name: 1, last_name: 1, createdAt: 1, updatedAt: 1
}).lean();

export const updateUser = async (id: string, user: any) => UserModel.findByIdAndUpdate(id, user);

export const deleteUser = async (id: string) => UserModel.findByIdAndDelete(id);