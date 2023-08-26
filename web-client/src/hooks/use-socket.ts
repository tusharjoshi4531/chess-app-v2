import { useCallback, useEffect } from "react";
import { useAlert } from "./use-alert";
import { socket } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../app/store";
import { IUserState } from "../app/features/user/types";
import { updateToken } from "../app/features/user/user-slice";
import { IChallengeUserPayload } from "../components/forms/ChallengeUserForm";
import { addNotification } from "../app/features/notification/notification-slice";
import { NotificationType } from "../app/features/notification/types";

export const useSocket = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { accessToken, refreshToken, userid } = useSelector<
        IStore,
        IUserState
    >((state) => state.user);

    const subscribeConnectionEvents = useCallback(() => {
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

        socket.on("user-authenticated", onAuthenticated);
        socket.on("disconnect", onDisconnect);
        socket.on("error", onError);
        socket.on("connect_failed", onConnectionFail);

        return () => {
            socket.off("user-authenticated", onAuthenticated);
            socket.off("disconnect", onDisconnect);
            socket.off("error", onError);
            socket.off("connect_failed", onConnectionFail);
        };
    }, [refreshToken, accessToken, alert]);

    const subscribeChallengeReceiveEvents = useCallback(() => {
        const onChallengeReceive = (data: IChallengeUserPayload) => {
            dispatch(
                addNotification({
                    type: NotificationType.REQUEST,
                    title: "Challenge Request!!!",
                    body: `${data.from} has challenged you`,
                    id: Date.now(),
                    from: data.from,
                    payload: { ...data },
                })
            );
        };

        socket.on("challenge-user/receive", onChallengeReceive);
        return () => socket.off("challenge-user/receive", onChallengeReceive);
    }, []);

    useEffect(() => {
        const connectionCleanup = subscribeConnectionEvents();
        const challengeReceiveCleanup = subscribeChallengeReceiveEvents();

        return () => {
            connectionCleanup();
            challengeReceiveCleanup();
        };
    }, [subscribeConnectionEvents]);

    useEffect(() => {
        if (userid) {
            socket.auth = {
                refreshToken,
                accessToken,
            };

            socket.connect();
        } else socket.disconnect();
    }, [userid, refreshToken, accessToken]);
};
