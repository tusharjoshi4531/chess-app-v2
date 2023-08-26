import { INotification, INotificationState } from "./types";

export const addNotificationController = (
    state: INotificationState,
    action: { payload: INotification }
) => ({ notifications: [action.payload, ...state.notifications] });

export const removeNotificationController = (
    state: INotificationState,
    action: { payload: number }
) => ({
    notifications: state.notifications.filter(
        (notif) => notif.id !== action.payload
    ),
});
