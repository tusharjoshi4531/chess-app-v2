import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./types";
import { setAlertController, clearAlertController } from "./action-controllers";

export const alertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        setAlert: setAlertController,
        clearAlert: clearAlertController,
    },
});

export const { setAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;
