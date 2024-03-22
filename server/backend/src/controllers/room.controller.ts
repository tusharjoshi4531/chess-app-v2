import { RequestHandler } from "express";
import { error400 } from "../error/app.error";
import {
    ISavedRoom,
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

    const roomMessage = {
        type: RoomsChangeType.INITIAL_ROOMS,
        data: rooms,
    };

    res.write(`id: ${req.body.ssid}\n`);
    res.write(`data: ${JSON.stringify(roomMessage)}\n\n`);

    const cleanUp = subscribeRoomChange(req.params.username, (room) => {
        
        const irreleventChange =
            (room.data as ISavedRoom).white !== req.params.username &&
            (room.data as ISavedRoom).black !== req.params.username;

        

        if (irreleventChange) return;

        const changeMessage = {
            type: room.type,
            data: room.data,
        };

        res.write(`id: ${req.body.ssid}\n`);
        res.write(`data: ${JSON.stringify(changeMessage)}\n\n`);
    });

    req.on("close", () => {
        cleanUp();
    });

    
};
