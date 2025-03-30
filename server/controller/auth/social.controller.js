import { User } from "../../models/user.model.js";
import { Language } from "../../models/language.model.js";
import { generateToken } from "../../utils/generateToken.js";
import { updateUserStatus } from "../../socket/socket.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import path from "path";
import ejs from "ejs";
import twilio from "twilio";

// OTP storage (In production, should use Redis or similar service)
const otpStore = new Map();

// Initialize Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

// Configure email transport
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
        user: 'preplings@zohomail.in',
        pass: 'EvGdpzjJprNs'
    },
    debug: true
});

/**
 * Generate OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send Email
 */
const sendEmail = async (to, subject, template, data) => {
    try {
        // Get template path
        const templatePath = path.join(process.cwd(), 'mails', 'templates', `${template}.ejs`);
        
        // Render template with data
        const html = await ejs.renderFile(templatePath, data);
        
        // Send email
        await transporter.sendMail({
            from: `"Preplings" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Email sending failed:", error);
        throw new Error("Failed to send email");
    }
};

/**
 * Send SMS using Twilio
 */
// const sendSMS = async (to, body) => {
//     try {
//         if (!twilioClient) {
//             console.warn("Twilio client not configured. SMS not sent.");
//             return;
//         }
        
//         await twilioClient.messages.create({
//             body,
//             from: process.env.TWILIO_PHONE_NUMBER,
//             to
//         });
        
//         console.log(`SMS sent to ${to}`);
//     } catch (error) {
//         console.error("SMS sending failed:", error);
//         throw new Error("Failed to send SMS");
//     }
// };

/**
 * Social Login (Google/Facebook) Handler
 * This controller handles authentication for users signing in with Google or Facebook
 */
export const socialLogin = async (req, res) => {
    try {
        // Firebase sends verified user data
        const { name, email, uid, provider, photoURL } = req.body;
        
        if (!email || !uid || !provider) {
            return res.status(400).json({
                success: false,
                message: "Insufficient data provided for social login."
            });
        }

        // Check if user already exists with this email
        let user = await User.findOne({ email });
        
        if (user) {
            // If user exists but hasn't verified their phone number, require verification
            if (!user.isVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Please verify your phone number to continue.",
                    needsPhoneVerification: true,
                    tempUserId: user._id,
                    email
                });
            }
            
            // Update user's social provider details if needed
            if (provider === "google") {
                user.googleId = uid;
            } else if (provider === "facebook") {
                user.facebookId = uid;
            }

            // Update profile photo if not set and provided by social login
            if (!user.photoUrl && photoURL) {
                user.photoUrl = photoURL;
            }
            
            // Update user's online status
            user.isOnline = true;
            user.lastActive = new Date();
            await user.save();

            // Broadcast user online status to all clients via socket
            updateUserStatus(user._id.toString(), true);
            
            // Generate JWT token and send response
            return generateToken(res, user, `Welcome back ${user.name}`);
        } else {
            // New user - need to verify phone number
            // Create a temporary user entry
            const tempUser = await User.create({
                name,
                email,
                password: crypto.randomBytes(16).toString('hex'),
                isVerified: false,
                photoUrl: photoURL || "",
                learningGoal: "Casual",
                ...(provider === "google" && { googleId: uid }),
                ...(provider === "facebook" && { facebookId: uid })
            });
            return res.status(201).json({
                success: true,
                message: "Please verify your phone number to complete registration.",
                needsPhoneVerification: true,
                tempUserId: tempUser._id,
                email
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to process social login"
        });
    }
};

/**
 * Verify Phone for Social Login
 * This endpoint is used to verify phone number for new users who registered with social login
 */
export const verifyPhoneForSocialLogin = async (req, res) => {
    try {
        const { tempUserId, phoneNumber } = req.body;
        
        if (!tempUserId || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "User ID and phone number are required."
            });
        }

        // Check if user exists
        const user = await User.findById(tempUserId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Check if phone number is already in use
        const existingPhoneUser = await User.findOne({ phoneNumber });
        if (existingPhoneUser && existingPhoneUser._id.toString() !== tempUserId) {
            return res.status(400).json({
                success: false,
                message: "This phone number is already associated with another account."
            });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP and phone number
        otpStore.set(user.email, {
            otp,
            phoneNumber,
            createdAt: new Date()
        });
        
        // Determine which social provider the user is using
        const provider = user.googleId ? "Google" : user.facebookId ? "Facebook" : "social";
        
        // Send OTP via email
        await sendEmail(
            user.email,
            "Your Verification Code | Preplings",
            "otp-verification", 
            {
                name: user.name,
                otp,
                provider,
                websiteUrl: process.env.CLIENT_URL || "http://localhost:5173"
            }
        );
        
        
        if (twilioClient) {
            // await sendSMS(
            //     phoneNumber,
            //     `Your Preplings verification code is: ${otp}. This code expires in 15 minutes.`
            // );
        }
        
        // Get available languages for learning goal selection
        const languages = await Language.find().select('_id name code');
        
        return res.status(200).json({
            success: true,
            message: "Verification code sent to your email and phone number.",
            otp: process.env.NODE_ENV === 'development' ? otp : undefined, // Only include OTP in development
            languages: languages,
            learningGoals: ["Casual", "Professional", "Exam Prep"]
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to send verification code"
        });
    }
};
/**
 * Complete Social Registration with OTP Verification
 * This endpoint completes the registration process for new social login users
 */
export const completeSocialRegistration = async (req, res) => {
    try {
        const { tempUserId, otp, phoneNumber, languageId, learningGoal } = req.body;
        
        if (!tempUserId || !otp || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "User ID, OTP, and phone number are required."
            });
        }
        
        // Find user
        const user = await User.findById(tempUserId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        
        // Check if OTP exists and is valid
        const otpData = otpStore.get(user.email);
        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or not found. Please request a new OTP."
            });
        }
        
        // Verify OTP
        if (otpData.otp !== otp || otpData.phoneNumber !== phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP or phone number. Please try again."
            });
        }

        // Check if language exists if provided
        if (languageId) {
            const language = await Language.findById(languageId);
            if (!language) {
                return res.status(400).json({
                    success: false,
                    message: "Selected language not found."
                });
            }
        }
        
        // Update user profile with phone number and additional details
        user.phoneNumber = phoneNumber;
        user.isVerified = true;
        
        if (languageId) {
            user.languageToLearn = languageId;
        }
        
        if (learningGoal) {
            user.learningGoal = learningGoal;
        }
        
        await user.save();
        
        // Remove OTP from store
        otpStore.delete(user.email);
        
        // Send welcome email
        await sendEmail(
            user.email,
            "Welcome to Preplings!",
            "welcome",
            {
                name: user.name,
                websiteUrl: process.env.CLIENT_URL || "http://localhost:5173"
            }
        );
        
        // Update user online status
        user.isOnline = true;
        user.lastActive = new Date();
        await user.save();

        // Broadcast user online status
        updateUserStatus(user._id.toString(), true);
        
        // Generate JWT token and log the user in
        return generateToken(res, user, `Welcome to Preplings, ${user.name}!`);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to complete registration"
        });
    }
};

/**
 * Resend OTP for Phone Verification
 */
export const resendPhoneOTP = async (req, res) => {
    try {
        const { tempUserId, phoneNumber } = req.body;
        
        if (!tempUserId || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "User ID and phone number are required."
            });
        }
        
        // Find user
        const user = await User.findById(tempUserId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        
        // Generate new OTP
        const otp = generateOTP();
        
        // Store OTP and phone number
        otpStore.set(user.email, {
            otp,
            phoneNumber,
            createdAt: new Date()
        });
        
        // Determine which social provider the user is using
        const provider = user.googleId ? "Google" : user.facebookId ? "Facebook" : "social";
        
        // Send OTP via email
        await sendEmail(
            user.email,
            "Your New Verification Code | Preplings",
            "otp-verification", // Make sure this matches your template filename
            {
                name: user.name,
                otp,
                provider,
                websiteUrl: process.env.CLIENT_URL || "http://localhost:5173"
            }
        );
        
        // Send OTP via SMS
        if (twilioClient) {
            // await sendSMS(
            //     phoneNumber,
            //     `Your new Preplings verification code is: ${otp}. This code expires in 15 minutes.`
            // );
        }
        
        return res.status(200).json({
            success: true,
            message: "New verification code sent to your email and phone number.",
            otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only include OTP in development
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to resend verification code"
        });
    }
};