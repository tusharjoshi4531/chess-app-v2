import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../app/store";
import { useAlert } from "./use-alert";

import { IRoom } from "../app/features/rooms/types";
import {
  addRoom as addRoomToRooms,
  removeRoom as removeRoomFromRooms,
  setRooms as setRoomsInRooms,
} from "../app/features/rooms/rooms-slice";
import { useSocket } from "./use-socket-2";

export const useRooms = () => {
  const username = useSelector<IStore, string>((state) => state.user.username);
  const alert = useAlert();

  const { socket, connect: connectSocket } = useSocket();

  const dispatch = useDispatch();

  const addRoom = useCallback(
    (room: IRoom) => {
      dispatch(addRoomToRooms(room));
      alert.info(`You have joined a game room`);
    },
    [alert, dispatch]
  );

  const setRooms = useCallback(
    (rooms: IRoom[]) => {
      dispatch(setRoomsInRooms(rooms));
    },
    [dispatch]
  );

  const removeRoom = useCallback(
    (id: string) => {
      dispatch(removeRoomFromRooms(id));
    },
    [dispatch]
  );

  const clearRooms = useCallback(() => {
    dispatch(setRoomsInRooms([]));
  }, [dispatch]);

  useEffect(() => {
    if (username === "") {
      clearRooms();
      return;
    }

    connectSocket();

    socket.on("room/initial", setRooms);
    socket.on("room/insert", addRoom);
    socket.on("room/delete", removeRoom);

    socket.emit("room/subscribe", { username });

    return () => {
      socket.off("room/initial", setRooms);
      socket.off("room/insert", addRoom);
      socket.off("room/delete", removeRoom);
      socket.emit("room/unsubscribe", { username });
    };
  }, [
    username,
    clearRooms,
    connectSocket,
    socket,
    setRooms,
    addRoom,
    removeRoom,
  ]);
};
