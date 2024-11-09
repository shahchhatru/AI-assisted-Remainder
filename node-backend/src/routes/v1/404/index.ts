import { Request, Response, Router } from "express";
import { failureResponse } from "../../../utils/ApiResponse";
import { messages } from "../../../utils/Messages";

const notFoundRouter = Router()
notFoundRouter.route("*").all((_: Request, res:Response)=>{
    return failureResponse(res, 404 , messages.error[404])
})

export default notFoundRouter