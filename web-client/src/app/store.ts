import { configureStore } from "@reduxjs/toolkit";
import userReducer, { IUserState } from "./features/user/user-slice";

export interface IStore {
    user: IUserState;
}

export const store = configureStore<IStore>({
    reducer: {
        user: userReducer,
    },
});
