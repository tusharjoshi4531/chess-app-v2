import { RequestHandler } from "express";
import { success201 } from "../error/app.error";
import { IChallenge } from "../model/challenge.model";
import { INotification, NotificationType } from "../model/notification.model";
import { createNotification } from "../service/notification.service";

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

        const challengeNotif: INotification = {
            from,
            to,
            type: NotificationType.CHALLENGE,
            title: "New challenge",
            body: `${from} has challenged you to a game of chess`,
            payload: {
                challengeId: "?",
            },
        };

        await createNotification(challengeNotif, 5000);

        next(success201());
    } catch (error) {
        next(error);
    }
};
