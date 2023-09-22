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
} from "../service/room.service";

const roomControllers = (io: Server, socket: Socket) => {
    console.log({ auth: socket.handshake.auth });

    const joinRoom = async (
        data: { roomid: string },
        cb: (error: AppError | null, data: IRoom | null) => void
    ) => {
        console.log({ joinRoomData: data });

        try {
            const room = await getRoomById(data.roomid);
            if (!room) throw error500("Room not found");

            console.log({ room });

            const username = await getUsernameFromSocketId(socket.id);

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
            console.log(data);

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
