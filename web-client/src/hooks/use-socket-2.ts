import { useEffect, useRef } from "react";
import { useAlert } from "./use-alert";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../app/store";
import { IUserState } from "../app/features/user/types";
import { updateToken } from "../app/features/user/user-slice";
import { Socket } from "socket.io-client";

import SocketConn from "../socket/socket";

export const useSocket = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector<IStore, IUserState>(
    (state) => state.user
  );

  const socketRef = useRef<Socket>(SocketConn.Instance.Socket);

  const onAuthenticated = (data: {
    accessToken: string;
    refreshToken: string;
  }) => {
    alert.success("Authenticated to live server");
    dispatch(
      updateToken({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
    );
  };

  const onDisconnect = () => {
    alert.info("Disconnected from live server");
  };

  const onError = () => {
    alert.error("Error occured in live server");
  };

  const onConnectionFail = () => {
    alert.error("Couldn't connect to live server");
  };

  const connect = () => {
    if (socketRef.current.connected) return;
    socketRef.current.auth = {
      accessToken,
      refreshToken,
    };

    socketRef.current.on("user-authenticated", onAuthenticated);
    socketRef.current.on("disconnect", onDisconnect);
    socketRef.current.on("error", onError);
    socketRef.current.on("connect_failed", onConnectionFail);

    socketRef.current.connect();
  };

  const disconnect = () => {
    if (!socketRef.current.connected) return;

    socketRef.current.disconnect();
    socketRef.current.off("user-authenticated", onAuthenticated);
    socketRef.current.off("disconnect", onDisconnect);
    socketRef.current.off("error", onError);
    socketRef.current.off("connect_failed", onConnectionFail);
  };

  useEffect(() => {
    socketRef.current.auth = {
      accessToken,
      refreshToken,
    };
  }, [accessToken, refreshToken]);

  return { socket: socketRef.current, connect, disconnect };
};
