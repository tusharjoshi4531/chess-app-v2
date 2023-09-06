import { Document, Schema, model } from "mongoose";

export enum NotificationType {
    CHALLENGE = "CHALLENGE",
    INFO = "INFO",
}

export interface INotification {
    from: string;
    type: NotificationType;
    title: string;
    body: string;
    to: string;
    payload: Record<string, any>;
}

export interface ISavedNotification extends INotification {
    id: string;
}

export interface INotificationDoc extends Document, INotification {
    timestamp: Date;
}

const notificationSchema = new Schema<INotificationDoc>({
    from: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: Object.values(NotificationType),
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    to: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    timestamp: {
        type: Date,
        required: true,
        expires: 0,
        default: Date.now() + 300000,
    },
});

const notificationModel = model<INotificationDoc>(
    "Notifications",
    notificationSchema
);

notificationModel.watch().on("change", (data) => {
    console.log(data);
});

export default notificationModel;
