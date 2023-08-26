import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/user-slice";
import alertReducer from "./features/alert/alert-slice";
import socketReducer from "./features/socket/socket-slice";
import { ISocketState } from "./features/socket/types";
import { IUserState } from "./features/user/types";
import { IAlertState } from "./features/alert/types";

export interface IStore {
    user: IUserState;
    alert: IAlertState;
    socketio: ISocketState;
}

export const store = configureStore<IStore>({
    reducer: {
        user: userReducer,
        alert: alertReducer,
        socketio: socketReducer,
    },
});
