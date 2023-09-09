import { NextFunction, Request, Response } from "express";
import { error401 } from "../error/app.error";
import { makeRequest } from "../util/request";
import { AUTH_SERVER_URL } from "../config/config";
import axios from "axios";

export interface IAuthorizedRequest<P = {}, B = {}, Q = {}>
    extends Request<P, {}, B, Q> {
    user: {
        username: string;
        userid: string;
        firstname: string;
        lastname: string;
    };
    refreshToken: string;
    accessToken: string;
}

export type AuthorizedRequestHandler<P = {}, B = {}, Q = {}> = (
    req: IAuthorizedRequest<P, B, Q>,
    res: Response,
    next: NextFunction
) => any;

export const authorize: AuthorizedRequestHandler<
    {},
    { refreshToken: string }
> = async (req, res, next) => {
    const { refreshToken } = req.body;
    const accessToken = req.headers.authorization?.split(" ")[1];

    console.log({ body: req.body });

    if (!accessToken || !refreshToken)
        return error401(
            "Unauthorized: Couldn't find access token or refresh token"
        );

    const { error, response } = await makeRequest(
        AUTH_SERVER_URL,
        "/authorize",
        "",
        (url) => axios.post(url, { accessToken, refreshToken })
    );
    console.log({ error, response });

    if (error) {
        req.accessToken = accessToken;
        req.refreshToken = refreshToken;
        return next(error401("Unauthorized"));
    }

    console.log(response);

    req.refreshToken = response.refreshToken;
    req.accessToken = response.accessToken;
    req.user = response.user;

    next();
};
