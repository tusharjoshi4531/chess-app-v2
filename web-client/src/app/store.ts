import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/user-slice";
import notificationReducer from "./features/notification/notification-slice";
import socketReducer from "./features/socket/socket-slice";
import { ISocketState } from "./features/socket/types";
import { IUserState } from "./features/user/types";
import { INotificationState } from "./features/notification/types";

export interface IStore {
    user: IUserState;
    notification: INotificationState;
    socketio: ISocketState;
}

export const store = configureStore<IStore>({
    reducer: {
        user: userReducer,
        notification: notificationReducer,
        socketio: socketReducer,
    },
});
