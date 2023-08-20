import jwt from "jsonwebtoken";
import { IAccessTokenPayload } from "../types";
import {
    ACCESS_TOKEN_LIFE,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_LIFE,
    REFRESH_TOKEN_SECRET,
} from "../config/config";
import { IUserDoc } from "../model/user.model";

export const userDoc2Paylod = (user: IUserDoc): IAccessTokenPayload => ({
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
});

// Creation
const createToken = (payload: any, secret: string, life: string | number) => {
    return jwt.sign(payload, secret, { expiresIn: life });
};

export const createAccessToken = (user: IAccessTokenPayload) =>
    createToken(user, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE);

export const createRefreshToken = (user: IAccessTokenPayload) =>
    createToken(user, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);

export const generateTokens = (userPayload: IAccessTokenPayload) => {
    const accessToken = createAccessToken(userPayload);
    const refreshToken = createRefreshToken(userPayload);
    return [accessToken, refreshToken];
};

// Validation
const verifyToken = (token: string, secret: string) =>
    new Promise<string | jwt.JwtPayload | undefined>((resolve) => {
        jwt.verify(token, secret, (err, data) => {
            if (err || !data) return resolve(undefined);
            if (typeof data !== "string") removeAdditionalPayloadInfo(data);
            resolve(data);
        });
    });

const removeAdditionalPayloadInfo = (data: jwt.JwtPayload) => {
    delete data.exp;
    delete data.iat;
};

export const verifyAccessToken = async (token: string) => {
    const res = await verifyToken(token, ACCESS_TOKEN_SECRET);
    return res;
};

export const verifyRefreshToken = async (token: string) => {
    const res = await verifyToken(token, REFRESH_TOKEN_LIFE);
    return res;
};
