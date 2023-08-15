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
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;