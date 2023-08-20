import { createSlice } from "@reduxjs/toolkit";

export interface IUserState {
    username: string;
    userid: string;
    firstname: string;
    lastname: string;
}

const initialState: IUserState = {
    username: "",
    userid: "",
    firstname: "",
    lastname: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state = action.payload;
            return state;
        },
        clearUser: () => initialState,
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
