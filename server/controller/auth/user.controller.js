import { User } from "../../models/user.model.js";
import { Language } from "../../models/language.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/generateToken.js";

import { updateUserStatus, getIO } from "../../socket/socket.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import path from "path";
import ejs from "ejs";
import twilio from "twilio";

// Initialize Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

// OTP storage (In production, should use Redis or similar service)
const otpStore = new Map();

// Configure email transport
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
        user: 'preplings@zohomail.in', // Use the actual email address instead of env variable
        pass: 'EvGdpzjJprNs' // Use the actual app password instead of env variable for testing
    },
    debug: true // Add this for debugging purposes
});

/**
 * Generate OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


const generateJWT = (data, secret, expiry) => {
    return jwt.sign(data, secret, { expiresIn: expiry });
};


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
 * @param {string} to - Phone number
 * @param {string} body - SMS body
 */
const sendSMS = async (to, body) => {
    try {
        if (!twilioClient) {
            console.warn("Twilio client not configured. SMS not sent.");
            return;
        }
        
        await twilioClient.messages.create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });
        
        console.log(`SMS sent to ${to}`);
    } catch (error) {
        console.error("SMS sending failed:", error);
        throw new Error("Failed to send SMS");
    }
};


export const initiateRegistration = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, languageId, learningGoal } = req.body;
        
        // Validate required fields
        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }

        // Check if user already exists with email
        const existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email."
            });
        }

        // Check if user already exists with phone number (if provided)
        if (phoneNumber) {
            const existingUserPhone = await User.findOne({ phoneNumber });
            if (existingUserPhone) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists with this phone number."
                });
            }
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

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user data object
        const userData = {
            name,
            email,
            password: hashedPassword,
            ...(phoneNumber && { phoneNumber }),
            ...(languageId && { languageToLearn: languageId }),
            ...(learningGoal && { learningGoal })
        };

        // Generate OTP and activation token
        const otp = generateOTP();
        const activationToken = generateJWT(
            { userData },
            process.env.ACTIVATION_SECRET_KEY ,
            "15m"
        );
        
        // Store OTP and token
        otpStore.set(email, {
            otp,
            activationToken,
            createdAt: new Date()
        });
        
        // Send OTP via email
        await sendEmail(
            email,
            "Verify Your Account | Preplings",
            "verification",
            {
                name,
                otp,
                websiteUrl: process.env.CLIENT_URL || "http://localhost:5173"
            }
        );

        // Send OTP via SMS if phone number provided
        if (phoneNumber && twilioClient) {
            await sendSMS(
                phoneNumber,
                `Your Preplings verification code is: ${otp}. This code expires in 15 minutes.`
            );
        }

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email" + (phoneNumber ? " and phone number" : "") + " for verification.",
            activationToken
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to initiate registration"
        });
    }
};


export const verifyOTPAndRegister = async (req, res) => {
    try {
        const { email, otp, activationToken } = req.body;
        
        if (!email || !otp || !activationToken) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and activation token are required."
            });
        }
        
        // Check if OTP exists and is valid
        const otpData = otpStore.get(email);
        
        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or not found. Please request a new OTP."
            });
        }
        
        // Verify OTP
        if (otpData.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please try again."
            });
        }
        
        // Verify activation token
        let decodedToken;
        try {
            decodedToken = jwt.verify(
                activationToken,
                process.env.ACTIVATION_SECRET_KEY 
            );
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired activation token."
            });
        }
        
        // Create new user
        const userData = decodedToken.userData;
        userData.isVerified = true;
        
        const newUser = await User.create(userData);
        
        // Remove OTP from store
        otpStore.delete(email);
        
        // Send welcome email
        await sendEmail(
            email,
            "Welcome to Preplings!",
            "welcome",
            {
                name: userData.name,
                websiteUrl: process.env.CLIENT_URL || "http://localhost:5173"
            }
        );
        
        return res.status(201).json({
            success: true,
            message: "Account created successfully. You can now login."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to complete registration"
        });
    }
};


