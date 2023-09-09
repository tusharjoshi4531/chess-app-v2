import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import { CORS_ORIGIN } from "./config/config";
import roomRouter from "./routes/room";
import notificationsRouter from "./routes/notifications";
import { globalErrorHandler } from "./middleware/global.error";
import { errorHandler } from "./error/handle.error";
import challengesRouter from "./routes/challenges";

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: CORS_ORIGIN,
    })
);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/room", roomRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/challenges", challengesRouter);
app.use("/api/v1/rooms", roomRouter);

app.use(globalErrorHandler);

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

export default app;
