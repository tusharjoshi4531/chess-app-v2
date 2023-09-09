import { useRef, useEffect, useReducer, useCallback } from "react";
import { SERVER_URL } from "../config/config";
import { useSelector } from "react-redux";
import { IStore } from "../app/store";
import { useAlert } from "./use-alert";
import {
    INotification,
    INotificationState,
    NotificationChagneType,
    initialNotifState,
} from "../context/types";

interface INotificationChange {
    data: INotification | INotification[] | { id: string };
    type: NotificationChagneType;
}

const POLL_INTERVAL = 3000;

const notificationReducer = (
    state: INotificationState,
    action: { type: string; payload: INotification | INotification[] | string }
) => {
    switch (action.type) {
        case "SET_NOTIFICATIONS":
            return {
                notifications: action.payload as INotification[],
                count: (action.payload as INotification[]).length,
            };
        case "ADD_NOTIFICATION":
            return {
                notifications: [
                    ...state.notifications,
                    action.payload as INotification,
                ],
                count: state.count + 1,
            };
        case "ADD_MANY_NOTIFICATIONS":
            return {
                notifications: [
                    ...state.notifications,
                    ...(action.payload as INotification[]),
                ],
                count: state.count + (action.payload as INotification[]).length,
            };
        case "REMOVE_NOTIFICATION": {
            const newNotifications = state.notifications.filter(
                (notif) => notif.id !== action.payload
            );

            return {
                ...state,
                notifications: newNotifications,
                count: newNotifications.length,
            };
        }
        default:
            return state;
    }
};

export const useNotification = () => {
    const source = useRef<EventSource | null>(null);
    const username = useSelector<IStore, string>(
        (state) => state.user.username
    );
    const alert = useAlert();

    const [state, dispatch] = useReducer(notificationReducer, {
        ...initialNotifState,
    });

    const addNotification = useCallback(
        (notification: INotification) => {
            alert.info("You have received a notification");
            dispatch({
                type: "ADD_NOTIFICATION",
                payload: notification,
            });
        },
        [alert.info]
    );

    const setNotifications = useCallback((notifications: INotification[]) => {
        dispatch({
            type: "SET_NOTIFICATIONS",
            payload: notifications,
        });
    }, []);

    const removeNotification = useCallback((id: string) => {
        dispatch({
            type: "REMOVE_NOTIFICATION",
            payload: id,
        });
    }, []);

    const clearNotifications = useCallback(() => {
        dispatch({
            type: "SET_NOTIFICATIONS",
            payload: [],
        });
    }, []);

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
    ]);

    return { state };
};
