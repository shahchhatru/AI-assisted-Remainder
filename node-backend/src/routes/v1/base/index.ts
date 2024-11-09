import {Router} from "express"
import baseController from "./base.controllers";
import upload from "../../../middleware/multer";



const baseRoute = Router();

baseRoute.get("/cookie", baseController.echoCookie)
baseRoute.get("/", baseController.defaultResponse)
baseRoute.route("/json").post(baseController.echoBody)
baseRoute.route("/form-encode").post(baseController.echoFormEncode)
baseRoute.route("/query").get(baseController.echoQueryParams)
baseRoute.route("/param/:key_of_param").get(baseController.echoUrlParams)
baseRoute.post("/uploadSingle", upload.single('myFile'), baseController.uploadSingle)
baseRoute.post("/uploadMultiple", upload.array('files'), baseController.uploadMultiple)

export default baseRoute