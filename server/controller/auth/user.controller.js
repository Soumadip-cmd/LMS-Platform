import { User } from "../../models/user.model.js";
import { Language } from "../../models/language.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { upload } from "../../middlewares/multer.js";
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
    host: process.env.EMAIL_SERVICE || 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER || 'care@preplings.com',
        pass: process.env.EMAIL_PASSWORD || 'AWMA4KAjFaep',
        type: 'login'  // Explicitly set authentication type
    },
    debug: true  // Enable debug for troubleshooting
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
            from: `"Preplings" <${process.env.EMAIL_FROM || 'care@preplings.com'}>`,
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

        // Log the OTP prominently for testing
        console.log('=================================================');
        console.log(`🔑 INITIAL REGISTRATION OTP: ${otp} for ${email}`);
        console.log(`🔑 COPY THIS CODE: ${otp}`);
        console.log('=================================================');

        // Use a fallback secret key if environment variable is not set
        const secretKey = process.env.ACTIVATION_SECRET_KEY || 'preplings-activation-secret-key';
        const activationToken = generateJWT(
            { userData },
            secretKey,
            "15m"
        );

        // Store OTP, token and user data
        otpStore.set(email, {
            otp,
            activationToken,
            createdAt: new Date(),
            userData // Store user data for potential token regeneration
        });

        // Send OTP via email - catch errors to prevent the registration from failing
        try {
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
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // Continue execution even if email fails
        }

        // Send OTP via SMS if phone number provided
        if (phoneNumber && twilioClient) {
            await sendSMS(
                phoneNumber,
                `Your Preplings verification code is: ${otp}. This code expires in 15 minutes.`
            );
        }

        // In development mode, include the OTP in the response
        return res.status(200).json({
            success: true,
            message: "OTP sent to your email" + (phoneNumber ? " and phone number" : "") + " for verification.",
            activationToken,
            otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only include OTP in development
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

        // Log the expected OTP for verification
        console.log('=================================================');
        console.log(`🔑 EXPECTED OTP: ${otpData.otp}, RECEIVED OTP: ${otp}`);
        console.log('=================================================');

        // Verify OTP
        if (otpData.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please try again."
            });
        }

        console.log('=================================================');
        console.log(`✅ OTP VERIFICATION SUCCESSFUL for ${email}`);
        console.log('=================================================');

        // Verify activation token
        let decodedToken;
        try {
            // Use a fallback secret key if environment variable is not set
            const secretKey = process.env.ACTIVATION_SECRET_KEY || 'preplings-activation-secret-key';
            decodedToken = jwt.verify(
                activationToken,
                secretKey
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

        // Send welcome email - catch errors to prevent the registration from failing
        try {
            await sendEmail(
                email,
                "Welcome to Preplings!",
                "welcome",
                {
                    name: userData.name,
                    websiteUrl: process.env.CLIENT_URL || "http://localhost:5173"
                }
            );
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
            // Continue execution even if email fails
        }

        // Generate JWT token for automatic login after registration
        const token = jwt.sign(
            {
                userId: newUser._id.toString(),
                role: newUser.role,
                email: newUser.email,
                uniqueSignature: Date.now().toString()
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '24h',
                algorithm: 'HS256'
            }
        );

        // Set cookie with token
        const cookieDomain = process.env.NODE_ENV === 'production'
            ? process.env.COOKIE_DOMAIN || '.preplings.com' // Use .preplings.com to work on both www and non-www
            : 'localhost';

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Less strict than 'strict'
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/',
            domain: cookieDomain
        });

        // Update user status
        newUser.isOnline = true;
        newUser.lastActive = new Date();
        await newUser.save();

        // Include token in response for clients that can't access cookies
        return res.status(201).json({
            success: true,
            message: "Account created successfully. You are now logged in.",
            token: token, // Include token in response
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
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

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        // Try to verify the activation token if provided
        let userData = null;
        let newActivationToken = activationToken;

        if (activationToken) {
            try {
                // Use a fallback secret key if environment variable is not set
                const secretKey = process.env.ACTIVATION_SECRET_KEY || 'preplings-activation-secret-key';
                const decodedToken = jwt.verify(
                    activationToken,
                    secretKey
                );
                userData = decodedToken.userData;
                console.log("Successfully decoded token:", userData);
            } catch (error) {
                console.log("Token verification failed, checking for user data in database");
                // Token expired, try to find user data from previous registration attempt
                const existingUser = await User.findOne({ email, isVerified: false });

                if (existingUser) {
                    // User exists but not verified, create new token with existing data
                    userData = {
                        name: existingUser.name,
                        email: existingUser.email,
                        password: existingUser.password, // Already hashed
                        ...(existingUser.phoneNumber && { phoneNumber: existingUser.phoneNumber }),
                        ...(existingUser.languageToLearn && { languageToLearn: existingUser.languageToLearn }),
                        ...(existingUser.learningGoal && { learningGoal: existingUser.learningGoal })
                    };
                } else {
                    // Check if we have data in the OTP store
                    const otpData = otpStore.get(email);
                    if (otpData && otpData.userData) {
                        userData = otpData.userData;
                    } else {
                        return res.status(400).json({
                            success: false,
                            message: "Registration session expired. Please start registration again."
                        });
                    }
                }

                // Generate new activation token
                // Use a fallback secret key if environment variable is not set
                const secretKey = process.env.ACTIVATION_SECRET_KEY || 'preplings-activation-secret-key';
                newActivationToken = generateJWT(
                    { userData },
                    secretKey,
                    "15m"
                );
                console.log("Generated new token for expired session");
            }
        } else {
            // No token provided, check if we have user data in OTP store
            const otpData = otpStore.get(email);
            if (otpData && otpData.userData) {
                userData = otpData.userData;
                // Generate new activation token
                // Use a fallback secret key if environment variable is not set
                const secretKey = process.env.ACTIVATION_SECRET_KEY || 'preplings-activation-secret-key';
                newActivationToken = generateJWT(
                    { userData },
                    secretKey,
                    "15m"
                );
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Registration session not found. Please start registration again."
                });
            }
        }

        // Generate new OTP
        const otp = generateOTP();

        // Log the OTP prominently for testing
        console.log('=================================================');
        console.log(`🔑 RESENT REGISTRATION OTP: ${otp} for ${email}`);
        console.log(`🔑 COPY THIS CODE: ${otp}`);
        console.log('=================================================');

        // Update OTP store with new data
        otpStore.set(email, {
            otp,
            activationToken: newActivationToken,
            createdAt: new Date(),
            userData // Store user data for potential future token regeneration
        });

        // Send OTP via email - catch errors to prevent the registration from failing
        try {
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
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // Continue execution even if email fails
        }

        // Send OTP via SMS if phone number provided
        if (userData.phoneNumber && twilioClient) {
            await sendSMS(
                userData.phoneNumber,
                `Your new Preplings verification code is: ${otp}. This code expires in 15 minutes.`
            );
        }

        // In development mode, include the OTP in the response
        return res.status(200).json({
            success: true,
            message: "OTP resent successfully.",
            activationToken: newActivationToken, // Return the new token if it was regenerated
            otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only include OTP in development
        });
    } catch (error) {
        console.log("Resend OTP error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to resend OTP. Please try again."
        });
    }
};


