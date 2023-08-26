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
}

export interface INotificationState {
    notifications: INotification[];
}

export const initialState: INotificationState = {
    notifications: [],
};
