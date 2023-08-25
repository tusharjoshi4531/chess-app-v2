import { IUserState, initialState } from "./types";

export const setUserController = (
    state: IUserState,
    action: { payload: IUserState }
) => {
    state = action.payload;
    return state;
};
export const clearUserController = () => initialState;

export const updateTokenController = (
    state: IUserState,
    action: { payload: { accessToken: string; refreshToken: string } }
) => ({
    ...state,
    accessToken: action.payload.accessToken,
    refreshToken: action.payload.refreshToken,
});
