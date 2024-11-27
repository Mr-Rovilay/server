import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}

interface JwtPayload extends jwt.JwtPayload {
    userId: string;
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }

        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            throw new Error("SECRET_KEY is not defined in environment variables");
        }

        const decode = jwt.verify(token, secretKey) as JwtPayload;
        
        if (!decode || typeof decode.userId !== 'string') {
            res.status(401).json({
                success: false,
                message: "Invalid token"
            });
            return;
        }

        req.id = decode.userId;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        } else {
            console.error("Authentication error:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};