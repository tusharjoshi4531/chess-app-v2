import { Router } from "express";
import { sseInitializer } from "../middleware/sse.initializer";
import { subscribe } from "../controllers/room.controller";

const roomRouter = Router();

roomRouter.get("/subscribe/:username", sseInitializer, subscribe);

export default roomRouter;
