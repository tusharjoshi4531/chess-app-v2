import { RequestHandler } from "express";
import {
    ILoginReqBody,
    ISignupReqBody,
    IAuthorizeReqBody,
    IAccessTokenPayload,
} from "../types";
import {
    checkUserExists,
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
import _ from "lodash";
import { error401 } from "../error/app.error";

const removePassword = (data: Document) => {
    const user = { ..._.omit(data.toObject(), ["password"]) };
    // console.log(user);
    return user;
};

export const signup: RequestHandler<{}, {}, ISignupReqBody, {}> = async (
    req,
    res,
    next
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
        next(error);
    }
};

export const login: RequestHandler<{}, {}, ILoginReqBody, {}> = async (
    req,
    res,
    next
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
        next(error);
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
    res,
    next
) => {
    console.log(req.body);
    const { accessToken, refreshToken } = req.body;

    const refreshTokenIsValid = await isRefreshTokenValid(refreshToken);

    console.log({ refreshTokenIsValid });

    if (!refreshTokenIsValid)
        return next(error401("Unauthorized: Refresh token not valid"));

    let user = await verifyAccessToken(accessToken);
    console.log(user);
    if (user) {
        const newRefreshToken = createRefreshToken(user as IAccessTokenPayload);
        saveRefreshToken(
            newRefreshToken,
            new mongoose.Types.ObjectId((user as IAccessTokenPayload).userid)
        );
        return res
            .status(200)
            .json({ user, accessToken, refreshToken: newRefreshToken });
    }

    user = await verifyRefreshToken(refreshToken);
    console.log({ user });
    if (user) {
        const [accessToken, refreshToken] = generateTokens(
            user as IAccessTokenPayload
        );
        saveRefreshToken(
            refreshToken,
            new mongoose.Types.ObjectId((user as IAccessTokenPayload).userid)
        );
        return res.status(200).json({ user, accessToken, refreshToken });
    }

    next(error401("Unauthorized: Refresh token expired"));
};

export const exists: RequestHandler<
    { username: string },
    {},
    {},
    {}
> = async (req, res, next) => {
    try {
        const isUserRegistered = await checkUserExists(req.params.username);
        return res.status(200).json(isUserRegistered);
    } catch (error) {
        next(error);
    }
};
