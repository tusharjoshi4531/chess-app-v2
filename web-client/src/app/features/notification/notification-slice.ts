import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./types";
import {
    addNotificationController,
    removeNotificationController,
    addManyNotificationsController,
    setNotificationsController,
} from "./action-cotrollers";

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: addNotificationController,
        removeNotification: removeNotificationController,
        addManyNotifications: addManyNotificationsController,
        setNotification: setNotificationsController,
    },
});

export const {
    addNotification,
    removeNotification,
    addManyNotifications,
    setNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
