import { Server, Socket } from "socket.io";
import { getUsernameFromSocketId } from "../service/live-user.service";
import { IRoom } from "../model/room.model";
import { AppError, error500 } from "../error/app.error";
import { getRoomById, pushMessage, transformRoom } from "../service/room.service";

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
    console.log({ auth: socket.handshake.auth });

    const joinRoom = async (
        data: { roomid: string },
        cb: (error: AppError | null, data: IRoom | null) => void
    ) => {
        console.log(data);

        try {
            const room = await getRoomById(data.roomid);
            if (!room) throw error500("Room not found");

            const username = await getUsernameFromSocketId(socket.id);

            socket.join(data.roomid);
            socket.to(data.roomid).emit("room/user-joined", username);

            cb(null, transformRoom(room));
        } catch (error) {
            cb(error as AppError, null);
        }
    };

    const sendMessage = async (
        data: { roomid: string; message: string },
        cb?: (error: AppError | null, data: IRoom | null) => void
    ) => {
        try {
            const username = await getUsernameFromSocketId(socket.id);

            await pushMessage(data.roomid, {
                username: username,
                message: data.message,
            });

            const room = await getRoomById(data.roomid);
            
            socket.to(data.roomid).emit("room/data", {
                data: transformRoom(room),
            });

            cb && cb(null, null);
        } catch (error) {
            cb && cb(error as AppError, null);
        }
    };

    socket.on("room/join", joinRoom);
    socket.on("room/send-message", sendMessage);

    // const challengUser = async (
    //     data: IChallengeUserPayload,
    //     callback: (success: boolean, body: string) => void
    // ) => {
    //     try {
    //         console.log(data);

    //         const socketId = await getUserSocketId(data.to);

    //         if (socketId === "") return callback(false, "User not online");

    //         io.to(socketId).emit("challenge-user/receive", {
    //             payload: data,
    //             expiresIn: 300000,
    //         }); // 5 mins expire time

    //         callback(true, "Sent request");
    //     } catch (error) {
    //         callback(false, "something went wrong while challenging user");
    //     }
    // };

    // socket.on("challenge-user/send", challengUser);
};

export default challengeControllers;
