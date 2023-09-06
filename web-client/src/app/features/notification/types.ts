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
    actions: { label: string; fn: () => void }[];
    expiresIn: number;
}

export interface INotificationState {
    notifications: number;
}

export const initialState: INotificationState = {
    notifications: 0,
};
