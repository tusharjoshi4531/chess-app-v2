import {AlertColor} from "@mui/material"

export interface INotificationState {
    body: string;
    type: AlertColor | undefined;
}

export const initialState: INotificationState = {
    body: "",
    type: undefined,
};
