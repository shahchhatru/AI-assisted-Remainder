import env from "../../config/env";

export const messages = {
	user: {
		creation_success: "User Created Successfully. \\n OTP has been sent to your email.",
		retrieval_success: "User retrieved successfully.",
		update: {
			update_success: "User details updates successfully.",
			deletion_success: "User deleted successfully.",
			recovery_success: "User recover successfully.",
			deactivation_success: "User deactivated successfully.",
			reactivation_success: "User reactivated successfully.",
		},
		404: "User not found."
	},
	auth: {
		login_success: "LoggedIn Successfully.",
		invalid_account: "Invalid Password or Email.",
		token_expired: "The token has expired.",
		token_not_found: "Unauthorized user. Token not found. Please login.",
		unauthorized: "The user is not authorized.",
	},
	token: {
		renew_success: "Access token renewed successfully.",
		invalid_token: "The token is invalid."
	},
	error: {
		internal_server_error: "Internal Server Error",
		404: "Resource not found"
	},
	OTP: {
		email_Used: `The email is already used. Please verify the OTP sent to email at ${env.endpoint}/v1/auth/verify`,
		verification_success: "The email has been verified successfully.",
		invalid_otp: "The otp provided is invalid.",
		invalid_email: "Account with given email doesn't exist. Please create a new account.",
		regeneration_success: "New otp has been sent to your email.",
		regeneration_failed: "Couldn't generate new OTP.",
	}
};
