import { useEffect } from "react";
import { useNotification } from "./use-notification";
import { socket } from "../socket";

export const useSocket = () => {
    const notif = useNotification();

    useEffect(() => {
        const onConnect = () => {
            notif.success("Connected to live server");
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
    }, []);
};
