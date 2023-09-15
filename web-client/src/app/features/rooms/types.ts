export enum RoomsChangeType {
    INITIAL_ROOMS = "INITIAL_ROOMS",
    ROOM_INSERT = "ROOM_INSERT",
    ROOM_DELETE = "ROOM_DELETE",
}

export interface IRoom {
    id: string
    white: string;
    whiteConnected: boolean;
    black: string;
    blackConnected: boolean;
    boardHistory: string[];
}

export interface IRoomState {
    count: number;
    rooms: IRoom[];
}

export const initialState: IRoomState = {
    count: 0,
    rooms: [],
};
