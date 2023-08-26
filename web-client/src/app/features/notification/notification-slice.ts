import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./types";
import {
    addNotificationController,
    removeNotificationController,
} from "./action-cotrollers";

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: addNotificationController,
        removeNotification: removeNotificationController,
    },
});

export const { addNotification, removeNotification } =
    notificationSlice.actions;
export default notificationSlice.reducer;
