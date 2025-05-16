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
    host: process.env.EMAIL_SERVICE || 'smtp.zoho.in',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER || 'care@preplings.com',
        pass: process.env.EMAIL_PASSWORD || 'VELQXEEps10B'
    },
    debug: process.env.NODE_ENV === 'development'
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

            // Generate JWT token and send response - with existingUser flag for frontend to handle properly
            return generateToken(res, user, `Welcome back ${user.name}`, true);
        } else {
            // New user - need to verify phone number
            // Store user data in OTP store instead of creating a user entry
            // This prevents creating incomplete user records
            const tempUserId = crypto.randomBytes(16).toString('hex');
            const userData = {
                name,
                email,
                password: crypto.randomBytes(16).toString('hex'),
                isVerified: false,
                photoUrl: photoURL || "",
                learningGoal: "Casual",
                ...(provider === "google" && { googleId: uid }),
                ...(provider === "facebook" && { facebookId: uid })
            };

            // Log the tempUserId for debugging
            console.log('=================================================');
            console.log(`🆔 TEMP USER ID: ${tempUserId} for ${email}`);
            console.log('=================================================');

            // Generate an initial OTP
            const initialOtp = generateOTP();

            // Log the initial OTP for testing
            console.log('=================================================');
            console.log(`🔑 INITIAL OTP FOR SOCIAL LOGIN: ${initialOtp} for ${email}`);
            console.log(`🔑 COPY THIS CODE: ${initialOtp}`);
            console.log('=================================================');

            // Store the user data temporarily with the OTP
            otpStore.set(email, {
                userData,
                tempUserId,
                createdAt: new Date(),
                otp: initialOtp,
                phoneNumber: null // Will be set when user enters phone number
            });
            return res.status(201).json({
                success: true,
                message: "Please verify your phone number to complete registration.",
                needsPhoneVerification: true,
                tempUserId: tempUserId,
                email,
                otp: process.env.NODE_ENV === 'development' ? initialOtp : undefined // Only include OTP in development
            });
        }
    } catch (error) {
        console.error("Social login error:", error);
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

        // Get user data from OTP store
        let userData = null;
        let userEmail = null;

        // Check all entries in OTP store to find the one with matching tempUserId
        for (const [email, data] of otpStore.entries()) {
            if (data.tempUserId === tempUserId) {
                userData = data.userData;
                userEmail = email;
                break;
            }
        }

        // If no user data found in OTP store, try to find an existing user
        if (!userData && tempUserId.match(/^[0-9a-fA-F]{24}$/)) {
            const existingUser = await User.findById(tempUserId);
            if (existingUser) {
                userData = {
                    name: existingUser.name,
                    email: existingUser.email,
                    googleId: existingUser.googleId,
                    facebookId: existingUser.facebookId
                };
                userEmail = existingUser.email;
            }
        }

        if (!userData || !userEmail) {
            return res.status(404).json({
                success: false,
                message: "User data not found. Please try registering again."
            });
        }

        // Check if phone number is already in use
        const existingPhoneUser = await User.findOne({ phoneNumber });
        if (existingPhoneUser) {
            return res.status(400).json({
                success: false,
                message: "This phone number is already associated with another account."
            });
        }

        // Generate OTP
        const otp = generateOTP();

        // Log the OTP prominently for testing
        console.log('=================================================');
        console.log(`🔑 VERIFICATION CODE: ${otp} for ${userEmail}`);
        console.log(`🔑 COPY THIS CODE: ${otp}`);
        console.log('=================================================');

        // Get existing data from OTP store to preserve it
        const existingData = otpStore.get(userEmail) || {};

        // Store OTP and phone number, preserving existing data
        otpStore.set(userEmail, {
            ...existingData,
            otp,
            phoneNumber,
            createdAt: new Date(),
            userData,
            tempUserId
        });

        // Log the updated OTP store entry for debugging
        console.log('=================================================');
        console.log(`📱 UPDATED OTP STORE FOR ${userEmail}:`);
        console.log(otpStore.get(userEmail));
        console.log('=================================================');

        // Determine which social provider the user is using
        const provider = userData.googleId ? "Google" : userData.facebookId ? "Facebook" : "social";

        try {
            // Send OTP via email - using a template that definitely exists

            await sendEmail(
                userEmail,
                "Your Verification Code | Preplings",
                "otp-google-verification",
                {
                    name: userData.name,
                    otp,
                    provider,
                    websiteUrl: process.env.CLIENT_URL || "http://localhost:5173"
                }
            );

            console.log(`Email sent successfully to ${userEmail} with OTP ${otp}`);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // Continue execution even if email fails - we'll return the OTP in development
        }

        // SMS sending logic
        if (twilioClient) {
            // await sendSMS(
            //     phoneNumber,
            //     `Your Preplings verification code is: ${otp}. This code expires in 15 minutes.`
            // );
        }

        // Get available languages for learning goal selection
        const languages = await Language.find().select('_id name code');

        // In development mode, log the OTP again for clarity
        if (process.env.NODE_ENV === 'development') {
            console.log('=================================================');
            console.log(`🔑 OTP BEING SENT IN RESPONSE: ${otp}`);
            console.log('=================================================');
        }

        return res.status(200).json({
            success: true,
            message: "Verification code sent to your email and phone number.",
            otp: process.env.NODE_ENV === 'development' ? otp : undefined, // Only include OTP in development
            languages: languages,
            learningGoals: ["Casual", "Professional", "Exam Prep"]
        });
    } catch (error) {
        console.error("Phone verification error:", error);
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

      // Get user data from OTP store
      let userData = null;
      let userEmail = null;

      // Check all entries in OTP store to find the one with matching tempUserId
      for (const [email, data] of otpStore.entries()) {
        if (data.tempUserId === tempUserId) {
          userData = data.userData;
          userEmail = email;
          break;
        }
      }

      // If no user data found, try to find an existing user
      if (!userData && tempUserId.match(/^[0-9a-fA-F]{24}$/)) {
        // If it looks like a MongoDB ObjectId, try to find the user
        const existingUser = await User.findById(tempUserId);
        if (existingUser) {
          userData = {
            name: existingUser.name,
            email: existingUser.email,
            password: existingUser.password,
            photoUrl: existingUser.photoUrl,
            googleId: existingUser.googleId,
            facebookId: existingUser.facebookId,
            learningGoal: existingUser.learningGoal || "Casual"
          };
          userEmail = existingUser.email;
        }
      }

      if (!userData || !userEmail) {
        return res.status(404).json({
          success: false,
          message: "User data not found. Please try registering again."
        });
      }

      // Check if OTP exists and is valid
      const otpData = otpStore.get(userEmail);
      if (!otpData) {
        return res.status(400).json({
          success: false,
          message: "OTP expired or not found. Please request a new OTP."
        });
      }

      // Log the expected OTP for verification
      console.log('=================================================');
      console.log(`🔑 EXPECTED OTP: ${otpData.otp}, RECEIVED OTP: ${otp}`);
      console.log(`📱 EXPECTED PHONE: ${otpData.phoneNumber}, RECEIVED PHONE: ${phoneNumber}`);
      console.log('=================================================');

      // Verify OTP only - don't check phone number yet
      if (otpData.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid verification code. Please try again."
        });
      }

      // Log the phone number for debugging
      console.log('=================================================');
      console.log(`📱 PHONE NUMBER RECEIVED: ${phoneNumber}`);
      console.log(`📱 PHONE NUMBER IN STORE: ${otpData.phoneNumber}`);
      console.log('=================================================');

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

      // Log the user data before creating the user
      console.log('=================================================');
      console.log('📝 CREATING USER WITH DATA:');
      console.log({
        ...userData,
        phoneNumber: phoneNumber,
        isVerified: true,
        ...(languageId && { languageToLearn: languageId }),
        ...(learningGoal && { learningGoal: learningGoal })
      });
      console.log('=================================================');

      try {
        // Create a new user with the verified data
        const newUser = await User.create({
          ...userData,
          phoneNumber: phoneNumber,
          isVerified: true,
          ...(languageId && { languageToLearn: languageId }),
          ...(learningGoal && { learningGoal: learningGoal })
        });

        // Remove OTP from store
        otpStore.delete(userEmail);

        // Send welcome email - catch errors to prevent the registration from failing
        try {
          await sendEmail(
            newUser.email,
            "Welcome to Preplings!",
            "welcome",
            {
              name: newUser.name,
              websiteUrl: process.env.CLIENT_URL || "http://localhost:5173"
            }
          );
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // Continue execution even if email fails
        }

        // Update user online status
        newUser.isOnline = true;
        newUser.lastActive = new Date();
        await newUser.save();

        // Broadcast user online status
        updateUserStatus(newUser._id.toString(), true);

        // Generate JWT token and log the user in
        return generateToken(res, newUser, `Welcome to Preplings, ${newUser.name}!`);
      } catch (createError) {
        console.error("Error creating user:", createError);

        // In development mode, return a more detailed error message
        if (process.env.NODE_ENV === 'development') {
          return res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: createError.message,
            stack: createError.stack
          });
        } else {
          return res.status(500).json({
            success: false,
            message: "Failed to create user"
          });
        }
      }
    } catch (error) {
      console.error("Error in completeSocialRegistration:", error);

      // In development mode, return a more detailed error message
      if (process.env.NODE_ENV === 'development') {
        return res.status(500).json({
          success: false,
          message: "Failed to complete registration",
          error: error.message,
          stack: error.stack
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to complete registration"
        });
      }
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

        // Get user data from OTP store
        let userData = null;
        let userEmail = null;

        // Check all entries in OTP store to find the one with matching tempUserId
        for (const [email, data] of otpStore.entries()) {
            if (data.tempUserId === tempUserId) {
                userData = data.userData;
                userEmail = email;
                break;
            }
        }

        // If no user data found in OTP store, try to find an existing user
        if (!userData && tempUserId.match(/^[0-9a-fA-F]{24}$/)) {
            const existingUser = await User.findById(tempUserId);
            if (existingUser) {
                userData = {
                    name: existingUser.name,
                    email: existingUser.email,
                    googleId: existingUser.googleId,
                    facebookId: existingUser.facebookId
                };
                userEmail = existingUser.email;
            }
        }

        if (!userData || !userEmail) {
            return res.status(404).json({
                success: false,
                message: "User data not found. Please try registering again."
            });
        }

        // Generate new OTP
        const otp = generateOTP();

        // Log the OTP prominently for testing
        console.log('=================================================');
        console.log(`🔑 RESENT VERIFICATION CODE: ${otp} for ${userEmail}`);
        console.log('=================================================');

        // Get existing data from OTP store to preserve it
        const existingData = otpStore.get(userEmail) || {};

        // Store OTP and phone number, preserving existing data
        otpStore.set(userEmail, {
            ...existingData,
            otp,
            phoneNumber,
            createdAt: new Date(),
            userData,
            tempUserId
        });

        // Log the updated OTP store entry for debugging
        console.log('=================================================');
        console.log(`📱 UPDATED OTP STORE FOR ${userEmail} (RESEND):`);
        console.log(otpStore.get(userEmail));
        console.log('=================================================');

        // Determine which social provider the user is using
        const provider = userData.googleId ? "Google" : userData.facebookId ? "Facebook" : "social";

        // Send OTP via email
        await sendEmail(
            userEmail,
            "Your New Verification Code | Preplings",
            "otp-google-verification",
            {
                name: userData.name,
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

        // Log the OTP in development mode for debugging
        if (process.env.NODE_ENV === 'development') {
            console.log(`OTP for ${userEmail} (${phoneNumber}): ${otp}`);
        }

        return res.status(200).json({
            success: true,
            message: "New verification code sent to your email and phone number.",
            otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only include OTP in development
        });
    } catch (error) {
        console.error("Error in resendPhoneOTP:", error);

        // In development mode, return a more detailed error message
        if (process.env.NODE_ENV === 'development') {
            return res.status(500).json({
                success: false,
                message: "Failed to resend verification code",
                error: error.message,
                stack: error.stack
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to resend verification code"
            });
        }
    }
};