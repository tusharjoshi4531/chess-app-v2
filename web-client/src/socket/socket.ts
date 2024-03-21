import { Socket, io } from "socket.io-client";
import { SOCKETIO_URL } from "../config/config";

export default class SocketConn {
  private static instance: SocketConn;
  private socket: Socket ;

  private constructor() {
    this.socket = io(SOCKETIO_URL, {
      transports: ["websocket", "polling"],
      autoConnect: false,
    });
  }

  public static get Instance() {
    return this.instance || (this.instance = new SocketConn());
  }

  public get Socket() {
    return this.socket;
  }
}
