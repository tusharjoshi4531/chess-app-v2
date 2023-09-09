import { RequestHandler, Router } from "express";
import {
    addChallenge,
    challengeUser,
    removeChallenge,
} from "../controllers/challenges.controller";
import { authorize } from "../middleware/authorize";
import { challengeValidator } from "../middleware/challenge.validator";

const challengesRouter = Router();

challengesRouter.use(authorize as RequestHandler);

challengesRouter.post("/add", addChallenge);
challengesRouter.post(
    "/challenge-user/:targetUsername",
    challengeValidator,
    challengeUser
);
challengesRouter.post("/remove/:challengeId", removeChallenge);

export default challengesRouter;
