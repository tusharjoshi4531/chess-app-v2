import { Server, Socket } from "socket.io";
import { removeLiveUser } from "../service/live-user.service";

const connectionControllers = (io: Server, socket: Socket) => {
    const disconnect = async () => {
        removeLiveUser({ socketId: socket.id });
        console.log(socket.rooms)
        console.log(`${socket.id} disconnected`);
    };

    console.log("Connected User " + socket.id)
    socket.emit("user-connected");
    console.log("Emitted connected event");

    socket.on("disconnect", disconnect);
};

export default connectionControllers;
