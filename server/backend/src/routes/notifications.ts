import { Router } from "express";
import { addNotification, subscribe } from "../controllers/notifications.controller";
import { sseInitializer } from "../middleware/sse.initializer";

const notificationsRouter = Router();

notificationsRouter.get("/subscribe/:username", sseInitializer, subscribe);
notificationsRouter.post("/add", addNotification);

export default notificationsRouter;
