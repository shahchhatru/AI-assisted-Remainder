import { NextFunction, Request, Response } from "express";
import CustomError from "../../utils/CustomError";
import { messages } from "../../utils/Messages";

export default function requireLogin(req: Request, res: Response, next: NextFunction){
    if (!res.locals.user){
        throw new CustomError(401, messages.auth.token_not_found)
    }
    next();
}