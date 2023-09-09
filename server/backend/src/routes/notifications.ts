import { RequestHandler, Router } from "express";
import {
    addNotification,
    removeNotifiation,
    subscribe,
} from "../controllers/notifications.controller";
import { sseInitializer } from "../middleware/sse.initializer";
import { authorize } from "../middleware/authorize";

const notificationsRouter = Router();

notificationsRouter.get("/subscribe/:username", sseInitializer, subscribe);

notificationsRouter.use(authorize as RequestHandler);
notificationsRouter.post("/add", addNotification);
notificationsRouter.post("/remove/:notificationId", removeNotifiation);

export default notificationsRouter;
