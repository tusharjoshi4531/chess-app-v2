import { EventEmitter } from "stream";
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

export interface INotificationChange {
  data: ISavedNotification | { id: string; to: string };
  type: NotificationChagneType;
}

// Event emiter
class NotificationEventEmitter extends EventEmitter {
  private connectedUsers: Map<
    string,
    (notification: INotificationChange) => void
  >;
  constructor() {
    super();
    this.connectedUsers = new Map();
  }

  emitNotificationChange(notificationChange: INotificationChange) {
    this.emit("notification/change", notificationChange);
  }

  onNotificationChange(
    username: string,
    callback: (notificationChange: INotificationChange) => void
  ) {
    const oldCallback = this.connectedUsers.get(username);
    oldCallback && this.off("notification/change", oldCallback);

    this.connectedUsers.set(username, callback);
    this.on("notification/change", callback);
  }

  offNotificationChange(username: string) {
    if (!this.connectedUsers.has(username)) return;

    const callback = this.connectedUsers.get(username)!;
    this.off("notification/change", callback);

    this.connectedUsers.delete(username);
  }
}

const notificationEventEmitter = new NotificationEventEmitter();

// Functions and methods
export const createNotification = async (
  notification: INotification,
  life: number = 300000
) => {
  try {
    const res = await notificationModel.create({
      ...notification,
      timestamp: Date.now() + life,
    });

    notificationEventEmitter.emitNotificationChange({
      data: transformNotificationDoc(res),
      type: NotificationChagneType.NOTIFICATION_INSERT,
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

    if (!res) throw error500("Error deleting notification");

    notificationEventEmitter.emitNotificationChange({
      data: { id: notificationId, to: res.to },
      type: NotificationChagneType.NOTIFICATION_DELETE,
    });

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
  notificationEventEmitter.onNotificationChange(username, callback);
  return () => {
    notificationEventEmitter.offNotificationChange(username);
  };
  // const pipeline = [
  //     {
  //         $match: {
  //             $or: [
  //                 { "fullDocument.to": username },
  //                 { operationType: "delete" },
  //             ],
  //         },
  //     },
  // ];
  // const changeStream = notificationModel
  //     .watch(pipeline)
  //     .on("change", (data) => {
  //         if (data.operationType === "insert") {
  //             callback({
  //                 data: transformNotificationDoc(
  //                     data.fullDocument as INotificationDoc
  //                 ),
  //                 type: NotificationChagneType.NOTIFICATION_INSERT,
  //             });
  //         } else if (data.operationType === "delete") {
  //             callback({
  //                 data: { id: data.documentKey._id },
  //                 type: NotificationChagneType.NOTIFICATION_DELETE,
  //             });
  //         }
  //     });
  // return changeStream;
};

export const unsubscribeNotificationChange = (username: string) =>
  notificationEventEmitter.offNotificationChange(username);
