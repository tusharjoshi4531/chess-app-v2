import { RequestHandler } from "express";
import {
    ILoginReqBody,
    ISignupReqBody,
    IAuthorizeReqBody,
    IAccessTokenPayload,
} from "../types";
import {
    createUser,
    getUser,
    isRefreshTokenValid,
    removeRefreshToken,
    saveRefreshToken,
} from "../services/database.service";
import {
    createRefreshToken,
    generateTokens,
    userDoc2Paylod,
    verifyAccessToken,
    verifyRefreshToken,
} from "../services/jwt.service";
import mongoose, { Document } from "mongoose";
import { IUserDoc } from "../model/user.model";
import _ from "lodash";

const removePassword = (data: Document) => {
    const user = { ..._.omit(data.toObject(), ["password"]) };
    // console.log(user);
    return user;
};

export const signup: RequestHandler<{}, {}, ISignupReqBody, {}> = async (
    req,
    res
) => {
    try {
        const userDoc = await createUser(req.body);
        const userPayload = userDoc2Paylod(userDoc);
        const user = removePassword(userDoc);
        console.log(user);
        const [accessToken, refreshToken] = generateTokens(userPayload);
        saveRefreshToken(refreshToken, user._id);

        return res.status(200).json({ user, accessToken, refreshToken });
    } catch (error) {
        return res.status(400).json({ message: "couldn't signup", error });
    }
};

export const login: RequestHandler<{}, {}, ILoginReqBody, {}> = async (
    req,
    res
) => {
    try {
        const userDoc = await getUser(req.body);
        const userPayload = userDoc2Paylod(userDoc);
        const user = removePassword(userDoc);
        // console.log(user);
        const [accessToken, refreshToken] = generateTokens(userPayload);
        saveRefreshToken(refreshToken, user._id);

        return res.status(200).json({ user, accessToken, refreshToken });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "couldn't login",
            error: error instanceof Error ? error.message : error,
        });
    }
};

export const logout: RequestHandler<{}, {}, { userid: string }, {}> = (
    req,
    res
) => {
    const userid = new mongoose.Types.ObjectId(req.body.userid);
    removeRefreshToken(userid);

    res.status(200).json("Logged out");
};

export const authorize: RequestHandler<{}, {}, IAuthorizeReqBody, {}> = async (
    req,
    res
) => {
    console.log(req.body);
    const { accessToken, refreshToken } = req.body;

    const refreshTokenIsValid = await isRefreshTokenValid(refreshToken);

    console.log(refreshTokenIsValid);

    if (!refreshTokenIsValid)
        return res.status(401).json({ message: "Unauthorized" });

    let user = await verifyAccessToken(accessToken);
    console.log(user);
    if (user) {
        const newRefreshToken = createRefreshToken(user as IAccessTokenPayload);
        return res
            .status(200)
            .json({ user, accessToken, refreshToken: newRefreshToken });
    }

    user = await verifyRefreshToken(refreshToken);
    console.log(user);
    if (user) {
        const [accessToken, refreshToken] = generateTokens(
            user as IAccessTokenPayload
        );
        return res.status(200).json({ user, accessToken, refreshToken });
    }

    return res.status(401).json({ message: "Unauthorized" });
};
