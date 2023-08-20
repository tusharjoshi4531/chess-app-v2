import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import { CORS_ORIGIN } from "./config/config";

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: CORS_ORIGIN,
    })
);

app.use("/api/v1/auth", authRouter);

export default app;
