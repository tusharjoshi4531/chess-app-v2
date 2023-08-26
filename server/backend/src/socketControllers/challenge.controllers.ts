import { Server, Socket } from "socket.io";
import { getUserSocketId } from "../service/database.service";

interface IChallengeUserPayload {
    from: string;
    to: string;
    time: {
        minutes: number;
        seconds: number;
    };
    color: number;
}

const challengeControllers = (io: Server, socket: Socket) => {
    const challengUser = async (
        data: IChallengeUserPayload,
        callback: (success: boolean, body: string) => void
    ) => {
        try {
            console.log(data);

            const socketId = await getUserSocketId(data.to);

            if (socketId === "") return callback(false, "User not online");

            io.to(socketId).emit("challenge-user/receive");

            callback(true, "Sent request");
        } catch (error) {
            callback(false, "something went wrong while challenging user");
        }
    };

    socket.on("challenge-user/send", challengUser);
};

export default challengeControllers;
