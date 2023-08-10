import supertest from "supertest";
import mongoose from "mongoose";
import { ValidationResult } from "joi";

import { app } from "../server";
import * as UserService from "../services/user.service";
import { validation } from "../utils/validations/user";
import * as BcryptService from "../utils/bcrypt.service";
import * as JwtService from "../utils/jwt.service";

app.addRoutesAndMiddlewares(app.app);

const userInput = {
    email: "test@mail.com",
    first_name: "Test",
    last_name: "Doe",
    password: "Password123"
};

const userInputLogin = {
    email: "test@mail.com",
    password: "Password123"
};

const userInputLoginWrong = {
    email: "test1@mail.com",
    password: "Password123"
}

const validationPayload: ValidationResult = {
    error: undefined,
    value: userInput
}

const validationPayloadLogin: ValidationResult = {
    error: undefined,
    value: userInputLogin
}

const validationPayloadLoginWrong: ValidationResult = {
    error: undefined,
    value: userInputLoginWrong
}

const userPayload = {
    _id: new mongoose.Types.ObjectId().toString(),
    email: "test@mail.com",
    password: "hashPassword",
    first_name: "Test",
    last_name: "Doe",
};

describe("Auth", () => {
    // beforeAll(async () => {
    //     // Connect to a test database before running tests
    //     await mongoose.connect("mongodb://localhost:27017/testdb");
    // });

    // afterAll(async () => {
    //     // Disconnect from the test database after tests
    //     await mongoose.connection.close();
    // });

    /**
     * For Register
     */
    describe("--------User Register--------", () => {
        describe("** Payload is invalid", () => {
            it("should return 403", async () => {
                const response = await supertest(app.app)
                    .post("/api/auth/register")
                    .send({});

                expect(response.status).toBe(403);
            });
        });

        describe("** User already exists", () => {
            it("should return 409", async () => {
                const validationMock = jest
                    .spyOn(validation, "register")
                    .mockReturnValueOnce(validationPayload);

                const ifUserMock = jest
                    .spyOn(UserService, "findOneUser")
                    // @ts-ignore
                    .mockReturnValueOnce(userPayload);
                const response = await supertest(app.app)
                    .post("/api/auth/register")
                    .send(userInput);

                expect(validationMock).toHaveBeenCalledWith(userInput);
                expect(ifUserMock).toHaveBeenCalledWith({ email: userInput.email });
                expect(response.status).toBe(409);
            });
        });

        describe("** Payload is valid", () => {
            it("should return 201", async () => {
                const validationMock = jest
                    .spyOn(validation, "register")
                    .mockReturnValueOnce(validationPayload);

                const ifUserMock = jest
                    .spyOn(UserService, "findOneUser")
                    // @ts-ignore
                    .mockReturnValueOnce(null);

                const bcryptMock = jest
                    .spyOn(BcryptService, "encrypt")
                    .mockResolvedValueOnce("hashPassword");

                const userCreateMock = jest
                    .spyOn(UserService, "createUser")
                    // @ts-ignore
                    .mockReturnValueOnce(userPayload);
                const response = await supertest(app.app)
                    .post("/api/auth/register")
                    .send(userInput);

                expect(validationMock).toHaveBeenCalledWith(userInput);
                expect(ifUserMock).toHaveBeenCalled();
                expect(bcryptMock).toHaveBeenCalled();
                expect(userCreateMock).toHaveBeenCalledWith({ ...userInput, password: userPayload.password });
                expect(response.status).toBe(201);
            });
        });
    });

    /**
     * For Login
     */
    describe("--------User Login--------", () => {
        describe("** Payload is invalid", () => {
            it("should return 403", async () => {
                const response = await supertest(app.app)
                    .post("/api/auth/login")
                    .send({});

                expect(response.status).toBe(403);
            });
        });

        describe("** Email doesnot exists", () => {

            it("should return 404", async () => {
                const validationMock = jest
                    .spyOn(validation, "login")
                    .mockReturnValueOnce(validationPayloadLoginWrong);

                const ifUserMock = jest
                    .spyOn(UserService, "findOneUser")
                    // @ts-ignore
                    .mockReturnValueOnce(null);

                const response = await supertest(app.app)
                    .post("/api/auth/login")
                    .send(userInputLoginWrong);

                expect(validationMock).toHaveBeenCalledWith(userInputLoginWrong);
                expect(ifUserMock).toHaveBeenCalledWith({ email: userInputLogin.email });
                expect(response.status).toBe(404);
                expect(response.body.message).toBe('Email not found.');
            });
        });

        describe("** Password is incorrect", () => {
            it("should return 401", async () => {
                const validationMock = jest
                    .spyOn(validation, "login")
                    .mockReturnValueOnce(validationPayloadLogin);

                const ifUserMock = jest
                    .spyOn(UserService, "findOneUser")
                    // @ts-ignore
                    .mockReturnValueOnce(userPayload);

                const bcryptMock = jest
                    .spyOn(BcryptService, "decrypt")
                    .mockResolvedValueOnce(false);

                const response = await supertest(app.app)
                    .post("/api/auth/login")
                    .send(userInputLogin);

                expect(validationMock).toHaveBeenCalledWith(userInputLogin);
                expect(ifUserMock).toHaveBeenCalledWith({ email: userInputLogin.email });
                expect(bcryptMock).toHaveBeenCalledWith(validationPayloadLogin.value.password, userPayload.password);
                expect(response.status).toBe(401);
                expect(response.body.message).toBe('Incorrect password');
            });
        });

        describe("** Credentials are correct", () => {
            it("should return 200", async () => {
                const validationMock = jest
                    .spyOn(validation, "login")
                    .mockReturnValueOnce(validationPayloadLogin);

                const ifUserMock = jest
                    .spyOn(UserService, "findOneUser")
                    // @ts-ignore
                    .mockReturnValueOnce(userPayload);

                const bcryptMock = jest
                    .spyOn(BcryptService, "decrypt")
                    .mockResolvedValueOnce(true);

                const jwtMock = jest
                    .spyOn(JwtService, "createToken")
                    .mockReturnValueOnce("token");

                const response = await supertest(app.app)
                    .post("/api/auth/login")
                    .send(userInputLogin);

                expect(validationMock).toHaveBeenCalledWith(userInputLogin);
                expect(ifUserMock).toHaveBeenCalledWith({ email: userInputLogin.email });
                expect(bcryptMock).toHaveBeenCalledWith(validationPayloadLogin.value.password, userPayload.password);
                expect(jwtMock).toHaveBeenCalledWith(userPayload._id);
                expect(response.status).toBe(200);
                expect(response.body.message).toBe('Logged in successfully');
            });
        });
    });
})
