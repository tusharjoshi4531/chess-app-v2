import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../app/store";
import { useAlert } from "./use-alert";
import { INotification } from "../app/features/notification/types";

import {
  addNotification as addNotifToState,
  removeNotification as removeNotifFromState,
  setNotification as setNotifInState,
} from "../app/features/notification/notification-slice";
import { useSocket } from "./use-socket-2";

export const useNotification = () => {
  const username = useSelector<IStore, string>((state) => state.user.username);
  const alert = useAlert();
  const dispatch = useDispatch();
  const { socket, connect: connectSocket } = useSocket();

  const addNotification = useCallback(
    (notification: INotification) => {
      alert.info("You have received a notification");
      dispatch(addNotifToState(notification));
    },
    [alert, dispatch]
  );

  const setNotifications = useCallback(
    (notifications: INotification[]) => {
      dispatch(setNotifInState(notifications));
    },
    [dispatch]
  );

  const removeNotification = useCallback(
    (id: string) => {
      dispatch(removeNotifFromState(id));
    },
    [dispatch]
  );

  const clearNotifications = useCallback(() => {
    dispatch(setNotifInState([]));
  }, [dispatch]);

  useEffect(() => {
    if (username === "") {
      clearNotifications();
      return;
    }

    connectSocket();

    socket.on("notification/initial-notifications", setNotifications);
    socket.on("notification/notification-insert", addNotification);
    socket.on("notification/notification-delete", removeNotification);

    socket.emit("notification/subscribe", { username });

    return () => {
      socket.off("notification/initial-notifications", setNotifications);
      socket.off("notification/notification-insert", addNotification);
      socket.off("notification/notification-delete", removeNotification);
    };
  }, [
    username,
    clearNotifications,
    connectSocket,
    socket,
    setNotifications,
    addNotification,
    removeNotification,
  ]);
};
