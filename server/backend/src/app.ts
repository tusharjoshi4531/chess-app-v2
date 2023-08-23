import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import { CORS_ORIGIN } from "./config/config";
import roomRouter from "./routes/room";

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: CORS_ORIGIN,
    })
);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/room", roomRouter);

export default app;
