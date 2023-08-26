import { Server, Socket } from "socket.io";
import { removeLiveUser } from "../service/database.service";

const connectionControllers = (io: Server, socket: Socket) => {
    const disconnect = async () => {
        removeLiveUser({ socketId: socket.id });
        console.log(`${socket.id} disconnected`);
    };

    socket.on("disconnect", disconnect);
};

export default connectionControllers;