export const login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // Verify password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // Check user verification
      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Please verify your account"
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id.toString(),
          role: user.role,
          email: user.email,
          uniqueSignature: Date.now().toString()
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '24h',
          algorithm: 'HS256'
        }
      );


    // Set cookie with token
    const cookieDomain = process.env.NODE_ENV === 'production'
      ? process.env.COOKIE_DOMAIN || '.preplings.com' // Use .preplings.com to work on both www and non-www
      : 'localhost';

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Less strict than 'strict'
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/',
        domain: cookieDomain
      });

      // Update user status
      user.isOnline = true;
      user.lastActive = new Date();
      await user.save();

      // Include token in response for clients that can't access cookies
      return res.status(200).json({
        success: true,
        message: `Welcome back, ${user.name}`,
        token: token, // Include token in response
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login Error:', error);
      return res.status(500).json({
        success: false,
        message: "Login failed. Please try again."
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

          // Broadcast user offline status
          updateUserStatus(user._id.toString(), false);
        }
      }

      // Clear the access_token cookie
      return res.status(200)
        .cookie("access_token", "", {
          maxAge: 0,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
        .json({
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

export const uploadResume = upload.single('resume');

// Update the becomeInstructor function to work with either a file or a resumeUrl
export const becomeInstructor = async (req, res) => {
    try {
        const userId = req.id;
        const {
            teachLanguage,
            qualification,
            name,
            linkedin,
            dob,
            address,
            gender,
            country,
            email,
            contactNumber,
            resumeUrl // Accept resumeUrl from the request body
        } = req.body;

        // Get resume URL (either from uploaded file or from the provided URL)
        let finalResumeUrl;

        if (req.file) {
            // If a file was uploaded with this request
            finalResumeUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        } else if (resumeUrl) {
            // If a resumeUrl was provided in the request body
            finalResumeUrl = resumeUrl;
        } else {
            // No resume was provided
            return res.status(400).json({
                success: false,
                message: "Resume file is required."
            });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Check if user is already an instructor
        if (user.role === "instructor") {
            return res.status(400).json({
                success: false,
                message: "You are already an instructor."
            });
        }

        // Validate required fields
        const requiredFields = [
            'teachLanguage', 'qualification', 'name', 'dob',
            'address', 'gender', 'country', 'email', 'contactNumber'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Fetch language name if a language ID is provided
        let languageName = "Unknown";
        try {
            if (teachLanguage) {
                const language = await Language.findById(teachLanguage);
                if (language) {
                    languageName = language.name;
                }
            }
        } catch (error) {
            console.log("Error fetching language: ", error);
        }

        // Update user role to instructor
        user.role = "instructor";

        // Create instructor profile
        user.instructorProfile = {
            teachLanguage,
            qualification,
            linkedin: linkedin || "", // Optional field
            dob,
            address,
            gender,
            country,
            contactNumber,
            resumeUrl: finalResumeUrl,
            applicationStatus: "pending",
            applicationDate: new Date()
        };

        // Save the updated user
        await user.save();

        // Send email notification to the applicant
        await sendEmail(
            email,
            "Instructor Application Received | Preplings",
            "instructor-application-confirmation",
            {
                name,
                applicationDate: new Date().toLocaleDateString(),
                language: languageName,
                qualification,
                resumeUrl: finalResumeUrl,
                websiteUrl: process.env.CLIENT_URL || "http://localhost:5173"
            }
        );

        // Send email notification to admin
        await sendEmail(
            process.env.ADMIN_EMAIL || "admin@preplings.com",
            "New Instructor Application | Preplings Admin",
            "instructor-application-admin",
            {
                applicantName: name,
                applicantEmail: email,
                applicationDate: new Date().toLocaleDateString(),
                language: languageName,
                qualification,
                resumeUrl: finalResumeUrl,
                websiteUrl: process.env.CLIENT_URL || "http://localhost:5173",
                adminDashboardUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/admin/applications`
            }
        );

        return res.status(200).json({
            success: true,
            message: "Instructor application submitted successfully. Your application will be reviewed by an admin.",
            resumeUrl: finalResumeUrl
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to process instructor application."
        });
    }
};

// Separate route to handle resume upload only (for preview before form submission)
export const handleResumeUpload = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded."
            });
        }

        // Generate URL for the uploaded file
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully.",
            fileUrl: fileUrl
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "File upload failed."
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


// Function to handle "Get It Now" signup for free German resources
export const getItNow = async (req, res) => {
    try {
      const { fullName, email, phone } = req.body;

      // Validate required fields
      if (!fullName || !email) {
        return res.status(400).json({
          success: false,
          message: "Full name and email are required."
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        // User exists, send them the resource directly
        await sendEmail(
          email,
          "Your Free German Learning Resources | Preplings",
          "free-resources",
          {
            name: existingUser.name,
            websiteUrl: process.env.CLIENT_URL || "http://localhost:5173",
            resourceLink: `${process.env.CLIENT_URL || "http://localhost:5173"}/resources/german-beginner-guide.pdf`
          }
        );

        return res.status(200).json({
          success: true,
          message: "Resource has been sent to your email!",
          resourceLink: "/resources/german-beginner-guide.pdf"
        });
      }

      // Create new lightweight user entry
      // Generate a random password they can reset later if they want to convert to full account
      const tempPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const newUser = new User({
        name: fullName,
        email: email,
        password: hashedPassword, // Required by your schema
        isVerified: true, // Set as verified so they don't need OTP
        role: "student",
        preferredCategories: ["German", "Language Learning"],
        ...(phone && { phoneNumber: phone }),
        learningGoal: "Casual", // Default since it's required for students
        notificationPreferences: {
          email: true,
          push: false,
          categories: true,
          courseUpdates: true
        }
      });

      await newUser.save();

      // Send the free resource
      await sendEmail(
        email,
        "Your Free German Learning Resources | Preplings",
        "free-resources",
        {
          name: fullName,
          websiteUrl: process.env.CLIENT_URL || "http://localhost:5173",
          resourceLink: `${process.env.CLIENT_URL || "http://localhost:5173"}/resources/german-beginner-guide.pdf`
        }
      );

      return res.status(201).json({
        success: true,
        message: "Thank you for signing up! Your free resources have been sent to your email.",
        resourceLink: "/resources/german-beginner-guide.pdf"
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to process your request. Please try again."
      });
    }
  };