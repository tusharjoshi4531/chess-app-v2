import { RequestHandler } from "express";
import { INotification, ISavedNotification } from "../model/notification.model";
import {
  NotificationChagneType,
  createNotification,
  deleteNotification,
  getNotifications,
  subscribeNotificationChange,
} from "../service/notification.service";
import { error400, success200, success201 } from "../error/app.error";

export const subscribe: RequestHandler<
  { username: string },
  {},
  { ssid: string },
  {}
> = async (req, res, next) => {
  if (!req.params.username) return next(error400("Username is required"));

  const notifications = await getNotifications(req.params.username);

  const notificationMessage = {
    type: NotificationChagneType.INITIAL_NOTIFICATIONS,
    data: notifications,
  };

  res.write(`id: ${req.body.ssid}\n`);
  res.write(`data: ${JSON.stringify(notificationMessage)}\n\n`);

  const cleanup = subscribeNotificationChange(
    req.params.username,
    (notification) => {
      const irreleventChange =
        (notification.data as ISavedNotification).to !== req.params.username;

      if (irreleventChange) return;

      const changeMessage = {
        type: notification.type,
        data: notification.data,
      };

      res.write(`id: ${req.body.ssid}\n`);
      res.write(`data: ${JSON.stringify(changeMessage)}\n\n`);
    }
  );

  req.on("close", () => {
    cleanup();
  });
};

export const addNotification: RequestHandler<
  {},
  {},
  INotification,
  {}
> = async (req, res, next) => {
  try {
    await createNotification(req.body, 5000);
    next(success201());
  } catch (error) {
    next(error);
  }
};

export const removeNotifiation: RequestHandler<
  { notificationId: string },
  {},
  {},
  {}
> = async (req, res, next) => {
  try {
    await deleteNotification(req.params.notificationId);
    next(success200());
  } catch (error) {
    next(error);
  }
};
