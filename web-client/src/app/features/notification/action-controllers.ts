import { IAlertState, INotificationState, initialState } from "./types";

export const setNotificationController = (
    state: INotificationState,
    action: { payload: IAlertState }
) => {
    state = { ...action.payload, time: Date.now() };
    return state;
};
export const clearNotificationController = () => initialState;
