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

const notificationReducer = (
    state: INotificationState,
    action: { type: string; payload: INotification | INotification[] | string }
) => {
    switch (action.type) {
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

    const addManyNotifications = (notifications: INotification[]) => {
        dispatch({
            type: "ADD_MANY_NOTIFICATIONS",
            payload: notifications,
        });
    };

    const removeNotification = (id: number) => {
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
                    addManyNotifications(
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

        return () => {
            source.current?.close();
        };
    }, [username, source]);

    return { state };
};
