import { io } from "socket.io-client";
import { SOCKETIO_URL } from "./config/config";

console.log(SOCKETIO_URL);
export const socket = io(SOCKETIO_URL, { autoConnect: false });
