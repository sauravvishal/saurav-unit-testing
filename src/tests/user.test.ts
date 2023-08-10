import supertest from "supertest";
import mongoose from "mongoose";
import { ValidationResult } from "joi";

import { app } from "../server";
import * as UserService from "../services/user.service";
import { validation } from "../utils/validations/user";
import * as BcryptService from "../utils/bcrypt.service";
import { createToken } from "../utils/jwt.service";

app.addRoutesAndMiddlewares(app.app);

const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
    _id: userId,
    email: "test@mail.com",
    first_name: "Test",
    last_name: "Doe",
    password: "hashPassword"
};

const userInput = {
    email: "test@mail.com",
    first_name: "Test",
    last_name: "Doe",
    password: "password123"
}

const validationPayload: ValidationResult = {
    error: undefined,
    value: userInput
}

describe("User", () => {
    let token = "";

    beforeAll(() => {
        token = createToken(userId);
    });

    describe("--------Get user--------", () => {
        const URL = `/api/user/${userId}`;
        describe("** User doesnot exist", () => {
            const findUSerMock = jest
                .spyOn(UserService, "findUserById")
                // @ts-ignore
                .mockReturnValueOnce(null);

            it("should return 404", async () => {
                const token = createToken("64d21a3a3d1584cda771a237");

                const response = await supertest(app.app)
                    .get(URL)
                    .set('Authorization', `Bearer ${token}`);

                expect(findUSerMock).toHaveBeenCalledWith(userId);
                expect(response.status).toBe(404);
            });
        });

        describe("** User exist", () => {
            const findUSerMock = jest
                .spyOn(UserService, "findUserById")
                // @ts-ignore
                .mockReturnValueOnce(userPayload);

            it("should return 404", async () => {
                const token = createToken("64d21a3a3d1584cda771a237");
                const response = await supertest(app.app)
                    .get(URL)
                    .send({ token });

                expect(findUSerMock).toHaveBeenCalledWith(userId);
                expect(response.status).toBe(200);
                expect(response.body.data).toEqual(userPayload);
            });
        });
    });

    describe("--------Update user--------", () => {
        const URL = `/api/user`;
        describe("** Validation error", () => {
            it("should return 403", async () => {
                const response = await supertest(app.app)
                    .put(URL)
                    .set('Authorization', `Bearer ${token}`)
                    .send({});

                expect(response.status).toBe(403);
            });
        });

        describe("** No validation error", () => {
            it("should return 200", async () => {
                const encryptPassMock = jest
                    .spyOn(BcryptService, "encrypt")
                    // @ts-ignore
                    .mockReturnValueOnce("hashPassword");

                const updateUserMock = jest
                    .spyOn(UserService, "updateUser")
                    // @ts-ignore
                    .mockReturnValueOnce(userPayload);

                const response = await supertest(app.app)
                    .put(URL)
                    .set('Authorization', `Bearer ${token}`)
                    .send(userInput);

                expect(encryptPassMock).toHaveBeenCalledWith(userInput.password);
                expect(updateUserMock).toHaveBeenCalledWith(userId, { ...userInput, password: userPayload.password });
                expect(response.status).toBe(200);
                expect(response.body.data).toEqual({ id: userId });
            });
        });
    });

    describe("--------Delete user--------", () => {
        const URL = `/api/user`;
        describe("** User doesnot exist", () => {
            it("should return 404", async () => {
                const deleteUserMock = jest
                    .spyOn(UserService, "deleteUser")
                    // @ts-ignore
                    .mockReturnValueOnce(null);

                const response = await supertest(app.app)
                    .delete(URL)
                    .set('Authorization', `Bearer ${token}`);

                expect(deleteUserMock).toHaveBeenCalledWith(userId);
                expect(response.status).toBe(404);
            })
        });

        describe("** User deleted", () => {
            it("should return 200", async () => {
                const deleteUserMock = jest
                    .spyOn(UserService, "deleteUser")
                    // @ts-ignore
                    .mockReturnValueOnce(userPayload);

                const response = await supertest(app.app)
                    .delete(URL)
                    .set('Authorization', `Bearer ${token}`);

                expect(deleteUserMock).toHaveBeenCalledWith(userId);
                expect(response.status).toBe(200);
                expect(response.body.data).toEqual(userPayload);
            })
        });
    });
});