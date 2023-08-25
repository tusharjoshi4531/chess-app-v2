import { useEffect } from "react";
import { useNotification } from "./use-notification";
import { socket } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../app/store";
import { IUserState } from "../app/features/user/types";
import { updateToken } from "../app/features/user/user-slice";

export const useSocket = () => {
    const notif = useNotification();
    const dispatch = useDispatch();
    const { accessToken, refreshToken, userid } = useSelector<
        IStore,
        IUserState
    >((state) => state.user);

    useEffect(() => {
        const onConnect = () => {
            notif.success("Connected to live server");
            socket.emit(
                "join-server",
                { accessToken, refreshToken },
                (
                    error: Record<string, unknown> | undefined,
                    accessToken: string,
                    refreshToken: string
                ) => {
                    if (error) {
                        notif.error("Authentication to live server failed");
                    } else {
                        notif.success("Joined live server");
                        console.log({ accessToken, refreshToken });
                        dispatch(updateToken({ accessToken, refreshToken }));
                    }
                }
            );
        };

        const onDisconnect = () => {
            notif.info("Disconnected from live server");
        };

        const onError = () => {
            notif.error("Error occured in live server");
        };

        const onConnectionFail = () => {
            notif.error("Couldn't connect to live server");
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("error", onError);
        socket.on("connect_failed", onConnectionFail);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("error", onError);
            socket.off("connect_failed", onConnectionFail);
        };
    }, [refreshToken, accessToken, notif]);

    useEffect(() => {
        if (userid) socket.connect();
        else socket.disconnect();
    }, [userid]);
};