export const resendOTP = async (req, res) => {
    try {
        const { email, activationToken } = req.body;
        
        if (!email || !activationToken) {
            return res.status(400).json({
                success: false,
                message: "Email and activation token are required."
            });
        }
        
        // Verify activation token
        let decodedToken;
        try {
            decodedToken = jwt.verify(
                activationToken,
                process.env.ACTIVATION_SECRET_KEY || "activation-secret"
            );
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired activation token."
            });
        }
        
        const userData = decodedToken.userData;
        
        // Generate new OTP
        const otp = generateOTP();
        
        // Update OTP store
        otpStore.set(email, {
            otp,
            activationToken,
            createdAt: new Date()
        });
        
        // Send OTP via email
        await sendEmail(
            email,
            "Your New Verification Code | Preplings",
            "verification",
            {
                name: userData.name,
                otp,
                websiteUrl: process.env.CLIENT_URL || "http://localhost:5173"
            }
        );
        
        // Send OTP via SMS if phone number provided
        if (userData.phoneNumber && twilioClient) {
            await sendSMS(
                userData.phoneNumber,
                `Your new Preplings verification code is: ${otp}. This code expires in 15 minutes.`
            );
        }
        
        return res.status(200).json({
            success: true,
            message: "OTP resent successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to resend OTP"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
        }
        
        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your account before logging in."
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
        }

        // Update user online status
        user.isOnline = true;
        user.lastActive = new Date();
        await user.save();

        // Broadcast user online status to all clients via socket
        updateUserStatus(user._id.toString(), true);
        
        // Generate JWT token and send response
        generateToken(res, user, `Welcome back ${user.name}`);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        });
    }
};


export const logout = async (req, res) => {
    try {
        // Update user online status
        if (req.id) {
            const user = await User.findById(req.id);
            if (user) {
                user.isOnline = false;
                user.lastActive = new Date();
                await user.save();
                
                // Broadcast user offline status to appropriate channels
                updateUserStatus(user._id.toString(), false);
                
                // Get socket IO instance
                const io = getIO();
                if (io) {
                    // Emit detailed logout event
                    io.emit("userLogout", {
                        userId: user._id.toString(),
                        username: user.name,
                        timestamp: new Date(),
                        status: {
                            isOnline: false,
                            lastActive: user.lastActive
                        }
                    });
                }
            }
        }

        return res.status(200).cookie("token", "", {maxAge: 0}).json({
            message: "Logged out successfully.",
            success: true,
            timestamp: new Date(),
            status: "offline"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to logout"
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { emailOrPhone } = req.body;
        
        if (!emailOrPhone) {
            return res.status(400).json({
                success: false,
                message: "Email or phone number is required."
            });
        }
        
        // Check if it's an email or phone number
        const isEmail = emailOrPhone.includes('@');
        
        // Find user by email or phone
        const user = isEmail 
            ? await User.findOne({ email: emailOrPhone })
            : await User.findOne({ phoneNumber: emailOrPhone });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with that email or phone number."
            });
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const otp = generateOTP();
        
        // Hash token and store it
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        
        // Set token and expiry in user model
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();
        
        // Store OTP
        otpStore.set(user.email, {
            otp,
            resetToken,
            createdAt: new Date()
        });
        
        // Send password reset email
        if (isEmail || user.email) {
            await sendEmail(
                user.email,
                "Reset Your Password | Preplings",
                "reset-password",
                {
                    name: user.name,
                    otp,
                    websiteUrl: process.env.CLIENT_URL || "http://localhost:5173"
                }
            );
        }
        
        // Send SMS if it's a phone number or user has phone
        if ((!isEmail || user.phoneNumber) && twilioClient) {
            await sendSMS(
                user.phoneNumber,
                `Your Preplings password reset code is: ${otp}. This code expires in 15 minutes.`
            );
        }
        
        return res.status(200).json({
            success: true,
            message: `Password reset code sent to your ${isEmail ? 'email' : 'phone number'}.`,
            resetToken
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to process password reset request"
        });
    }
};


