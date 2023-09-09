import { error500 } from "../error/app.error";
import notificationModel, {
    INotification,
    INotificationDoc,
    ISavedNotification,
} from "../model/notification.model";

// Types
export enum NotificationChagneType {
    INITIAL_NOTIFICATIONS = "INITIAL_NOTIFICATIONS",
    NOTIFICATION_INSERT = "NOTIFICATION_INSERT",
    NOTIFICATION_DELETE = "NOTIFICATION_DELETE",
}

interface INotificationChange {
    data: ISavedNotification | { id: string };
    type: NotificationChagneType;
}

// Functions and methods
export const createNotification = async (
    notification: INotification,
    life: number = 300000
) => {
    try {
        console.log(notification);
        const res = await notificationModel.create({
            ...notification,
            timestamp: Date.now() + life,
        });
        return res;
    } catch (error) {
        console.log(error);
        throw error500("Error creating notification");
    }
};

export const deleteNotification = async (notificationId: string) => {
    try {
        const res = await notificationModel.findByIdAndDelete(notificationId);
        return res;
    } catch (error) {
        throw error500("Error deleting notification");
    }
};

const transformNotificationDoc = (
    doc: INotificationDoc
): ISavedNotification => ({
    id: doc._id,
    from: doc.from,
    type: doc.type,
    title: doc.title,
    body: doc.body,
    to: doc.to,
    payload: doc.payload,
});

export const getNotifications = async (username: string) => {
    try {
        const res = await notificationModel.find({ to: username });
        return res.map<ISavedNotification>((notif) =>
            transformNotificationDoc(notif)
        );
    } catch (error) {
        throw error500("Error fetching notifications");
    }
};

export const subscribeNotificationChange = (
    username: string,
    callback: (notificationChange: INotificationChange) => void
) => {
    const pipeline = [
        {
            $match: {
                $or: [
                    { "fullDocument.to": username },
                    { operationType: "delete" },
                ],
            },
        },
    ];

    const changeStream = notificationModel
        .watch(pipeline)
        .on("change", (data) => {
            if (data.operationType === "insert") {
                callback({
                    data: transformNotificationDoc(
                        data.fullDocument as INotificationDoc
                    ),
                    type: NotificationChagneType.NOTIFICATION_INSERT,
                });
            } else if (data.operationType === "delete") {
                callback({
                    data: { id: data.documentKey._id },
                    type: NotificationChagneType.NOTIFICATION_DELETE,
                });
            }
        });
    return changeStream;
};
