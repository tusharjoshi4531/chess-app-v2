import { AlertColor } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";

export interface INotificationState {
    open: boolean;
    body: string;
    type: AlertColor | undefined;
}

const initialState: INotificationState = {
    open: false,
    body: "",
    type: undefined,
};

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification: (state, action: { payload: INotificationState }) => {
            if (state.type) return state;
            state = action.payload;
            return state;
        },
        hideNotification: (state) => ({ ...state, open: false }),
        clearNotification: () => initialState,
    },
});

export const { setNotification, clearNotification, hideNotification } =
    notificationSlice.actions;
export default notificationSlice.reducer;
