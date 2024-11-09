import { messages } from "./Messages";

export default class CustomError extends Error {
	statusCode: number;
	name: string;
	errors?: { [key: string]: string };

	constructor(statusCode: number = 500, message: string = messages.error.internal_server_error, errors?: { [key: string]: string }) {
		super(message);
		this.statusCode = statusCode;
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
		this.errors = errors;
	}
}