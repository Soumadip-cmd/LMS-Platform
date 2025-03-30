import { User } from "../../models/user.model.js";
import { Course } from "../../models/course.model.js";
import mongoose from "mongoose";

/**
 * Get admin dashboard statistics
 * @route GET /api/admin/dashboard
 * @access Admin only
 */
export const getDashboardStats = async (req, res) => {
    try {
        // Get user statistics
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ 
            lastActive: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
        });
        const instructorCount = await User.countDocuments({ role: "instructor" });
        
        // Get new sign-ups in the last 30 days
        const newSignUps = await User.countDocuments({ 
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
        });
        
        // Get course statistics
        const totalCourses = await Course.countDocuments();
        const activeCourses = await Course.countDocuments({ isPublished: true });
        
        // Get top performing courses
        const topCourses = await Course.find({ isPublished: true })
            .sort({ "rating.average": -1, "enrolledStudents.length": -1 })
            .limit(5)
            .select("title rating.average enrolledStudents thumbnailUrl")
            .populate("language", "name");
            
        // Get language distribution
        const languageDistribution = await User.aggregate([
            {
                $group: {
                    _id: "$languageToLearn",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "languages",
                    localField: "_id",
                    foreignField: "_id",
                    as: "languageInfo"
                }
            },
            {
                $unwind: {
                    path: "$languageInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    languageName: "$languageInfo.name"
                }
            }
        ]);
        
        return res.status(200).json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    instructors: instructorCount,
                    newSignUps
                },
                courses: {
                    total: totalCourses,
                    active: activeCourses,
                    topPerforming: topCourses
                },
                languages: languageDistribution
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics."
        });
    }
};

/**
 * Get all users with filters
 * @route GET /api/admin/users
 * @access Admin only
 */
export const getAllUsers = async (req, res) => {
    try {
        const { 
            role, 
            language, 
            subscription,
            searchTerm,
            page = 1, 
            limit = 10 
        } = req.query;
        
        // Build query
        const query = {};
        
        if (role) {
            query.role = role;
        }
        
        if (language) {
            query.languageToLearn = language;
        }
        
        if (subscription) {
            query.subscriptionPlan = subscription;
        }
        
        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        
        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Execute query
        const users = await User.find(query)
            .select("-password")
            .populate("languageToLearn", "name")
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
            
        // Get total count for pagination
        const totalUsers = await User.countDocuments(query);
        
        return res.status(200).json({
            success: true,
            users,
            pagination: {
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users."
        });
    }
};

/**
 * Get user by ID
 * @route GET /api/admin/users/:id
 * @access Admin only
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("languageToLearn", "name")
            .populate("enrolledCourses", "title")
            .populate("wishlist", "title");
            
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
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
            message: "Failed to fetch user."
        });
    }
};

/**
 * Update user by ID
 * @route PUT /api/admin/users/:id
 * @access Admin only
 */
export const updateUserById = async (req, res) => {
    try {
        const { 
            name, 
            role, 
            subscriptionPlan, 
            subscriptionStatus,
            preferredLearningStyle,
            notes
        } = req.body;
        
        // Create update object
        const updateData = {
            ...(name && { name }),
            ...(role && { role }),
            ...(subscriptionPlan && { subscriptionPlan }),
            ...(subscriptionStatus && { subscriptionStatus }),
            ...(preferredLearningStyle && { preferredLearningStyle }),
            ...(notes !== undefined && { notes })
        };
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select("-password");
        
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        
        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "User updated successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update user."
        });
    }
};

/**
 * Approve instructor application
 * @route PUT /api/admin/approve-instructor/:id
 * @access Admin only
 */
export const approveInstructor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        
        user.role = "instructor";
        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "User approved as instructor."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to approve instructor."
        });
    }
};

/**
 * Get all user feedback
 * @route GET /api/admin/feedback
 * @access Admin only
 */
export const getAllFeedback = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Aggregate feedback from all users
        const feedback = await User.aggregate([
            { $unwind: "$feedback" },
            { $sort: { "feedback.date": -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    userName: "$name",
                    content: "$feedback.content",
                    date: "$feedback.date"
                }
            }
        ]);
        
        // Get total count for pagination
        const totalFeedback = await User.aggregate([
            { $unwind: "$feedback" },
            { $count: "total" }
        ]);
        
        const total = totalFeedback.length > 0 ? totalFeedback[0].total : 0;
        
        return res.status(200).json({
            success: true,
            feedback,
            pagination: {
                totalFeedback: total,
                totalPages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch feedback."
        });
    }
};

/**
 * Send bulk message to users
 * @route POST /api/admin/send-message
 * @access Admin only
 */
export const sendBulkMessage = async (req, res) => {
    try {
        const { 
            recipients, // array of user IDs or filter criteria
            subject,
            message,
            isGlobal // if true, send to all users
        } = req.body;
        
        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Subject and message are required."
            });
        }
        
        // TODO: Implement actual messaging logic with Socket.IO
        // This is just a placeholder for the API structure
        
        return res.status(200).json({
            success: true,
            message: "Message sent successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to send message."
        });
    }
};