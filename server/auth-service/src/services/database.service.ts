import mongoose from "mongoose";
import userModel, { IUserDoc } from "../model/user.model";
import validTokenModel from "../model/valid-refresh-tokens.model";
import { ILoginReqBody, ISignupReqBody } from "../types";
import bcrypt from "bcrypt";

// User

export const createUser = async (user: ISignupReqBody): Promise<IUserDoc> => {
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
};

export const getUser = async (
    credentials: ILoginReqBody
): Promise<IUserDoc> => {
    const { username, password } = credentials;

    const user = await userModel.findOne({ username });

    if (!user) throw new Error("Couldn't find user with given user name");

    const res = await bcrypt.compare(password, user.password);
    if (!res) throw new Error("Password didn't match");

    return user;
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
    }
};

export const removeRefreshToken = async (userid: mongoose.Types.ObjectId) => {
    try {
        await validTokenModel.deleteOne({ userid });
    } catch (error) {
        console.log(error);
    }
};

export const isRefreshTokenValid = async (refreshToken: string) => {
    try {
        const res = await validTokenModel.findOne({ refreshToken });
        return !!res;
    } catch (error) {
        console.log(error);
        return false;
    }
};
