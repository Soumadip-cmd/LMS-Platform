import express from 'express';
import {
    initiateRegistration,
    verifyOTPAndRegister,
    resendOTP,
    login,
    logout,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    changePassword ,
    getItNow,
    uploadResume,
    handleResumeUpload,
    becomeInstructor
} from "../../controller/auth/user.controller.js";
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const authRouter = express.Router();

// Registration flow
authRouter.post('/register', initiateRegistration);
authRouter.post('/verify-otp', verifyOTPAndRegister);
authRouter.post('/resend-otp', resendOTP);

// Login and logout
authRouter.post('/login', login);
authRouter.post('/logout', isAuthenticated, logout);

// Password reset flow
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/verify-reset-otp', verifyResetOTP);
authRouter.post('/reset-password', resetPassword);


// Special middleware for file uploads to handle CORS preflight
const handleFileUploadCORS = (req, res, next) => {
    // Set CORS headers specifically for file uploads
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
};

authRouter.post('/upload-resume', handleFileUploadCORS, isAuthenticated, uploadResume, handleResumeUpload);

authRouter.post('/instructor/become-instructor', handleFileUploadCORS, isAuthenticated, uploadResume, becomeInstructor);
// Change password (when logged in)
authRouter.post('/change-password', isAuthenticated, changePassword);
authRouter.post('/get-it-now', getItNow);
export default authRouter;