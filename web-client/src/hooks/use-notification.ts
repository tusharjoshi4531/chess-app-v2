import { useRef, useEffect, useCallback } from "react";
import { SERVER_URL } from "../config/config";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../app/store";
import { useAlert } from "./use-alert";
import {
    INotification,
    NotificationChagneType,
} from "../app/features/notification/types";

import {
    addNotification as addNotifToState,
    removeNotification as removeNotifFromState,
    setNotification as setNotifInState,
} from "../app/features/notification/notification-slice";

interface INotificationChange {
    data: INotification | INotification[] | { id: string };
    type: NotificationChagneType;
}

const POLL_INTERVAL = 3000;

export const useNotification = () => {
    const source = useRef<EventSource | null>(null);
    const username = useSelector<IStore, string>(
        (state) => state.user.username
    );
    const alert = useAlert();
    const dispatch = useDispatch();

    const addNotification = useCallback(
        (notification: INotification) => {
            alert.info("You have received a notification");
            dispatch(addNotifToState(notification));
        },
        [alert, dispatch]
    );

    const setNotifications = useCallback(
        (notifications: INotification[]) => {
            dispatch(setNotifInState(notifications));
        },
        [dispatch]
    );

    const removeNotification = useCallback(
        (id: string) => {
            dispatch(removeNotifFromState(id));
        },
        [dispatch]
    );

    const clearNotifications = useCallback(() => {
        dispatch(setNotifInState([]));
    }, [dispatch]);

    useEffect(() => {
        if (username === "") {
            clearNotifications();
            return;
        }

        const sourceUrl = `${SERVER_URL}/notifications/subscribe/${username}`;
        source.current = new EventSource(sourceUrl);

        source.current.onmessage = (e) => {
            const notificationsChangeData: INotificationChange = JSON.parse(
                e.data
            );
            switch (notificationsChangeData.type) {
                case NotificationChagneType.INITIAL_NOTIFICATIONS:
                    setNotifications(
                        notificationsChangeData.data as INotification[]
                    );
                    break;
                case NotificationChagneType.NOTIFICATION_INSERT:
                    addNotification(
                        notificationsChangeData.data as INotification
                    );
                    break;
                case NotificationChagneType.NOTIFICATION_DELETE:
                    removeNotification(
                        (notificationsChangeData.data as { id: string }).id
                    );
                    break;
                default:
                    break;
            }
        };

        source.current.onerror = (e) => {
            console.log(e);
        };

        // Poll if connection is closed
        const interval = setInterval(() => {
            if (source.current?.readyState === EventSource.CLOSED) {
                source.current?.close();
                source.current = null;
            }
        }, POLL_INTERVAL);

        return () => {
            source.current?.close();
            clearInterval(interval);
        };
    }, [
        username,
        source,
        addNotification,
        setNotifications,
        removeNotification,
        clearNotifications,
    ]);
};
