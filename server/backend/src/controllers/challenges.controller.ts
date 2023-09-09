import { RequestHandler } from "express";
import { success201 } from "../error/app.error";
import { IChallenge } from "../model/challenge.model";
import { INotification, NotificationType } from "../model/notification.model";
import {
    createNotification,
    deleteNotification,
} from "../service/notification.service";
import { createChallenge, deleteChallenge } from "../service/challenge.service";
import _ from "lodash";

export const addChallenge: RequestHandler = async (req, res, next) => {
    try {
        console.log(req.body);
        // res.status(201).json({
        //     accessToken: req.accessToken,
        //     refreshToken: req.refreshToken,
        // });
        next(success201());
    } catch (error) {
        next(error);
    }
};

export const challengeUser: RequestHandler<
    { targetUsername: string },
    {},
    IChallenge & { from: string }
> = async (req, res, next) => {
    try {
        console.log(req.body);
        const { from } = req.body;
        const { targetUsername: to } = req.params;

        const challengeData: IChallenge = _.omit(req.body, ["from"]);

        const createdChallenge = await createChallenge(challengeData);

        const challengeNotif: INotification = {
            from,
            to,
            type: NotificationType.CHALLENGE,
            title: "New challenge",
            body: `${from} has challenged you to a game of chess`,
            payload: {
                challengeId: createdChallenge._id.toString(),
            },
        };

        await createNotification(challengeNotif);

        next(success201());
    } catch (error) {
        next(error);
    }
};

export const removeChallenge: RequestHandler<
    { challengeId: string },
    {},
    {},
    {}
> = async (req, res, next) => {
    try {
        deleteChallenge(req.params.challengeId);
        next(success201());
    } catch (error) {
        next(error);
    }
};
