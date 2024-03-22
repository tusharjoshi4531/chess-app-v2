import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
config();

import app from "./src/app";
import {
  CORS_ORIGIN,
  MONGO_CONNECTION_STRING,
  PORT,
} from "./src/config/config";
import connectionControllers from "./src/socketControllers/connection.controllers";
import mongoose from "mongoose";

import { authenticateUser } from "./src/socketMiddleware/authenticate.middleware";
import { notificationControllers } from "./src/socketControllers/notification.controller";
import roomControllers, {
  roomInfoControllers,
} from "./src/socketControllers/room.controllers";

const server = createServer(app);

const connect = () =>
  mongoose
    .connect(MONGO_CONNECTION_STRING)
    .then(() => console.log(`connected to ${MONGO_CONNECTION_STRING}`))
    .catch((err) => console.log(err));

server.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
  connect();
});

// Socket io
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN,
  },
});

io.use(authenticateUser);

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });

  connectionControllers(io, socket);
  roomControllers(io, socket);
  roomInfoControllers(io, socket);
  notificationControllers(io, socket);
});
