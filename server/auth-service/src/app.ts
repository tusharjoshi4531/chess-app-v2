import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import { CORS_ORIGIN } from "./config/config";
import { globalErrorHandler } from "./middleware/global.error";

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: CORS_ORIGIN,
    })
);

app.use("/api/v1/auth", authRouter);

app.use(globalErrorHandler);

export default app;
