import { INotification, INotificationState } from "./types";

export const setNotificationsController = (
    state: INotificationState,
    action: { payload: INotification[] }
) => ({
    notifications: action.payload as INotification[],
    count: (action.payload as INotification[]).length,
});

export const addNotificationController = (
    state: INotificationState,
    action: { payload: INotification }
) => ({
    notifications: [...state.notifications, action.payload as INotification],
    count: state.count + 1,
});

export const addManyNotificationsController = (
    state: INotificationState,
    action: { payload: INotification[] }
) => ({
    notifications: [
        ...state.notifications,
        ...(action.payload as INotification[]),
    ],
    count: state.count + (action.payload as INotification[]).length,
});

export const removeNotificationController = (
    state: INotificationState,
    action: { payload: string }
) => {
    const newNotifications = state.notifications.filter(
        (notif) => notif.id !== action.payload
    );

    return {
        ...state,
        notifications: newNotifications,
        count: newNotifications.length,
    };
};
