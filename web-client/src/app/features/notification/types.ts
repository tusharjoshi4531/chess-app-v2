export enum NotificationType {
    INFO,
    REQUEST,
}

export interface INotification {
    id: number;
    type: NotificationType;
    title: string;
    body: string;
    from: string;
    payload?: Record<string | number | symbol, unknown>;
}

export interface INotificationState {
    notifications: INotification[];
}

export const initialState: INotificationState = {
    notifications: [],
};
