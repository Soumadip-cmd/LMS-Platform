import express from "express";
import { 
  
    // New social auth controllers
    socialLogin,
    verifyPhoneForSocialLogin,
    completeSocialRegistration,
    resendPhoneOTP
} from "../../controller/auth/social.controller.js";


const Socialrouter = express.Router();


Socialrouter.post("/social-login", socialLogin);
Socialrouter.post("/verify-phone", verifyPhoneForSocialLogin);
Socialrouter.post("/complete-social-registration", completeSocialRegistration);
Socialrouter.post("/resend-phone-otp", resendPhoneOTP);

export default Socialrouter;