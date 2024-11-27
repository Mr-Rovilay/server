"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
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
        const decode = jsonwebtoken_1.default.verify(token, secretKey);
        if (!decode || typeof decode.userId !== 'string') {
            res.status(401).json({
                success: false,
                message: "Invalid token"
            });
            return;
        }
        req.id = decode.userId;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        else {
            console.error("Authentication error:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};
exports.isAuthenticated = isAuthenticated;
