// @ts-ignore
import express from 'express';

import { isAuthenticated } from "../middleware/isAuthenticated";
import {
  checkAuth,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  updateProfile,
  verifyEmail
} from "../controllers/userControllers";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes
router.get("/check-auth", isAuthenticated, checkAuth);
router.post("/logout", isAuthenticated, logout);
router.put("/profile/update", isAuthenticated, updateProfile);

export default router;