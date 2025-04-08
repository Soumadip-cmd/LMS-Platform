import express from 'express';
import {
    getAllCoursesProgress,
    getDashboardStats,
    getCourseProgress,
    updateLectureProgress,
    markAsCompleted,
    markAsIncomplete,
    resetCourseProgress
} from '../../controller/course/courseProgress.controller.js';
import { isAuthenticated, isAdmin, isInstructorOrAdmin, isStudent } from "../../middlewares/isAuthenticated.js";

const courseProgressRouter = express.Router();

// All routes require authentication
courseProgressRouter.use(isAuthenticated);

// Dashboard routes
courseProgressRouter.get('/dashboard-stats', getDashboardStats);
courseProgressRouter.get('/courses-progress', getAllCoursesProgress);

// Course-specific progress routes
courseProgressRouter.get('/:courseId', getCourseProgress);
courseProgressRouter.put('/:courseId/:lectureId', updateLectureProgress);
courseProgressRouter.put('/:courseId/complete', markAsCompleted);
courseProgressRouter.put('/:courseId/incomplete', markAsIncomplete);
courseProgressRouter.delete('/reset/:courseId', resetCourseProgress);

export default courseProgressRouter;