import { PayloadAction } from "@reduxjs/toolkit";
import { IRoom, IRoomState } from "./types";

export const setRoomsController = (
    _: IRoomState,
    action: PayloadAction<IRoom[]>
) => ({
    rooms: action.payload as IRoom[],
    count: (action.payload as IRoom[]).length,
});

export const addRoomController = (
    state: IRoomState,
    action: PayloadAction<IRoom>
) => ({
    rooms: [...state.rooms, action.payload as IRoom],
    count: state.count + 1,
});

export const addManyRoomsController = (
    state: IRoomState,
    action: PayloadAction<IRoom[]>
) => ({
    rooms: [...state.rooms, ...(action.payload as IRoom[])],
    count: state.count + (action.payload as IRoom[]).length,
});

export const removeRoomController = (
    state: IRoomState,
    action: PayloadAction<string>
) => {
    const newRooms = state.rooms.filter((room) => room.id !== action.payload);

    return {
        ...state,
        rooms: newRooms,
        count: newRooms.length,
    };
};
