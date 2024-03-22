import { Server, Socket } from "socket.io";
import { AppError, error400 } from "../error/app.error";
import {
  NotificationChagneType,
  getNotifications,
  subscribeNotificationChange,
} from "../service/notification.service";

export const notificationControllers = (io: Server, socket: Socket) => {
  // Cleanup
  let cleanup: (() => void) | null = null;

  // Controllers
  const subscribeNotification = async (
    data: { username: string },
    cb: (error: AppError | null) => void
  ) => {
    try {
      if (!data.username) throw error400("Username is required");

      const notifications = await getNotifications(data.username);

      socket.emit("notification/initial", notifications);

      cleanup = subscribeNotificationChange(data.username, (notification) => {
        const irreleventChange =
          (notification.data as any).to !== data.username;
        if (irreleventChange) return;

        const changeMessage = {
          type: notification.type,
          data: notification.data,
        };

        switch (notification.type) {
          case NotificationChagneType.NOTIFICATION_INSERT:
            socket.emit("notification/insert", changeMessage.data);
            break;
          case NotificationChagneType.NOTIFICATION_DELETE:
            socket.emit("notification/delete", changeMessage.data);
            break;
          default:
            break;
        }
      });
    } catch (err) {
      console.log(err);
      cb && cb(err as AppError);
    }
  };

  const unsubscribeNotification = () => {
    console.log(cleanup);

    cleanup && cleanup();
  };

  const disconnect = () => {
    cleanup && cleanup();
  };

  // Bind events
  socket.on("notification/subscribe", subscribeNotification);
  socket.on("notification/unsubscribe", unsubscribeNotification);
  socket.on("disconnect", disconnect);
};
