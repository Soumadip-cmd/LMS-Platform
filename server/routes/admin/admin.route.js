import express from "express";
import { 
    getDashboardStats, 
    getAllUsers, 
    getUserById,
    updateUserById,
    approveInstructor,
    getAllFeedback,
    sendBulkMessage
} from "../../controller/admin/admin.controller.js";
import { isAuthenticated, isAdmin } from "../../middlewares/isAuthenticated.js";

const adminRouter = express.Router();

// Apply admin authentication to all routes
adminRouter.use(isAuthenticated, isAdmin);

// Admin dashboard
adminRouter.get('/dashboard', getDashboardStats);

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