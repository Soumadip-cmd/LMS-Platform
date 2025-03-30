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
    changePassword 
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

// Change password (when logged in)
authRouter.post('/change-password', isAuthenticated, changePassword);

export default authRouter;