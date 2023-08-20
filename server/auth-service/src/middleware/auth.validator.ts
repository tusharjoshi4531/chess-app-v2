import { RequestHandler } from "express";
import { IAuthorizeReqBody, ILoginReqBody, ISignupReqBody } from "../types";

export const validateSignup: RequestHandler<{}, {}, ISignupReqBody, {}> = (
    req,
    res,
    next
) => {
    const { username, firstname, lastname, password } = req.body;

    if (typeof username !== "string")
        return res.status(400).json({ message: "Invalid username" });
    if (typeof firstname !== "string")
        return res.status(400).json({ message: "Invalid firstname" });
    if (typeof lastname !== "string")
        return res.status(400).json({ message: "Invalid lastname" });
    if (typeof password !== "string")
        return res.status(400).json({ message: "Invalid password" });

    next();
};

export const validateLogin: RequestHandler<{}, {}, ILoginReqBody, {}> = (
    req,
    res,
    next
) => {
    const { username, password } = req.body;

    if (typeof username !== "string")
        return res.status(400).json({ message: "Invalid username" });
    if (typeof password !== "string")
        return res.status(400).json({ message: "Invalid password" });

    next();
};

export const validateLogout: RequestHandler<{}, {}, { userid: string }, {}> = (
    req,
    res,
    next
) => {
    const { userid } = req.body;

    if (typeof userid !== "string")
        return res.status(400).json({ message: "Invalid userid" });

    next();
};

export const validateAuthorize: RequestHandler<
    {},
    {},
    IAuthorizeReqBody,
    {}
> = (req, res, next) => {
    const { accessToken, refreshToken } = req.body;

    if (typeof accessToken !== "string")
        return res.status(400).json({ message: "Invalid access token" });

    if (typeof refreshToken !== "string")
        return res.status(400).json({ message: "Invalid access token" });

    next();
};
