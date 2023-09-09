// notification
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

export const initialNotifState: INotificationState = {
    count: 0,
    notifications: [],
};

// rooms
export enum RoomsChangeType {
    INITIAL_ROOMS = "INITIAL_ROOMS",
    ROOM_INSERT = "ROOM_INSERT",
    ROOM_DELETE = "ROOM_DELETE",
}

export interface IRoom {
    id: string
    white: string;
    whiteConnected: boolean;
    black: string;
    blackConnected: boolean;
    boardHistory: string[];
}

export interface IRoomState {
    count: number;
    rooms: IRoom[];
}

export const initialRoomState: IRoomState = {
    count: 0,
    rooms: [],
};
