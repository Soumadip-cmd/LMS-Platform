import express from 'express';
import {
  createCourse,
  searchCourses,
  getPublishedCourses,
  getInstructorCourses,
  getCourseById,
  updateCourse,
  addCourseMaterial,
  removeCourseMaterial,
  updateCourseStatus,
  deleteCourse,
  getAllCoursesAdmin,
  getTopCourses,
  getFeaturedCourses
} from '../../controller/course/course.controller.js';
import { isAuthenticated, isAdmin, isInstructorOrAdmin } from "../../middlewares/isAuthenticated.js";
import { upload } from '../../middlewares/multer.js';

const courseRouter = express.Router();

// Public routes
courseRouter.get('/search', searchCourses);
courseRouter.get('/published', getPublishedCourses);
courseRouter.get('/top', getTopCourses);          
courseRouter.get('/featured', getFeaturedCourses);
courseRouter.get('/:courseId', getCourseById);    

// Protected routes (require authentication)
courseRouter.use(isAuthenticated);

// Routes for both instructors and admins
courseRouter.post('/create', isInstructorOrAdmin, upload.single('thumbnail'), createCourse);
courseRouter.put('/:courseId/update', isInstructorOrAdmin, upload.single('thumbnail'), updateCourse);
courseRouter.post('/:courseId/material', isInstructorOrAdmin, upload.single('file'), addCourseMaterial);
courseRouter.delete('/:courseId/material/:materialId', isInstructorOrAdmin, removeCourseMaterial);
courseRouter.patch('/:courseId/status', isInstructorOrAdmin, updateCourseStatus);

// Get routes for courses - this needs to come after the authentication middleware
courseRouter.get('/instructor/courses', isInstructorOrAdmin, getInstructorCourses);

// Admin-only routes
courseRouter.get('/admin/all-courses', isAdmin, getAllCoursesAdmin);
courseRouter.delete('/:courseId', isAdmin, deleteCourse);

export default courseRouter;