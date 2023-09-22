import { useEffect, useRef } from "react";
import { useAlert } from "./use-alert";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../app/store";
import { IUserState } from "../app/features/user/types";
import { updateToken } from "../app/features/user/user-slice";
import { Socket, io } from "socket.io-client";
import { SOCKETIO_URL } from "../config/config";

export const useSocket = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { accessToken, refreshToken } = useSelector<IStore, IUserState>(
        (state) => state.user
    );

    const socketRef = useRef<Socket | null>(null);

    const onAuthenticated = (data: {
        accessToken: string;
        refreshToken: string;
    }) => {
        alert.success("Authenticated to live server");
        dispatch(
            updateToken({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            })
        );
    };

    const onDisconnect = () => {
        alert.info("Disconnected from live server");
    };

    const onError = () => {
        alert.error("Error occured in live server");
    };

    const onConnectionFail = () => {
        alert.error("Couldn't connect to live server");
    };

    const connect = () => {
        socketRef.current = io(SOCKETIO_URL, {
            auth: { accessToken, refreshToken },
        });

        socketRef.current.on("user-authenticated", onAuthenticated);
        socketRef.current.on("disconnect", onDisconnect);
        socketRef.current.on("error", onError);
        socketRef.current.on("connect_failed", onConnectionFail);
    };

    const disconnect = () => {
        socketRef.current?.disconnect();
        socketRef.current?.off("user-authenticated", onAuthenticated);
        socketRef.current?.off("disconnect", onDisconnect);
        socketRef.current?.off("error", onError);
        socketRef.current?.off("connect_failed", onConnectionFail);
    };

    useEffect(() => {
        if (!socketRef.current) return;
        socketRef.current.auth = {
            accessToken,
            refreshToken,
        };
    }, [accessToken, refreshToken]);

    return { socket: socketRef.current, connect, disconnect };
};
