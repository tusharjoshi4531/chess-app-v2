import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./types";
import { clearUserController, setUserController } from "./action-controllers";

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: setUserController,
        clearUser: clearUserController,
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
