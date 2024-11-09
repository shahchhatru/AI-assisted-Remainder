import { Router } from "express";
import baseRoute from "./base";
import userRouter from "./users";
import authRouter from "./auth";
import tasksRouter from "./tasks";


const v1router = Router();

v1router.use("/users", userRouter)
v1router.use("/auth", authRouter)
v1router.use("/tasks", tasksRouter)
v1router.use("/", baseRoute)


export default v1router