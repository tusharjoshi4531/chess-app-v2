import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./types";
import {
    setNotificationController,
    clearNotificationController,
} from "./action-controllers";

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification: setNotificationController,
        clearNotification: clearNotificationController,
    },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
