import { Router } from "express";
import userController from "./users.controllers";
import upload from "../../../middleware/multer";
import requireLogin from "../../../middleware/requireLogin";
import checkRole from "../../../middleware/checkRole";
import { UserRoles } from "./types";

const userRouter = Router({ mergeParams: true });

userRouter.post("/", upload.single("profilePicture"), userController.createUser);
userRouter.route("/:val").get(userController.getUserByIdOrUsername);
userRouter.use(requireLogin)
userRouter.route("/profile").get(userController.getMyDetails);
userRouter.route("/").get(checkRole([UserRoles.ADMIN]), userController.getAllUsers);
userRouter.patch("/", upload.single("profilePicture"), userController.updateUser);
userRouter.route("/:id").delete(userController.deleteUser);
userRouter.route("/:id/recover").patch(userController.recoverUser);
userRouter.route("/:id/deactivate").patch(userController.deactivateUser);
userRouter.route("/:id/reactivate").patch(userController.reactivateUser);


export default userRouter;