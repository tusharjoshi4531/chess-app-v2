import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/user-slice";
import alertReducer from "./features/alert/alert-slice";
import socketReducer from "./features/socket/socket-slice";
import notificatioinReducer from "./features/notification/notification-slice";
import roomsReducer from "./features/rooms/rooms-slice";
import { ISocketState } from "./features/socket/types";
import { IUserState } from "./features/user/types";
import { IAlertState } from "./features/alert/types";
import { INotificationState } from "./features/notification/types";
import { IRoomState } from "./features/rooms/types";

export interface IStore {
    user: IUserState;
    alert: IAlertState;
    socketio: ISocketState;
    notification: INotificationState;
    rooms: IRoomState;
}

export const store = configureStore<IStore>({
    reducer: {
        user: userReducer,
        alert: alertReducer,
        socketio: socketReducer,
        notification: notificatioinReducer,
        rooms: roomsReducer,
    },
});
