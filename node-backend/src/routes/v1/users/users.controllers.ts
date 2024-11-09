import { NextFunction, Request, Response } from "express";
import { IUser } from "./types";
import userServices from "./user.services";
import { successResponse } from "../../../utils/ApiResponse";
import { messages } from "../../../utils/Messages";
import env from "../../../config/env";
import OTPModel from "../../../models/OTPModel";

const userController = {
    async createUser(req: Request<unknown, unknown, IUser>, res: Response, next: NextFunction) {
        try {
            const ppURI = req.file ? `${env.endpoint}/uploads/${req.file?.filename}` : "";
            const { _id, firstName, middleName, lastName, username, email, profilePicture } = await userServices.createUser({ ...req.body, profilePicture: ppURI });
            
            if (username) {
                // await  authService.generateAndSendOTP(_id, email)
                await OTPModel.generateAndSendOTP(_id.toString(), email);
                return successResponse(res, 200, messages.user.creation_success, { firstName, middleName, lastName, username, email, profilePicture })
            }
        } catch (error) {
            next(error)
        }
    },

    async getAllUsers(_: Request, res: Response, next: NextFunction) {
        try { //TODO:check if admin
            const result = await userServices.getAllUsers();
            return successResponse(res, 200, messages.user.retrieval_success, result)
        } catch (error) {
            next(error)
        }
    },

    async getUserByIdOrUsername(req: Request, res: Response, next: NextFunction) {
        try {
            const { val } = req.params
            let result
            if (val.length == 24) result = await userServices.getUserById(val);
            else result = await userServices.getUserByUsername(val)
            return successResponse(res, 200, messages.user.retrieval_success, result)
        } catch (error) {
            next(error)
        }
    },

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const client_id = res.locals.user._id
            const newData: IUser = { ...req.body };
            if (req.file) {
                newData.profilePicture = `${env.endpoint}/uploads/${req.file?.filename}`
            }
            //TODO: find out if pp is empty or is image
            //TODO: only allow name, pp to be modified
            //prevent roles, activated status deleted status from being accessed.
            const result = await userServices.updateUser(client_id, newData)
            return successResponse(res, 200, messages.user.update.update_success, result)
        } catch (error) {
            next(error)
        }
    },

    // async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { email } = req.body
    //         const result = await userServices.getUserById(email);
    //         return successResponse(res, 200, messages.user.retrieval_success, result)
    //     } catch (error) {
    //         next(error)
    //     }
    // },

    // async getUserByUsername(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { username } = req.body
    //         const result = await userServices.getUserByUsername(username);
    //         return successResponse(res, 200, messages.user.retrieval_success, result)
    //     } catch (error) {
    //         next(error)
    //     }
    // },

    async getMyDetails(_: Request, res: Response, next: NextFunction) {
        try {
            const client_id = res.locals.user._id;
            const result = await userServices.getUserById(client_id);
            return successResponse(res, 200, messages.user.retrieval_success, result);
        } catch (error) {
            next(error)
        }
    },
    
    async deleteUser(_:Request, res: Response, next: NextFunction){
        try {
            const client_id = res.locals.user._id;
            const result = await userServices.deleteUser(client_id)
            return successResponse(res, 200, messages.user.update.deletion_success, result)
        } catch (error) {
            next (error);
        }
    },

    async reactivateUser(_: Request, res: Response, next: NextFunction) {
        try {
            const client_id = res.locals.user?._id;
            const result = await userServices.reactivateUser(client_id);
            return successResponse(res, 200, messages.user.update.reactivation_success, result);
        } catch (error) {
            next(error);
        }
    },

    async deactivateUser(_: Request, res: Response, next: NextFunction) {
        try {
            const client_id = res.locals.user?._id;
            const result = await userServices.deactivateUser(client_id);
            return successResponse(res, 200, messages.user.update.deactivation_success, result);
        } catch (error) {
            next(error);
        }
    },
    
    async recoverUser(_: Request, res: Response, next: NextFunction) {
        try {
            const client_id = res.locals.user?._id;
            const result = await userServices.recoverUser(client_id);
            return successResponse(res, 200, messages.user.update.recovery_success, result);
        } catch (error) {
            next(error);
        }
    }
    
};

export default userController;