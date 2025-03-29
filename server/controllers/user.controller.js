import { User } from "../models/user.model.js";
import { Language } from "../models/language.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { updateUserStatus } from "../socket/socket.js"

/**
 * Register a new user
 * @route POST /api/users/register
 * @access Public
 */
export const register = async (req, res) => {
    try {
        const { name, email, password, languageId, learningGoal } = req.body; 
        
        // Validate required fields
        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }

        // Check if user already exists
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exists with this email."
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

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user data object
        const userData = {
            name,
            email,
            password: hashedPassword,
            ...(languageId && { languageToLearn: languageId }),
            ...(learningGoal && { learningGoal })
        };

        // Create user
        const newUser = await User.create(userData);

        return res.status(201).json({
            success: true,
            message: "Account created successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        });
    }
};

/**
 * User login
 * @route POST /api/users/login
 * @access Public
 */

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
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

/**
 * User logout
 * @route POST /api/users/logout
 * @access Private
 */
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
                updateUserStatus(user._id, false);
            }
        }

        return res.status(200).cookie("token", "", {maxAge: 0}).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to logout"
        });
    }
};

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
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

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
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

/**
 * Add course to wishlist
 * @route POST /api/users/wishlist
 * @access Private
 */
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

/**
 * Remove course from wishlist
 * @route DELETE /api/users/wishlist/:courseId
 * @access Private
 */
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

/**
 * Submit feedback
 * @route POST /api/users/feedback
 * @access Private
 */
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

/**
 * Get user purchase history
 * @route GET /api/users/purchases
 * @access Private
 */
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