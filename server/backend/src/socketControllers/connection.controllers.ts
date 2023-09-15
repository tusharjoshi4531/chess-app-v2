import { Server, Socket } from "socket.io";
import { removeLiveUser } from "../service/live-user.service";

const connectionControllers = (io: Server, socket: Socket) => {
    const disconnect = async () => {
        removeLiveUser({ socketId: socket.id });
        console.log(`${socket.id} disconnected`);
    };

    socket.emit("user-connected");

    socket.on("disconnect", disconnect);
};

export default connectionControllers;
