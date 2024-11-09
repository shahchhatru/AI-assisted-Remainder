import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { failureResponse } from "./ApiResponse";
import mongoose from "mongoose";
import CustomError from "./CustomError";

interface ErrorResponse {
    statusCode: number;
    message: string;
    errors?: { [key: string]: string }, // array of key value pair of string type
}


export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction) {
    let errorResponse: ErrorResponse = {
        statusCode: 500,
        message: "Internal Server Error",
    };

    if (error instanceof CustomError) {
        errorResponse.message = error.message
        errorResponse.statusCode = error.statusCode
        errorResponse.errors = error.errors
    }
    else if (error instanceof multer.MulterError) errorResponse = handleMulterError(error)
    else if (typeof error === 'object' && error && 'code' in error && error.code === 11000) errorResponse = handleKeyDuplicationError(error);
    else if (error instanceof mongoose.Error.CastError) errorResponse = handleCastError(error);
    else if (error instanceof mongoose.Error.ValidationError) errorResponse = handleValidationError(error);
    else {
        console.log("Uncaught error:")
        console.log("**********************************************************************************************")
        console.log(error)
        console.log("**********************************************************************************************")
    }
    return failureResponse(res, errorResponse.statusCode, errorResponse.message, errorResponse.errors)
}


function handleMulterError(error: multer.MulterError): ErrorResponse {
    return {
        statusCode: 400,
        message: `Multer error: ${error.message}`
    }
}


function handleCastError(error: mongoose.CastError): ErrorResponse {
    const errors: { [key: string]: string } = {};
    errors[error.path] = 'Invalid value';
    return {
        statusCode: 400,
        message: `Api Validation Error`,
        errors
    }
}


function handleKeyDuplicationError(error: any): ErrorResponse {
    const errors: { [key: string]: string } = {};
    for (const key in error.keyPattern) {
        if (error.keyPattern.hasOwnProperty(key)) {
            errors[key] = `The ${key.toLowerCase()} already exists`;
        }
    }
    return {
        statusCode: 409,
        message: 'API Validation Error',
        errors,
    };
}


function handleValidationError(error: mongoose.Error.ValidationError): ErrorResponse {
    const errors: { [key: string]: string } = {};
    Object.values(error.errors).forEach(el => {
        errors[el.path] = el.message;
    });
    return {
        statusCode: 400,
        message: 'API Validation Error',
        errors,
    };
}