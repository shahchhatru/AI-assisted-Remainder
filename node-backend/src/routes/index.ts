import { Router } from "express";
import v1router from "./v1";
import notFoundRouter from "./v1/404";

const router = Router();

// Define routes for /v1 and mount v1router
router.use("/v1", v1router)

//Catch all other route and return resource not found
router.use("*", notFoundRouter)

export default router