import { INotificationState, initialState } from "./types";

export const setNotificationController = (
    state: INotificationState,
    action: { payload: INotificationState }
) => {
    state = action.payload;
    return state;
};
export const clearNotificationController = () => initialState;
