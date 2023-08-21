import { configureStore } from "@reduxjs/toolkit";
import userReducer, { IUserState } from "./features/user/user-slice";
import notificationReducer, {
    INotificationState,
} from "./features/notification/notification-slice";

export interface IStore {
    user: IUserState;
    notification: INotificationState;
}

export const store = configureStore<IStore>({
    reducer: {
        user: userReducer,
        notification: notificationReducer,
    },
});
