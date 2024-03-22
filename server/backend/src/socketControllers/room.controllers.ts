import { Server, Socket } from "socket.io";
import { getUsernameFromSocketId } from "../service/live-user.service";
import { IRoom } from "../model/room.model";
import { AppError, error500 } from "../error/app.error";
import {
  getRoomById,
  pushMessage,
  pushMove,
  finishGame,
  transformRoom,
  subscribeRoomChange,
  RoomsChangeType,
  getRooms,
  // joinUserToRoom,
} from "../service/room.service";

export const roomInfoControllers = (io: Server, socket: Socket) => {
  // Cleanup
  let cleanup: () => void = () => {};

  // controllers
  const subscribeRooms = async (
    data: { username: string },
    cb: (error: AppError | null) => void
  ) => {
    try {
      if (!data.username) throw error500("Username is required");

      const rooms = await getRooms(data.username);

      socket.emit("room/initial", rooms);

      cleanup = subscribeRoomChange(data.username, (room) => {
        const irreleventChange =
          (room.data as IRoom).white !== data.username &&
          (room.data as IRoom).black !== data.username;

        if (irreleventChange) return;

        const changeMessage = {
          type: room.type,
          data: room.data,
        };

        switch (room.type) {
          case RoomsChangeType.ROOM_INSERT:
            socket.emit("room/insert", changeMessage.data);
            break;
          case RoomsChangeType.ROOM_DELETE:
            socket.emit("room/delete", changeMessage.data);
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

  const unsubscribeRooms = () => {
    cleanup();
  };

  // Bind events
  socket.on("room/subscribe", subscribeRooms);
  socket.on("room/unsubscribe", unsubscribeRooms);
  socket.on("disconnect", () => {
    cleanup();
  });
};

const roomControllers = (io: Server, socket: Socket) => {
  const joinRoom = async (
    data: { roomid: string },
    cb: (error: AppError | null, data: IRoom | null) => void
  ) => {
    try {
      const room = await getRoomById(data.roomid);
      if (!room) throw error500("Room not found");

      const username = await getUsernameFromSocketId(socket.id);

      // // Join in database
      // joinUserToRoom(username, data.roomid);

      socket.join(data.roomid);
      socket.to(data.roomid).emit("room/user-joined", username);

      cb(null, transformRoom(room));
    } catch (error) {
      console.log("Error in joinRoom");
      console.log(error);
      cb(error as AppError, null);
    }
  };

  const sendMessage = async (
    data: { roomid: string; message: string },
    cb?: (error: AppError | null) => void
  ) => {
    try {
      const username = await getUsernameFromSocketId(socket.id);

      await pushMessage(data.roomid, {
        username: username,
        message: data.message,
      });

      const room = await getRoomById(data.roomid);

      io.to(data.roomid).emit("room/data", transformRoom(room));
    } catch (error) {
      console.log(error);
      cb && cb(error as AppError);
    }
  };

  const sendMove = async (
    data: { roomid: string; fen: string; turn: "w" | "b" },
    cb?: (error: AppError | null) => void
  ) => {
    try {
      await pushMove(data.roomid, data.fen, data.turn);
      const room = await getRoomById(data.roomid);

      io.to(data.roomid).emit("room/data", transformRoom(room));
    } catch (error) {
      console.log(error);
      cb && cb(error as AppError);
    }
  };

  const sendResign = async (
    data: { roomid: string; username: string },
    cb?: (error: AppError | null) => void
  ) => {
    try {
      const room = await finishGame(data.roomid);

      console.log(room);

      io.to(data.roomid).emit("room/result", `${data.username} resigned`);
      io.to(data.roomid).emit("room/data", transformRoom(room));
    } catch (error) {
      console.log(error);
      cb && cb(error as AppError);
    }
  };

  const sendChckmate = async (
    data: { roomid: string; username: string },
    cb?: (error: AppError | null) => void
  ) => {
    try {
      const room = await finishGame(data.roomid);

      io.to(data.roomid).emit(
        "room/result",
        `${data.username} won by checkmate`
      );
      io.to(data.roomid).emit("room/data", transformRoom(room));
    } catch (error) {
      console.log(error);
      cb && cb(error as AppError);
    }
  };

  const sendDraw = async (
    data: { roomid: string; username: string },

    cb?: (error: AppError | null) => void
  ) => {
    try {
      const room = await finishGame(data.roomid);

      io.to(data.roomid).emit("room/result", `Game ended in a Draw`);
      io.to(data.roomid).emit("room/data", transformRoom(room));
    } catch (error) {
      console.log(error);
      cb && cb(error as AppError);
    }
  };

  const sendTimeout = async (
    data: { roomid: string; username: string },
    cb?: (error: AppError | null) => void
  ) => {
    try {
      const room = await finishGame(data.roomid);

      io.to(data.roomid).emit(
        "room/result",
        `${data.username} lost by timeout`
      );
      io.to(data.roomid).emit("room/data", transformRoom(room));
    } catch (error) {
      console.log(error);
      cb && cb(error as AppError);
    }
  };

  socket.on("room/join", joinRoom);
  socket.on("room/send-message", sendMessage);
  socket.on("room/send-move", sendMove);
  socket.on("room/send-resign", sendResign);
  socket.on("room/send-checkmate", sendChckmate);
  socket.on("room/send-draw", sendDraw);
  socket.on("room/send-timeout", sendTimeout);
};

export default roomControllers;
