import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./types";
import { setConnectedController } from "./action-controllers";

export const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setConnected: setConnectedController,
    },
});

export const { setConnected } = socketSlice.actions;
export default socketSlice.reducer;