export const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp, resetToken } = req.body;
        
        if (!email || !otp || !resetToken) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and reset token are required."
            });
        }
        
        // Check if OTP exists and is valid
        const otpData = otpStore.get(email);
        
        if (!otpData || otpData.resetToken !== resetToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset request."
            });
        }
        
        // Verify OTP
        if (otpData.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid reset code. Please try again."
            });
        }
        
        // Find user
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        
        const user = await User.findOne({
            email,
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
        
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Password reset request is invalid or has expired."
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully. You can now reset your password.",
            userId: user._id
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify reset code"
        });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { userId, password } = req.body;
        
        if (!userId || !password) {
            return res.status(400).json({
                success: false,
                message: "User ID and new password are required."
            });
        }
        
        // Find user
        const user = await User.findById(userId);
        
        if (!user || !user.resetPasswordToken || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Password reset request is invalid or has expired."
            });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Update user's password and clear reset fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        
        // Remove OTP from store
        otpStore.delete(user.email);
        
        // Send password changed confirmation
        await sendEmail(
            user.email,
            "Password Changed Successfully | Preplings",
            "password-changed",
            {
                name: user.name,
                websiteUrl: process.env.CLIENT_URL || "http://localhost:5173"
            }
        );
        
        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully. You can now login with your new password."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to reset password"
        });
    }
};

/**
 * Change password (when logged in)
 
 */
export const changePassword = async (req, res) => {
    try {
        const userId = req.id;
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required."
            });
        }
        
        // Find user
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        
        // Verify current password
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect."
            });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password
        user.password = hashedPassword;
        await user.save();
        
        // Send password changed confirmation
        await sendEmail(
            user.email,
            "Password Changed Successfully | Preplings",
            "password-changed",
            {
                name: user.name,
                websiteUrl: process.env.CLIENT_URL || "http://localhost:5173"
            }
        );
        
        return res.status(200).json({
            success: true,
            message: "Password changed successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to change password"
        });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId)
            .select("-password")
            .populate("enrolledCourses")
            .populate("languageToLearn")
            .populate("wishlist");
            
        if(!user){
            return res.status(404).json({
                message: "Profile not found",
                success: false
            });
        }
        
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load user"
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { 
            name, 
            languageId, 
            learningGoal, 
            preferredLearningStyle 
        } = req.body;
        
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false
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

        // Create updatedData object with provided fields
        const updatedData = {
            ...(name && { name }),
            ...(languageId && { languageToLearn: languageId }),
            ...(learningGoal && { learningGoal }),
            ...(preferredLearningStyle && { preferredLearningStyle })
        };

        // Handle profile photo update if provided
        if (profilePhoto) {
            // Remove old photo if exists
            if(user.photoUrl){
                const publicId = user.photoUrl.split("/").pop().split(".")[0]; // extract public id
                deleteMediaFromCloudinary(publicId);
            }

            // Upload new photo
            const cloudResponse = await uploadMedia(profilePhoto.path);
            updatedData.photoUrl = cloudResponse.secure_url;
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updatedData, 
            { new: true }
        )
        .select("-password")
        .populate("languageToLearn");

        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};


export const addToWishlist = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required."
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { wishlist: courseId } },
            { new: true }
        ).populate("wishlist");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            wishlist: updatedUser.wishlist,
            message: "Course added to wishlist."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to add to wishlist."
        });
    }
};


export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.params;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { wishlist: courseId } },
            { new: true }
        ).populate("wishlist");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            wishlist: updatedUser.wishlist,
            message: "Course removed from wishlist."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove from wishlist."
        });
    }
};


export const submitFeedback = async (req, res) => {
    try {
        const userId = req.id;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Feedback content is required."
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        user.feedback.push({ content });
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Feedback submitted successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit feedback."
        });
    }
};


