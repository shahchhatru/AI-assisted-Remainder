import { Request, Response, NextFunction } from "express";
import { createDecipheriv, createHash } from "crypto";
import CustomError from "../../utils/CustomError";

interface JWEHeader {
    alg: string;
    enc: string;
    iss: string;
}

interface Auth0Config {
    domain: string;
    clientSecret: string; // You'll need your Auth0 client secret for direct encryption
}

const config: Auth0Config = {
    domain: "dev-n2xixj7j7tge61nc.us.auth0.com",
    clientSecret: process.env.AUTH0_CLIENT_SECRET || "" // Should be set in environment variables
};

function base64UrlDecode(str: string): Buffer {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return Buffer.from(str, 'base64');
}

function deriveKey(secret: string): Buffer {
    // For A256GCM we need a 32-byte key
    return createHash('sha256').update(secret).digest();
}

async function decryptJWE(token: string, secret: string) {
    try {
        // Split the JWE token into its components
        const [headerB64, encryptedKeyB64, ivB64, ciphertextB64, tagB64] = token.split('.');

        // Decode the header
        const header = JSON.parse(base64UrlDecode(headerB64).toString()) as JWEHeader;

        // Verify the header
        if (header.alg !== 'dir' || header.enc !== 'A256GCM') {
            throw new CustomError(401, "Invalid token algorithm or encryption");
        }

        if (header.iss !== `https://${config.domain}/`) {
            throw new CustomError(401, "Invalid token issuer");
        }

        // For 'dir' algorithm, we derive the key from the client secret
        const key = deriveKey(secret);
        const iv = base64UrlDecode(ivB64);
        const ciphertext = base64UrlDecode(ciphertextB64);
        const tag = base64UrlDecode(tagB64);

        // Create decipher
        const decipher = createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);

        // Decrypt
        let decrypted = decipher.update(ciphertext);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        // Parse the decrypted payload
        const payload = JSON.parse(decrypted.toString());

        // Verify token expiration
        if (payload.exp && Date.now() >= payload.exp * 1000) {
            throw new CustomError(401, "Token has expired");
        }

        return payload;
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }
        console.log(error)
        throw new CustomError(401, "Failed to decrypt token");
    }
}

export default function decodeAccessToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new CustomError(401, "Authorization header missing"));
    }

    const token = authHeader.replace(/^Bearer\s/i, '');
    if (!token) {
        return next(new CustomError(401, "Token missing"));
    }

    // Verify token using an async IIFE
    (async () => {
        try {
            if (!config.clientSecret) {
                throw new CustomError(500, "Client secret not configured");
            }

            const payload = await decryptJWE(token, config.clientSecret);

            // Additional validations as needed
            if (!payload.sub) {
                throw new CustomError(401, "Invalid subject claim");
            }

            // Attach decrypted payload to response locals
            res.locals.user = payload;
            next();
        } catch (error) {
            if (error instanceof CustomError) {
                next(error);
            } else {
                console.error("Token verification error:", error);
                next(new CustomError(500, "Internal server error during token verification"));
            }
        }
    })();
}