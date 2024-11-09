import { Router } from "express";
import { tasksController } from "./tasks.controllers";

const tasksRouter = Router();
tasksRouter.route("/").get(tasksController.read);
tasksRouter.route("/").post(tasksController.create);
tasksRouter.route("/:id").put(tasksController.update);
tasksRouter.route("/:id").delete(tasksController.delete);

export default tasksRouter;
