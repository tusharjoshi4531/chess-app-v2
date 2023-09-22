import mongoose from "mongoose";
import { error500 } from "../error/app.error";
import roomModel, {
    IChatDoc,
    IChatMessage,
    IRoom,
    IRoomDoc,
} from "../model/room.model";
import { EventEmitter } from "stream";

export enum RoomsChangeType {
    INITIAL_ROOMS = "INITIAL_ROOMS",
    ROOM_INSERT = "ROOM_INSERT",
    ROOM_DELETE = "ROOM_DELETE",
}

export interface ISavedRoom extends IRoom {
    id: string;
}

interface IRoomsChange {
    data:
        | ISavedRoom
        | {
              id: string;
              black: string;
              white: string;
          };
    type: RoomsChangeType;
}

export const transformChat = (chat: IChatDoc): IChatMessage => ({
    id: chat._id.toString(),
    username: chat.username,
    message: chat.message,
});

export const transformRoom = (doc: IRoomDoc): IRoom & { id: string } => ({
    id: doc._id.toString(),
    finished: doc.finished,
    turn: doc.turn,
    white: doc.white,
    whiteConnected: doc.whiteConnected,
    whiteRemainigTime: doc.whiteRemainigTime,
    black: doc.black,
    blackConnected: doc.blackConnected,
    blackRemainigTime: doc.blackRemainigTime,
    boardHistory: doc.boardHistory,
    spectators: doc.spectators,
    chats: doc.chats.map((chat) => transformChat(chat)),
    lastMoveTime: doc.lastMoveTime,
    timerStarted: doc.timerStarted,
});

class RoomsChangeEmitter extends EventEmitter {
    constructor() {
        super();
    }

    emitRoomsChange(roomsChange: IRoomsChange) {
        this.emit("rooms/change", roomsChange);
    }

    onRoomChange(callback: (roomsChagne: IRoomsChange) => void) {
        this.on("rooms/change", callback);
        console.log(this.eventNames());
    }

    offRoomChange(callback: (roomsChagne: IRoomsChange) => void) {
        this.off("rooms/change", callback);
    }
}

const roomsChangeEmitter = new RoomsChangeEmitter();

export const createRoom = async (room: IRoom) => {
    try {
        const roomDoc = await roomModel.create(room);

        roomsChangeEmitter.emitRoomsChange({
            data: transformRoom(roomDoc),
            type: RoomsChangeType.ROOM_INSERT,
        });

        return roomDoc;
    } catch (error) {
        throw error500("Couldn't create room");
    }
};

export const getRooms = async (username: string) => {
    try {
        const rooms = await roomModel.find({
            $and: [
                { finished: false },
                { $or: [{ white: username }, { black: username }] },
            ],
        });
        return rooms.map(transformRoom);
    } catch (error) {
        throw error500("Couldn't get rooms");
    }
};

const updateRemainingTime = (roomDoc: IRoomDoc) => {
    const timeElapsed = Date.now() - roomDoc.lastMove;
    if (roomDoc.timerStarted) {
        if (roomDoc.turn === "w") {
            roomDoc.whiteRemainigTime -= timeElapsed;
            roomDoc.whiteRemainigTime = Math.max(roomDoc.whiteRemainigTime, 0);
        } else {
            roomDoc.blackRemainigTime -= timeElapsed;
            roomDoc.blackRemainigTime = Math.max(roomDoc.blackRemainigTime, 0);
        }
    }
    roomDoc.lastMove = Date.now();
};

export const getRoomById = async (id: string) => {
    try {
        const room = await roomModel.findById(new mongoose.Types.ObjectId(id));
        if (!room) throw error500("Room not found");

        updateRemainingTime(room);

        return room;
    } catch (error) {
        throw error500("Couldn't get room");
    }
};

export const pushMessage = async (
    id: string,
    message: { username: string; message: string }
) => {
    try {
        const room = await roomModel.findByIdAndUpdate(
            new mongoose.Types.ObjectId(id),
            { $push: { chats: { ...message } } },
            { new: true }
        );
        if (!room) throw error500("Room not found");
        return room;
    } catch (error) {
        throw error500("Couldn't push message");
    }
};

export const pushMove = async (id: string, fen: string, turn: "w" | "b") => {
    try {
        const room = await roomModel.findById(new mongoose.Types.ObjectId(id));
        if (!room) throw error500("Room not found");

        updateRemainingTime(room);

        room.boardHistory.push(fen);
        room.turn = turn;
        room.timerStarted = true;

        await room.save();

        return room;
    } catch (error) {
        throw error500("Couldn't push move");
    }
};

export const finishGame = async (id: string) => {
    try {
        const room = await roomModel.findById(new mongoose.Types.ObjectId(id));
        if (!room) throw error500("Room not found");

        updateRemainingTime(room);

        room.timerStarted = false;
        room.finished = true;

        await room.save();

        roomsChangeEmitter.emitRoomsChange({
            data: { id, black: room.black, white: room.white },
            type: RoomsChangeType.ROOM_DELETE,
        });

        return room;
    } catch (error) {
        throw error500("Couldn't remove room");
    }
};

export const subscribeRoomChange = (callback: (room: IRoomsChange) => void) => {
    roomsChangeEmitter.onRoomChange(callback);
    console.log({ roomEv: roomsChangeEmitter.eventNames() });
    return () => roomsChangeEmitter.offRoomChange(callback);
};
