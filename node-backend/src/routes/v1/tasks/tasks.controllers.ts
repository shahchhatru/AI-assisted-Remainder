import { NextFunction, Request, Response } from "express";
import { ITasks } from "./types";
import { objectUtils } from "../../../utils/ObjectUtils";
import CustomError from "../../../utils/CustomError";
import TaskModel from "../../../models/taskModel";
import { successResponse } from "../../../utils/ApiResponse";

export const tasksController = {
    create: async (req: Request<unknown, unknown, ITasks, unknown>, res: Response, next: NextFunction) => {
        try {
            const taskDetails = req.body;
            if (!objectUtils.hasRequiredKeys(taskDetails, ["notificationType", "queryTerms", "url"])) {
                return next(new CustomError(400, "Data missing"));
            } else {
                const newTask = new TaskModel({ ...taskDetails, uid: res.locals.user });
                console.log({ ...taskDetails, uid: res.locals.user })
                const response = await newTask.save();
                return successResponse(res, 200, "Task created successfully", response);
            }
        } catch (error) {
            console.log(error);
            return next(new CustomError(500, "Unexpected error"));
        }
    },

    read: async (req: Request<unknown, unknown, ITasks, unknown>, res: Response, next: NextFunction) => {
        try {
            const tasks = await TaskModel.find({ uid: res.locals.user });
            return successResponse(res, 200, "Tasks fetched successfully", tasks);
        } catch (error) {
            console.log(error);
            return next(new CustomError(500, "Unexpected error"));
        }
    },

    update: async (req: Request<unknown, unknown, ITasks, unknown>, res: Response, next: NextFunction) => {
        try {
            const taskId = (req.params as { id: string })?.id;
            const taskDetails = req.body;
            if (!objectUtils.hasRequiredKeys(taskDetails, ["notificationType", "queryTerms", "url"])) {
                return next(new CustomError(400, "Data missing"));
            } else {
                const updatedTask = await TaskModel.findByIdAndUpdate(
                    taskId,
                    { ...taskDetails },
                    { new: true }
                );
                if (!updatedTask) {
                    return next(new CustomError(404, "Task not found"));
                }
                return successResponse(res, 200, "Task updated successfully", updatedTask);
            }
        } catch (error) {
            console.log(error);
            return next(new CustomError(500, "Unexpected error"));
        }
    },

    delete: async (req: Request<unknown, unknown, ITasks, unknown>, res: Response, next: NextFunction) => {
        try {
            const taskId = (req.params as { id: string })?.id;
            const deletedTask = await TaskModel.findByIdAndDelete(taskId);
            if (!deletedTask) {
                return next(new CustomError(404, "Task not found"));
            }
            return successResponse(res, 200, "Task deleted successfully", deletedTask);
        } catch (error) {
            console.log(error);
            return next(new CustomError(500, "Unexpected error"));
        }
    }
};
