import { Router } from "express";
import {
    authorize,
    exists,
    login,
    logout,
    signup,
} from "../controller/auth.controller";
import {
    validateAuthorize,
    validateLogin,
    validateLogout,
    validateSignup,
} from "../middleware/auth.validator";

const authRouter = Router();

authRouter.post("/signup", validateSignup, signup);
authRouter.post("/login", validateLogin, login);
authRouter.post("/logout", validateLogout, logout);
authRouter.post("/authorize", validateAuthorize, authorize);
authRouter.get("/exists/:username", exists);

export default authRouter;
