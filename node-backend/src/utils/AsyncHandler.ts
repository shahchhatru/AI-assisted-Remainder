import { Request, Response, NextFunction } from "express";
import ApiError from "./ApiError";

type TAsyncFunction = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<any>;

export default function asyncHandler(asyncFunction: TAsyncFunction) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			Promise.resolve(asyncFunction(req, res, next)).catch((error) => {
				console.error("Async Handler error: ", error);
				res.status(500).json(
					new ApiError(500, "Internal Server Error !!")
				);
			});
		} catch (error) {
			res.status(500).json(new ApiError(500, "Internal Server Error !!"));
		}
	};
}
