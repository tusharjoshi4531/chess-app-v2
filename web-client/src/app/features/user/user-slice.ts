import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./types";
import {
    clearUserController,
    setUserController,
    updateTokenController,
} from "./action-controllers";

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: setUserController,
        clearUser: clearUserController,
        updateToken: updateTokenController,
    },
});

export const { setUser, clearUser, updateToken } = userSlice.actions;
export default userSlice.reducer;
