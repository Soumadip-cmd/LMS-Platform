import express from "express";
import {
    getDashboardStats,
    getAllUsers,
    getUserById,
    updateUserById,
    approveInstructor,
    getAllFeedback,
    sendBulkMessage,
    getStudentStats,
    getCourseAnalytics,
    getSupportInsights,
    getTopCourses
} from "../../controller/admin/admin.controller.js";
import { isAuthenticated, isAdmin } from "../../middlewares/isAuthenticated.js";

const adminRouter = express.Router();

// Apply admin authentication to all routes
adminRouter.use(isAuthenticated, isAdmin);

// Admin dashboard
adminRouter.get('/dashboard', getDashboardStats);

// Dashboard component-specific endpoints
adminRouter.get('/student-stats', getStudentStats);
adminRouter.get('/course-analytics', getCourseAnalytics);
adminRouter.get('/support-insights', getSupportInsights);
adminRouter.get('/top-courses', getTopCourses);

// User management routes
adminRouter.get('/users', getAllUsers);
adminRouter.get('/users/:id', getUserById);
adminRouter.put('/users/:id', updateUserById);
adminRouter.put('/approve-instructor/:id', approveInstructor);

// Feedback routes
adminRouter.get('/feedback', getAllFeedback);

// Messaging routes
adminRouter.post('/send-message', sendBulkMessage);

export default adminRouter;