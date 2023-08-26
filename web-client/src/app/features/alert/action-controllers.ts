import { IAlertState, initialState } from "./types";

export const setAlertController = (
    state: IAlertState,
    action: { payload: IAlertState }
) => {
    state = { ...action.payload, time: Date.now() };
    return state;
};
export const clearAlertController = () => initialState;
