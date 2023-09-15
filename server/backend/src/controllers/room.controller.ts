import { RequestHandler } from "express";
import { error400 } from "../error/app.error";
import {
    RoomsChangeType,
    getRooms,
    subscribeRoomChange,
} from "../service/room.service";

export const subscribe: RequestHandler<
    { username: string },
    {},
    { ssid: string },
    {}
> = async (req, res, next) => {
    if (!req.params.username) return next(error400("Username is required"));

    const rooms = await getRooms(req.params.username);
    console.log({ rooms });

    const roomMessage = {
        type: RoomsChangeType.INITIAL_ROOMS,
        data: rooms,
    };

    res.write(`id: ${req.body.ssid}\n`);
    res.write(`data: ${JSON.stringify(roomMessage)}\n\n`);

    const changeStreem = subscribeRoomChange(req.params.username, (room) => {
        console.log(room);
        const changeMessage = {
            type: room.type,
            data: room.data,
        };

        res.write(`id: ${req.body.ssid}\n`);
        res.write(`data: ${JSON.stringify(changeMessage)}\n\n`);
    });

    req.on("close", () => {
        console.log("closing");
        changeStreem.close();
    });

    console.log(req.params.username);
};
