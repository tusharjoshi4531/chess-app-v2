import { configureStore } from "@reduxjs/toolkit";
import userReducer, { IUserState } from "./features/user/userSlice";

export interface IStore {
    user: IUserState;
}

export const store = configureStore<IStore>({
    reducer: {
        user: userReducer,
    },
});
