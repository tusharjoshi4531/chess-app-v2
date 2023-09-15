import { RequestHandler } from "express";
import { error400, success201 } from "../error/app.error";
import { IChallenge } from "../model/challenge.model";
import { INotification, NotificationType } from "../model/notification.model";
import { createNotification } from "../service/notification.service";
import {
    createChallenge,
    deleteChallenge,
    findChallenge,
} from "../service/challenge.service";
import _ from "lodash";
import { IRoom } from "../model/room.model";
import { createRoom, transformRoom } from "../service/room.service";

export const addChallenge: RequestHandler = async (req, res, next) => {
    try {
        console.log(req.body);
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

        const createdChallenge = await createChallenge(
            challengeData,
            5 * 60 * 1000
        );

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

        await createNotification(challengeNotif, 5 * 60 * 1000);

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

export const acceptChallenge: RequestHandler<
    { challengeId: string },
    {},
    { username: string },
    {}
> = async (req, res, next) => {
    try {
        const { challengeId } = req.params;
        const { username } = req.body;

        console.log({ challengeId, username });

        const challenge = await findChallenge(challengeId);

        const CAN_ACCEPT: boolean =
            challenge.white === "?" ||
            challenge.black === "?" ||
            challenge.white === username ||
            challenge.black === username;

        if (!CAN_ACCEPT)
            return next(error400("You can't accept this challenge"));

        const timeControlInMs =
            challenge.time.minutes * 60 * 1000 + challenge.time.seconds * 1000;

        const newRoom: IRoom = {
            white: challenge.white === "?" ? username : challenge.white,
            whiteConnected: false,
            whiteRemainigTime: timeControlInMs,
            black: challenge.black === "?" ? username : challenge.black,
            blackConnected: false,
            blackRemainigTime: timeControlInMs,
            boardHistory: [],
            spectators: [],
            chats: [],
            lastMoveTime: Date.now(),
        };

        const createdRoom = transformRoom(await createRoom(newRoom));
        await deleteChallenge(challengeId);

        next(success201(createdRoom));
    } catch (error) {
        next(error);
    }
};
