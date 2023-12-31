import mongoose from "mongoose";
import userModel, { IUserDoc } from "../model/user.model";
import validTokenModel from "../model/valid-refresh-tokens.model";
import { ILoginReqBody, ISignupReqBody } from "../types";
import bcrypt from "bcrypt";
import { error500 } from "../error/app.error";

// User

export const createUser = async (user: ISignupReqBody): Promise<IUserDoc> => {
    try {
        const { username, password, firstname, lastname } = user;

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(user, hashedPassword);

        const createdUser = await userModel.create({
            username,
            firstname,
            lastname,
            password: hashedPassword,
        });

        return createdUser;
    } catch (error) {
        throw error500("couldn't create user");
    }
};

export const getUser = async (
    credentials: ILoginReqBody
): Promise<IUserDoc> => {
    const { username, password } = credentials;

    const user = await userModel.findOne({ username });

    if (!user) throw error500("Couldn't find user with given user name");

    const res = await bcrypt.compare(password, user.password);
    if (!res) throw error500("Password didn't match");

    return user;
};

export const checkUserExists = async (username: string): Promise<boolean> => {
    console.log("Checkeng " + username);
    try {
        const user = await userModel.findOne({ username });

        return !!user;
    } catch (error) {
        console.log(error);
        throw error500("Couldn't check user");
    }
};

// Refresh token
export const saveRefreshToken = async (
    token: string,
    userid: mongoose.Types.ObjectId
) => {
    try {
        await validTokenModel.updateOne(
            { userid },
            { refreshToken: token },
            { upsert: true }
        );
    } catch (error) {
        console.log(error);
        throw error500("Couldn't save refresh token");
    }
};

export const removeRefreshToken = async (userid: mongoose.Types.ObjectId) => {
    try {
        await validTokenModel.deleteOne({ userid });
    } catch (error) {
        console.log(error);
        throw error500("Couldn't remove refresh token");
    }
};

export const isRefreshTokenValid = async (refreshToken: string) => {
    try {
        console.log(refreshToken);
        const res = await validTokenModel.findOne({ refreshToken });
        console.log(res);
        return !!res;
    } catch (error) {
        console.log(error);
        return false;
    }
};
