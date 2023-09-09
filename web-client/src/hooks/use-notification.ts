import { useRef, useEffect, useReducer } from "react";
import { SERVER_URL } from "../config/config";
import { useSelector } from "react-redux";
import { IStore } from "../app/store";

export enum NotificationType {
    CHALLENGE = "CHALLENGE",
}

export enum NotificationChagneType {
    INITIAL_NOTIFICATIONS = "INITIAL_NOTIFICATIONS",
    NOTIFICATION_INSERT = "NOTIFICATION_INSERT",
    NOTIFICATION_DELETE = "NOTIFICATION_DELETE",
}

export interface IChallengePayload {
    challengeId: string;
}

export interface INotification {
    id: string;
    to: string;
    type: NotificationType;
    title: string;
    body: string;
    from: string;
    payload: IChallengePayload;
}

interface INotificationChange {
    data: INotification | INotification[] | { id: string };
    type: NotificationChagneType;
}

export interface INotificationState {
    notifications: INotification[];
}

export const initialState: INotificationState = {
    notifications: [],
};

const POLL_INTERVAL = 3000;

const notificationReducer = (
    state: INotificationState,
    action: { type: string; payload: INotification | INotification[] | string }
) => {
    switch (action.type) {
        case "SET_NOTIFICATIONS":
            return {
                ...state,
                notifications: action.payload as INotification[],
            };
        case "ADD_NOTIFICATION":
            return {
                ...state,
                notifications: [
                    ...state.notifications,
                    action.payload as INotification,
                ],
            };
        case "ADD_MANY_NOTIFICATIONS":
            return {
                ...state,
                notifications: [
                    ...state.notifications,
                    ...(action.payload as INotification[]),
                ],
            };
        case "REMOVE_NOTIFICATION":
            return {
                ...state,
                notifications: state.notifications.filter(
                    (notif) => notif.id !== action.payload
                ),
            };
        default:
            return state;
    }
};

export const useNotification = () => {
    const source = useRef<EventSource | null>(null);
    const username = useSelector<IStore, string>(
        (state) => state.user.username
    );

    const [state, dispatch] = useReducer(notificationReducer, {
        ...initialState,
    });

    const addNotification = (notification: INotification) => {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: notification,
        });
    };

    const setNotifications = (notifications: INotification[]) => {
        dispatch({
            type: "SET_NOTIFICATIONS",
            payload: notifications,
        });
    };

    const removeNotification = (id: string) => {
        dispatch({
            type: "REMOVE_NOTIFICATION",
            payload: id,
        });
    };

    useEffect(() => {
        if (username === "") return;

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
                    console.log("ADD NOTIFICATION");
                    addNotification(
                        notificationsChangeData.data as INotification
                    );
                    break;
                case NotificationChagneType.NOTIFICATION_DELETE:
                    console.log("REMOVE NOTIFICATION");
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
                source.current = new EventSource(sourceUrl);
            }
        }, POLL_INTERVAL);

        return () => {
            source.current?.close();
            clearInterval(interval);
        };
    }, [username, source]);

    return { state };
};
