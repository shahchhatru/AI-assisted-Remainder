import { Router } from "express";
import authController from "./auth.controller";
import requireLogin from "../../../middleware/requireLogin";

const authRouter = Router();

authRouter.post("/", authController.login);
authRouter.post("/refresh", requireLogin, authController.refreshAccessToken);
authRouter.get("/verify/:OTP", authController.verifyOTP)
authRouter.get("/regenerate/:email", authController.regenerateOTP)

export default authRouter;