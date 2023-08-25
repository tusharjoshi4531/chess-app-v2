import { AlertColor } from "@mui/material";

export interface IAlertState {
    body: string;
    type: AlertColor | undefined;
}

export interface INotificationState extends IAlertState {
    time: number;
}

export const initialState: INotificationState = {
    time: 0,
    body: "",
    type: undefined,
};
