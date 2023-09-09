import { error500 } from "../error/app.error";
import roomModel, { IRoom, IRoomDoc } from "../model/room.model";

export enum RoomsChangeType {
    INITIAL_ROOMS = "INITIAL_ROOMS",
    ROOM_INSERT = "ROOM_INSERT",
    ROOM_DELETE = "ROOM_DELETE",
}

export interface ISavedRoom extends IRoom {
    id: string;
}

interface IRoomsChange {
    data: ISavedRoom | { id: string };
    type: RoomsChangeType;
}

export const transformRoom = (doc: IRoomDoc): IRoom & { id: string } => ({
    id: doc._id.toString(),
    white: doc.white,
    whiteConnected: doc.whiteConnected,
    black: doc.black,
    blackConnected: doc.blackConnected,
    boardHistory: doc.boardHistory,
    spectators: doc.spectators,
});

export const createRoom = async (room: IRoom) => {
    try {
        const roomDoc = await roomModel.create(room);
        return roomDoc;
    } catch (error) {
        throw error500("Couldn't create room");
    }
};

export const getRooms = async (username: string) => {
    try {
        const rooms = await roomModel.find({
            $or: [{ white: username }, { black: username }],
        });
        return rooms.map(transformRoom);
    } catch (error) {
        throw error500("Couldn't get rooms");
    }
};

export const subscribeRoomChange = (
    username: string,
    callback: (room: IRoomsChange) => void
) => {
    const pipeline = [
        {
            $match: {
                $or: [
                    { "fullDocument.white": username },
                    { "fullDocument.black": username },
                ],
            },
        },
    ];

    const changeStream = roomModel.watch(pipeline).on("change", (change) => {
        console.log(change);
        if (change.operationType === "insert") {
            callback({
                data: transformRoom(change.fullDocument as IRoomDoc),
                type: RoomsChangeType.ROOM_INSERT,
            });
        } else if (change.operationType === "delete") {
            callback({
                data: { id: change.documentKey._id },
                type: RoomsChangeType.ROOM_DELETE,
            });
        }
    });

    return changeStream;
};
