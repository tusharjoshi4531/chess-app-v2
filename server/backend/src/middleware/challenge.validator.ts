import { RequestHandler } from "express";
import { IChallenge } from "../model/challenge.model";
import { error400, error500 } from "../error/app.error";
import { makeRequest } from "../util/request";
import { AUTH_SERVER_URL } from "../config/config";
import axios from "axios";

export const challengeValidator: RequestHandler<
    { targetUsername: string },
    {},
    IChallenge & { from: string },
    {}
> = async (req, res, next) => {
    const { status, time, black, white, from } = req.body;
    const { targetUsername } = req.params;

    const CHECK_PARAMS_STRUCTURE = typeof targetUsername === "string";

    const CHECK_BODY_STRUCTURE =
        typeof targetUsername === "string" &&
        typeof status === "string" &&
        typeof time === "object" &&
        typeof black === "string" &&
        typeof from === "string" &&
        typeof white === "string";

    const CHECK_TIME_STRUCTURE =
        typeof time.minutes === "number" && typeof time.seconds === "number";

    if (!CHECK_PARAMS_STRUCTURE) {
        const error = error400("Invalid request params structure");
        return next(error);
    }

    if (!CHECK_BODY_STRUCTURE || !CHECK_TIME_STRUCTURE) {
        const error = error400("Invalid request body structure");
        return next(error);
    }

    if (targetUsername === from)
        return next(error400("You can't challenge yourself"));

    const { error, response } = await makeRequest<boolean>(
        AUTH_SERVER_URL,
        `/exists/${targetUsername}`,
        "",
        (url) => axios.get<boolean>(url)
    );

    if (error) return next(error500("Couldn't check if user exists"));

    if (!response) {
        return next(error400("User doesn't exist"));
    }

    console.log({ response });

    next();
};
