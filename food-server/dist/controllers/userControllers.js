"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.checkAuth = exports.resetPassword = exports.forgotPassword = exports.logout = exports.verifyEmail = exports.login = exports.signup = void 0;
const userModel_1 = require("../models/userModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const generateVerificationCode_1 = require("../utils/generateVerificationCode");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const generateToken_1 = require("../utils/generateToken");
const email_1 = require("../mailtrap/email");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, email, password, contact } = req.body;
        let user = yield userModel_1.User.findOne({ email });
        if (user) {
            res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const verificationToken = (0, generateVerificationCode_1.generateVerificationCode)();
        user = yield userModel_1.User.create({
            fullname,
            email,
            password: hashedPassword,
            contact: Number(contact),
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
        (0, generateToken_1.generateToken)(res, user);
        yield (0, email_1.sendVerificationEmail)(email, verificationToken);
        const userWithoutPassword = yield userModel_1.User.findOne({ email }).select("-password");
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: userWithoutPassword
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.User.findOne({ email });
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
            return;
        }
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
            return;
        }
        (0, generateToken_1.generateToken)(res, user);
        user.lastLogin = new Date();
        yield user.save();
        const userWithoutPassword = yield userModel_1.User.findOne({ email }).select("-password");
        res.status(200).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: userWithoutPassword
        });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const verifyEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { verificationCode } = req.body;
        const user = yield userModel_1.User.findOne({
            verificationToken: verificationCode,
            verificationTokenExpiresAt: { $gt: Date.now() }
        }).select("-password");
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid or expired verification token"
            });
            return;
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        yield user.save();
        yield (0, email_1.sendWelcomeEmail)(user.email, user.fullname);
        res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyEmail = verifyEmail;
const logout = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    }
    catch (error) {
        next(error);
    }
});
exports.logout = logout;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield userModel_1.User.findOne({ email });
        if (!user) {
            res.status(400).json({
                success: false,
                message: "User doesn't exist"
            });
            return;
        }
        const resetToken = crypto_1.default.randomBytes(40).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        yield user.save();
        yield (0, email_1.sendPasswordResetEmail)(user.email, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`);
        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = yield userModel_1.User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() }
        });
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        yield user.save();
        yield (0, email_1.sendResetSuccessEmail)(user.email);
        res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
const checkAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id; // Changed from req.id to req.userId
        const user = yield userModel_1.User.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id; // Changed from req.id to req.userId
        const { fullname, email, address, city, country, contact, bio, profilePicture } = req.body;
        let cloudResponse;
        if (profilePicture) {
            cloudResponse = yield cloudinary_1.default.uploader.upload(profilePicture);
        }
        const updatedData = Object.assign({ fullname,
            email,
            address,
            city,
            country,
            contact,
            bio }, (cloudResponse && { profilePicture: cloudResponse.secure_url }));
        const user = yield userModel_1.User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            user,
            message: "Profile updated successfully"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProfile = updateProfile;
