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

export interface INotificationState {
    count: number;
    notifications: INotification[];
}

export const initialState: INotificationState = {
    count: 0,
    notifications: [],
};
