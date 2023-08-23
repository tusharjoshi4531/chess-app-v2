import { ISocketState } from "./types";
import { CaseReducer } from "@reduxjs/toolkit";

export const setConnectedController: CaseReducer<
    ISocketState,
    { payload: boolean; type: string }
> = (_, { payload }) => ({
    isConnected: payload,
});
