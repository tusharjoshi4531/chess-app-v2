import { Server, Socket } from "socket.io";
import { removeLiveUserWithSocketId } from "../service/live-user.service";

const connectionControllers = (io: Server, socket: Socket) => {
  const disconnect = async () => {
    removeLiveUserWithSocketId(socket.id);

    console.log(`${socket.id} disconnected`);
  };

  console.log("Connected User " + socket.id);
  socket.emit("user-connected");
  console.log("Emitted connected event");

  socket.on("disconnect", disconnect);
};

export default connectionControllers;