export const getPurchaseHistory = async (req, res) => {
    try {
        const userId = req.id;
        
        const user = await User.findById(userId)
            .select("purchaseHistory")
            .populate({
                path: "purchaseHistory.course",
                select: "title level thumbnailUrl"
            });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        
        return res.status(200).json({
            success: true,
            purchaseHistory: user.purchaseHistory
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch purchase history."
        });
    }
};

/**
 * Apply to become an instructor
 * @route POST /api/users/become-instructor
 * @access Private
 */
export const becomeInstructor = async (req, res) => {
    try {
        const userId = req.id;
        const { qualifications, experience, teachingLanguages } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        
        if (user.role === "instructor") {
            return res.status(400).json({
                success: false,
                message: "You are already an instructor."
            });
        }
        
        // In a real application, this would likely create an instructor application
        // that would be reviewed by an admin rather than immediately changing the role
        
        // For MVP, directly update user role to "instructor" pending admin approval
        user.role = "instructor";
        
        // Store additional instructor information if provided
        if (qualifications || experience || teachingLanguages) {
            user.instructorProfile = {
                ...(qualifications && { qualifications }),
                ...(experience && { experience }),
                ...(teachingLanguages && { teachingLanguages })
            };
        }
        
        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "Instructor application submitted successfully. Your account will be reviewed by an admin."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to process instructor application."
        });
    }
};

/**
 * Get exam attempts history
 * @route GET /api/users/exam-history
 * @access Private
 */
export const getExamHistory = async (req, res) => {
    try {
        const userId = req.id;
        
        const user = await User.findById(userId)
            .select("examAttempts")
            .populate({
                path: "examAttempts.exam",
                select: "title course",
                populate: {
                    path: "course",
                    select: "title"
                }
            });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        
        return res.status(200).json({
            success: true,
            examAttempts: user.examAttempts
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch exam history."
        });
    }
};

/**
 * Get user notifications
 * @route GET /api/users/notifications
 * @access Private
 */
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.id;
        
        const user = await User.findById(userId)
            .select("notifications");
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        
        return res.status(200).json({
            success: true,
            notifications: user.notifications || []
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications."
        });
    }
};

/**
 * Mark notification as read
 * @route PUT /api/users/notifications/:notificationId
 * @access Private
 */
//not needed for now as per mvp draft 
// export const markNotificationAsRead = async (req, res) => {
//     try {
//         const userId = req.id;
//         const { notificationId } = req.params;
        
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found."
//             });
//         }
        
//         // Find notification in user's notifications array
//         if (!user.notifications) {
//             user.notifications = [];
//         }
        
//         const notificationIndex = user.notifications.findIndex(
//             notification => notification._id.toString() === notificationId
//         );
        
//         if (notificationIndex === -1) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Notification not found."
//             });
//         }
        
//         // Mark notification as read
//         user.notifications[notificationIndex].isRead = true;
//         await user.save();
        
//         return res.status(200).json({
//             success: true,
//             message: "Notification marked as read."
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to update notification."
//         });
//     }
// };

/**
 * Update user learning preferences
 * @route PUT /api/users/learning-preferences
 * @access Private
 */
export const updateLearningPreferences = async (req, res) => {
    try {
        const userId = req.id;
        const { 
            preferredLearningStyle, 
            learningGoal, 
            languageId 
        } = req.body;
        
        if (!preferredLearningStyle && !learningGoal && !languageId) {
            return res.status(400).json({
                success: false,
                message: "At least one preference must be provided."
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
        
        // Create updatedData object with provided fields
        const updatedData = {
            ...(preferredLearningStyle && { preferredLearningStyle }),
            ...(learningGoal && { learningGoal }),
            ...(languageId && { languageToLearn: languageId })
        };
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedData,
            { new: true }
        )
        .select("preferredLearningStyle learningGoal languageToLearn")
        .populate("languageToLearn");
        
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        
        return res.status(200).json({
            success: true,
            preferences: {
                preferredLearningStyle: updatedUser.preferredLearningStyle,
                learningGoal: updatedUser.learningGoal,
                language: updatedUser.languageToLearn
            },
            message: "Learning preferences updated successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update learning preferences."
        });
    }
};