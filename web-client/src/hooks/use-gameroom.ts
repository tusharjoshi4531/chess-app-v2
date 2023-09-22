import { useParams } from "react-router-dom";
import { useAlert } from "./use-alert";
import { useSocket } from "./use-socket";
import { useEffect, useState } from "react";

export interface IRoomData {
    id: string;
    white: string;
    whiteConnected: boolean;
    whiteRemainigTime: number;
    turn: "w" | "b";
    black: string;
    blackConnected: boolean;
    blackRemainigTime: number;
    lastMoveTime: number;
    boardHistory: string[];
    spectators: string[];
    chats: { id: string; username: string; message: string }[];
    timerStarted: boolean;
    finished: boolean;
}

const dummyState: IRoomData = {
    id: "",
    white: "white",
    whiteConnected: false,
    turn: "w",
    whiteRemainigTime: 0,
    black: "black",
    blackConnected: false,
    blackRemainigTime: 0,
    lastMoveTime: 0,
    boardHistory: [],
    spectators: [],
    chats: [],
    timerStarted: false,
    finished: false,
};

export type IGameState = "continue" | "draw" | "checkmate" | "timeout";

export const useGameRoom = () => {
    const { roomid } = useParams();
    const alert = useAlert();
    const { socket, connect, disconnect } = useSocket();
    const [roomState, setRoomState] = useState(dummyState);

    useEffect(() => {
        if (!socket) {
            connect();
            return;
        }

        const receiveRoomData = (
            error: unknown | undefined,
            data: IRoomData
        ) => {
            console.log(error, data);
            setRoomState(data);
        };

        const onOtherJoinRoom = (username: string) => {
            alert.info(`${username} joined the room`);
        };

        const onConnect = () => {
            socket.emit("room/join", { roomid }, receiveRoomData);
        };

        const onRoomData = (data: IRoomData) => {
            console.log({ updatedData: data });
            setRoomState(data);
        };

        const onGameResult = (result: string) => {
            alert.info(result);
            setRoomState((state) => ({ ...state, timerStarted: false }));
        };

        socket.on("user-connected", onConnect);
        socket.on("room/user-joined", onOtherJoinRoom);
        socket.on("room/data", onRoomData);
        socket.on("room/result", onGameResult);

        return () => {
            disconnect();
            socket.off("user-connected", onConnect);
            socket.off("room/user-joined", onOtherJoinRoom);
        };
    }, [socket]);

    const sendMessageHandler = (message: string) => {
        if (!socket || !roomid) return;
        console.log(message);
        socket.emit("room/send-message", { roomid, message });
    };

    const sendMoveHandler = (fen: string, turn: "w" | "b") => {
        console.log({ stateFromHOOK: roomState });
        if (!socket || !roomid || roomState.finished) return;
        socket.emit(
            "room/send-move",
            { roomid, fen, turn },
            (error: unknown) => {
                if (error) {
                    alert.error("Couldn't make move in server");
                }
            }
        );
    };

    const sendResign = (username: string) => {
        if (!socket || !roomid || roomState.finished) return;
        socket.emit(
            "room/send-resign",
            { roomid, username },
            (error: unknown) => {
                if (error) {
                    alert.error("Couldn't resign in server");
                }
            }
        );
    };

    const sendChckmate = (username: string) => {
        if (!socket || !roomid || roomState.finished) return;
        socket.emit(
            "room/send-checkmate",
            { roomid, username },
            (error: unknown) => {
                if (error) {
                    alert.error("Couldn't update checkmate status in server");
                }
            }
        );
    };

    const sendDraw = (username: string) => {
        if (!socket || !roomid || roomState.finished) return;
        socket.emit(
            "room/send-draw",
            { roomid, username },
            (error: unknown) => {
                if (error) {
                    alert.error("Couldn't update draw status in server");
                }
            }
        );
    };

    const sendTimeout = (username: string) => {
        if (!socket || !roomid || roomState.finished) return;
        socket.emit(
            "room/send-timeout",
            { roomid, username },
            (error: unknown) => {
                if (error) {
                    alert.error("Couldn't update timeout status in server");
                }
            }
        );
    };

    return {
        sendMessageHandler,
        roomState,
        socket,
        roomid,
        sendMoveHandler,
        sendResign,
        sendChckmate,
        sendDraw,
        sendTimeout,
    };
};
