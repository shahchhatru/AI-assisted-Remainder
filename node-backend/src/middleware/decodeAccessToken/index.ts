import { Request, Response, NextFunction } from "express";
import { checkToken } from "../../utils/jwt";

export default async function decodeAccessToken(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.replace(/^Bearer\s/, '');

    if (!accessToken) return next();

    try {
        const decodedToken = checkToken(accessToken, 'accessToken');
        if (decodedToken) {
            res.locals.user = decodedToken;
        }
    } catch (error) {
        console.error("Error decoding access token:", error);
        next(error);
    }

    return next();
}
