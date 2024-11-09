import { Request, Response } from "express";
import env from "../../../config/env";
import { successResponse } from "../../../utils/ApiResponse";

function defaultResponse(req: Request, res: Response) {
	return successResponse(res, 200, "This is message.", { "keyField": "valueField" });
}

function echoBody(req: Request, res: Response) {
	return successResponse(res, 200, "Echo json body request received.", req.body);
}

function echoCookie(req: Request, res: Response) {
	return successResponse(res, 200, "Cookie request received.", { cookie: req?.cookies });
}

function echoFormEncode(req: Request, res: Response) {
	return successResponse(res, 200, "Form data echo request received.", { formData: req.body });
}

function echoQueryParams(req: Request, res: Response) {
	return successResponse(res, 200, "Echo query params request received.", { queryParams: req.query });
}

function echoUrlParams(req: Request, res: Response) {
	return successResponse(res, 200, "Echo url params request received.", { queryParams: req.params });
}

function uploadSingle(req: Request, res: Response) {
	let fileDetails = req.file
		? {
			...req.file,
			uri: `${env.endpoint}/uploads/${req.file?.filename}`,
		}
		: {};

	return successResponse(res, 200, "Upload single file request received.", {
		fileDetails,
		bodyContent: {
			...req.body,
		},
	})

}

function uploadMultiple(req: Request, res: Response) {
	const fileDetails =
		req.files &&
		Object.values(req.files).map((file: Express.Multer.File) => {
			return {
				...file,
				uri: `${env.endpoint}/uploads/${file.filename}`,
			};
		});

	return successResponse(res, 200, "Upload multiple file request received.", {
		fileDetails,
		bodyContent: {
			...req.body,
		},
	})
}

const baseController = {
	defaultResponse,
	echoBody,
	echoCookie,
	echoFormEncode,
	echoQueryParams,
	echoUrlParams,
	uploadSingle,
	uploadMultiple,
};
export default baseController;
