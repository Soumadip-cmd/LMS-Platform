import { User } from "../../models/user.model.js";
import { Course } from "../../models/course.model.js";
import { CourseProgress } from "../../models/courseprogress.model.js";
import mongoose from "mongoose";

/**
 * Get admin dashboard statistics
 * @route GET /api/admin/dashboard
 * @access Admin only
 */
export const getDashboardStats = async (req, res) => {
    try {
        // Get current date and previous month date for comparison
        const currentDate = new Date();
        const previousMonthDate = new Date();
        previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

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

        // Get new sign-ups in the previous 30 days for trend calculation
        const previousMonthSignUps = await User.countDocuments({
            createdAt: {
                $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
        });

        // Calculate user growth trend
        const userGrowthTrend = previousMonthSignUps > 0
            ? Math.round(((newSignUps - previousMonthSignUps) / previousMonthSignUps) * 100)
            : 100;

        // Get course statistics
        const totalCourses = await Course.countDocuments();
        const activeCourses = await Course.countDocuments({ status: "published" });

        // Get top performing courses
        const topCourses = await Course.find()
            .sort({ "rating.average": -1, "enrolledStudents.length": -1 })
            .limit(5)
            .select("title rating.average enrolledStudents price thumbnailUrl")
            .populate("language", "name");

        // Calculate total revenue
        const totalRevenue = await User.aggregate([
            { $unwind: "$purchaseHistory" },
            { $group: { _id: null, total: { $sum: "$purchaseHistory.amount" } } }
        ]);

        // Get previous month revenue for trend calculation
        const previousMonthRevenue = await User.aggregate([
            {
                $unwind: "$purchaseHistory"
            },
            {
                $match: {
                    "purchaseHistory.date": {
                        $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                        $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$purchaseHistory.amount" }
                }
            }
        ]);

        // Calculate revenue trend
        const currentMonthRevenue = await User.aggregate([
            {
                $unwind: "$purchaseHistory"
            },
            {
                $match: {
                    "purchaseHistory.date": {
                        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$purchaseHistory.amount" }
                }
            }
        ]);

        const currentMonthRevenueValue = currentMonthRevenue.length > 0 ? currentMonthRevenue[0].total : 0;
        const previousMonthRevenueValue = previousMonthRevenue.length > 0 ? previousMonthRevenue[0].total : 0;

        const revenueTrend = previousMonthRevenueValue > 0
            ? Math.round(((currentMonthRevenueValue - previousMonthRevenueValue) / previousMonthRevenueValue) * 100)
            : 100;

        // Get average session time
        const averageSessionTime = await CourseProgress.aggregate([
            { $unwind: "$studySessions" },
            { $group: { _id: null, avgDuration: { $avg: "$studySessions.duration" } } }
        ]);

        // Get previous month average session time for trend calculation
        const previousMonthSessionTime = await CourseProgress.aggregate([
            { $unwind: "$studySessions" },
            {
                $match: {
                    "studySessions.startTime": {
                        $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                        $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                }
            },
            { $group: { _id: null, avgDuration: { $avg: "$studySessions.duration" } } }
        ]);

        const currentAvgSession = averageSessionTime.length > 0 ? Math.round(averageSessionTime[0].avgDuration / 60) : 0;
        const previousAvgSession = previousMonthSessionTime.length > 0 ? Math.round(previousMonthSessionTime[0].avgDuration / 60) : 0;

        const sessionTimeTrend = previousAvgSession > 0
            ? Math.round(((currentAvgSession - previousAvgSession) / previousAvgSession) * 100)
            : 0;

        // Get course completion rate
        const completedCourses = await CourseProgress.countDocuments({ completed: true });
        const totalEnrollments = await User.aggregate([
            { $project: { enrollmentCount: { $size: "$enrolledCourses" } } },
            { $group: { _id: null, total: { $sum: "$enrollmentCount" } } }
        ]);

        const completionRate = totalEnrollments.length > 0 && totalEnrollments[0].total > 0
            ? Math.round((completedCourses / totalEnrollments[0].total) * 100)
            : 0;

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

        // Get daily active users
        const dailyActiveUsers = await User.countDocuments({
            lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        // Get previous day active users for trend calculation
        const previousDayActiveUsers = await User.countDocuments({
            lastActive: {
                $gte: new Date(Date.now() - 48 * 60 * 60 * 1000),
                $lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
        });

        const dailyUsersTrend = previousDayActiveUsers > 0
            ? Math.round(((dailyActiveUsers - previousDayActiveUsers) / previousDayActiveUsers) * 100)
            : 100;

        // Get support ticket statistics
        // This is a placeholder - you would need to implement a support ticket model
        const supportStats = {
            totalTickets: 143,
            openTickets: 44,
            resolvedTickets: 32
        };

        return res.status(200).json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    instructors: instructorCount,
                    newSignUps,
                    userGrowthTrend,
                    dailyActiveUsers,
                    dailyUsersTrend
                },
                courses: {
                    total: totalCourses,
                    active: activeCourses,
                    topPerforming: topCourses,
                    completionRate,
                    averageSessionTime: currentAvgSession,
                    sessionTimeTrend
                },
                revenue: {
                    total: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
                    trend: revenueTrend,
                    currentMonth: currentMonthRevenueValue
                },
                languages: languageDistribution,
                support: supportStats
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

/**
 * Get student statistics
 * @route GET /api/admin/student-stats
 * @access Admin only
 */
export const getStudentStats = async (req, res) => {
    try {
        // Get total students
        const totalStudents = await User.countDocuments({ role: "student" });

        // Get active students per day
        const activeStudentsPerDay = await User.countDocuments({
            role: "student",
            lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        // Get average rating from course reviews
        const averageRating = await Course.aggregate([
            { $unwind: "$rating.reviews" },
            { $group: { _id: null, avgRating: { $avg: "$rating.reviews.rating" } } }
        ]);

        return res.status(200).json({
            success: true,
            stats: {
                totalStudents,
                activeStudentsPerDay,
                averageRating: averageRating.length > 0 ?
                    parseFloat(averageRating[0].avgRating.toFixed(1)) : 0
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student statistics."
        });
    }
};

/**
 * Get course analytics
 * @route GET /api/admin/course-analytics
 * @access Admin only
 */
export const getCourseAnalytics = async (req, res) => {
    try {
        // Get total courses
        const totalCourses = await Course.countDocuments();

        // Get active courses per day (courses accessed in the last 24 hours)
        const activeCourseIds = await CourseProgress.distinct("courseId", {
            lastAccessedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        const activeCoursesPerDay = activeCourseIds.length;

        // Get average course rating
        const averageRating = await Course.aggregate([
            { $match: { "rating.count": { $gt: 0 } } },
            { $group: { _id: null, avgRating: { $avg: "$rating.average" } } }
        ]);

        return res.status(200).json({
            success: true,
            stats: {
                totalCourses,
                activeCoursesPerDay,
                averageRating: averageRating.length > 0 ?
                    parseFloat(averageRating[0].avgRating.toFixed(1)) : 0
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch course analytics."
        });
    }
};

/**
 * Get support insights
 * @route GET /api/admin/support-insights
 * @access Admin only
 */
export const getSupportInsights = async (req, res) => {
    try {
        // This is a placeholder - you would need to implement a support ticket model
        // For now, returning mock data
        const supportStats = {
            totalTickets: 143,
            openTickets: 44,
            resolvedTickets: 32
        };

        return res.status(200).json({
            success: true,
            stats: supportStats
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch support insights."
        });
    }
};

/**
 * Get top running courses
 * @route GET /api/admin/top-courses
 * @access Admin only
 */
export const getTopCourses = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Get top courses by enrollment and revenue
        const topCourses = await Course.find()
            .sort({ "enrolledStudents.length": -1 })
            .limit(parseInt(limit))
            .select("title enrolledStudents price")
            .lean();

        // Calculate revenue for each course
        const coursesWithRevenue = topCourses.map(course => {
            const enrolledCount = course.enrolledStudents ? course.enrolledStudents.length : 0;
            const revenue = enrolledCount * course.price;

            return {
                id: course._id,
                title: course.title,
                enrolled: `${enrolledCount} enrolled`,
                revenue: `${revenue}$`
            };
        });

        return res.status(200).json({
            success: true,
            courses: coursesWithRevenue
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch top courses."
        });
    }
};