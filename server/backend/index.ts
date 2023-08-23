import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
config();

import app from "./src/app";
import { CORS_ORIGIN, PORT } from "./src/config/config";

const server = createServer(app);

server.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
});

// Socket io
const io = new Server(server, {
    cors: {
        origin: CORS_ORIGIN,
    },
});

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);
});
