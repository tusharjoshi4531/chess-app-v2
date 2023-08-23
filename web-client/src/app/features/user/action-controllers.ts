import { IUserState, initialState } from "./types";

export const setUserController = (state: IUserState, action: { payload: IUserState }) => {
    state = action.payload;
    return state;
};
export const clearUserController = () => initialState;
