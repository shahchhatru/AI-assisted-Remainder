import jwt from "jsonwebtoken"
import env from "../../config/env"
import CustomError from "../CustomError";
import { messages } from "../Messages";


/**
 * Signs a JSON Web Token (JWT) with the given payload and options.
 * 
 * @param {Object} payload - The payload to include in the token.
 * @param {"accessToken" || "refreshToken"} [type="accessToken"] - Specifies if the token is an accessToken or a refreshToken.
 * @param {jwt.SignOptions} options - Additional options for signing the token.
 * @returns {string} - The signed JWT.
 */
export function signJWT(payload: Object, type = "accessToken" || "refreshToken" , options?: jwt.SignOptions): string {
    const secretKey = type === "accessToken" ? env.accessTokenSecret : env.refreshTokenSecret;
    const expiresIn = type === "accessToken" ? env.accessTokenValidity : env.refreshTokenValidity;
    return jwt.sign(payload, secretKey, { expiresIn,  ...options });
}


/**
 * Verifies the given token using the specified type (accessToken or refreshToken).
 * 
 * @param {string} token - The token to verify.
 * @param {"accessToken" | "refreshToken"} [type="accessToken"] - Specifies if the token is an accessToken or a refreshToken.
 * @returns {Object | null} - Returns the decoded token object if valid, throws a 401 error if the token is expired, or returns null if the token can't be decoded.
 * @throws {CustomError} - Throws a 401 error if the token is expired.
 */
export function checkToken(token: string, type: "accessToken" | "refreshToken" = "accessToken"): Object | null {
    const secretKey = type === "accessToken" ? env.accessTokenSecret : env.refreshTokenSecret;
    try {
        return jwt.verify(token, secretKey);   
    } catch(error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new CustomError(401, messages.auth.token_expired);
        }
        console.log(error)
        return null;
    }
}

//TODO: fix js docs