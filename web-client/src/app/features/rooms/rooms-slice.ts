import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./types";
import {
    addManyRoomsController,
    addRoomController,
    removeRoomController,
    setRoomsController,
} from "./action-controllers";

const roomsSlice = createSlice({
    name: "rooms",
    initialState,
    reducers: {
        setRooms: setRoomsController,
        addRoom: addRoomController,
        addManyRooms: addManyRoomsController,
        removeRoom: removeRoomController,
    },
});

export const { setRooms, addRoom, addManyRooms, removeRoom } =
    roomsSlice.actions;

export default roomsSlice.reducer;
