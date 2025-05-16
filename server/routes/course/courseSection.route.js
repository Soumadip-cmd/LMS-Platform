import express from 'express';
import {
  createCourseSection,
  getCourseSections,
  updateCourseSection,
  deleteCourseSection
} from '../../controller/course/courseSection.controller.js';
import {
  addLessonToSection,
  addQuizToSection,
  addAssignmentToSection
} from '../../controller/course/sectionContent.controller.js';
import { addLiveLessonToSection } from '../../controller/course/liveLessonSection.controller.js';
import { isAuthenticated, isInstructorOrAdmin } from '../../middlewares/isAuthenticated.js';
import { upload } from '../../middlewares/multer.js';

const courseSectionRouter = express.Router();

// Get all sections for a course
courseSectionRouter.get('/:courseId/sections', getCourseSections);

// Protected routes
courseSectionRouter.use(isAuthenticated);

// Create a new section
courseSectionRouter.post('/:courseId/sections', isInstructorOrAdmin, createCourseSection);

// Update a section
courseSectionRouter.put('/:courseId/sections/:sectionId', isInstructorOrAdmin, updateCourseSection);

// Delete a section
courseSectionRouter.delete('/:courseId/sections/:sectionId', isInstructorOrAdmin, deleteCourseSection);

// Add content to sections
courseSectionRouter.post('/:courseId/sections/:sectionId/lessons', isInstructorOrAdmin, upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'videoFile', maxCount: 1 },
  { name: 'exerciseFiles', maxCount: 10 }
]), addLessonToSection);

courseSectionRouter.post('/:courseId/sections/:sectionId/quizzes', isInstructorOrAdmin, addQuizToSection);

courseSectionRouter.post('/:courseId/sections/:sectionId/assignments', isInstructorOrAdmin, upload.array('attachments', 10), addAssignmentToSection);

courseSectionRouter.post('/:courseId/sections/:sectionId/live-lessons', isInstructorOrAdmin, addLiveLessonToSection);

export default courseSectionRouter;
