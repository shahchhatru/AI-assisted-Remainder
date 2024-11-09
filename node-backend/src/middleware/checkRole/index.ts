import { NextFunction, Request, Response } from "express";
import { UserRoles } from "../../routes/v1/users/types";
import CustomError from "../../utils/CustomError";
import { messages } from "../../utils/Messages";

export default function checkRole(allowedRole: UserRoles[]) {
    return function (_: Request, res: Response, next: NextFunction){
        const userRole = res.locals?.user?.role;
        if (!allowedRole.includes(userRole)){
            throw new CustomError(401, messages.auth.unauthorized)
        }
        else next();
    }
}
