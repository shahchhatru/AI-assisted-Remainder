import { Response } from "express";
import { messages } from "./Messages";


export function successResponse(res: Response, statusCode: number = 200, message: string = "Request successfully executed.", data?: unknown) {
    return res.status(statusCode).json({ success: true, message, data })
}

export function failureResponse(res: Response, statusCode: number = 500, message: string = messages.error.internal_server_error, data?: unknown) {
    return res.status(statusCode).json({ success: false, message, data })
}
