import { AlertColor } from "@mui/material";

export interface IAlertState {
    body: string;
    type: AlertColor | undefined;
    time?: number;
}

export const initialState: IAlertState = {
    time: 0,
    body: "",
    type: undefined,
};
