"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = void 0;
const generateVerificationCode = (length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verificationCode = ''; // The code will be stored here
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        verificationCode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return verificationCode;
};
exports.generateVerificationCode = generateVerificationCode;