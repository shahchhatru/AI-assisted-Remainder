import { NextFunction, Request, Response } from "express";
import authRepository from "./auth.service";
import { IUserDocument } from "../../../models/userModel";
import { failureResponse, successResponse } from "../../../utils/ApiResponse";
import { messages } from "../../../utils/Messages";
import authService from "./auth.service";
import OTPModel from "../../../models/OTPModel";

const authController = {
	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const userDetails: IUserDocument = { ...req.body };
			const result = await authRepository.login(userDetails.username, userDetails.email);
			return successResponse(res, 200, messages.auth.login_success, result)
		} catch (error) {
			next(error)
		}
	},

	async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
		try {
			const refreshToken = (req.headers.authorization || "").replace(/^Bearer\s/, "");
			const accessToken = await authService.refreshAccessToken(refreshToken);
			return successResponse(res, 200, messages.token.renew_success, accessToken)
		} catch (error) {
			next(error)
		}
	},

	async verifyOTP(req: Request, res: Response, next: NextFunction) {
		try {
			const { OTP } = req.params;
			const result = await OTPModel.verifyOTP(parseInt(OTP));
			if (result) {
				return successResponse(res, 200, messages.OTP.verification_success);
			}
			else return failureResponse(res, 400, messages.OTP.invalid_otp);
		} catch (error) {
			next(error);
		}
	},

	async regenerateOTP(req: Request, res: Response, next: NextFunction) {
		try {
			const { email } = req.params;
			const status = await OTPModel.regenerateOTP(email);

			if (status) return successResponse(res, 200, messages.OTP.regeneration_success);
			else return failureResponse(res, 400, messages.OTP.regeneration_failed);

		} catch (error) {
			next(error);
		}
	}
}
export default authController;