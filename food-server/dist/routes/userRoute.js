"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = require("../middleware/isAuthenticated");
const userControllers_1 = require("../controllers/userControllers");
const router = express_1.default.Router();
// Public routes
router.post("/signup", userControllers_1.signup);
router.post("/login", userControllers_1.login);
router.post("/verify-email", userControllers_1.verifyEmail);
router.post("/forgot-password", userControllers_1.forgotPassword);
router.post("/reset-password/:token", userControllers_1.resetPassword);
// Protected routes
router.get("/check-auth", isAuthenticated_1.isAuthenticated, userControllers_1.checkAuth);
router.post("/logout", isAuthenticated_1.isAuthenticated, userControllers_1.logout);
router.put("/profile/update", isAuthenticated_1.isAuthenticated, userControllers_1.updateProfile);
exports.default = router;
