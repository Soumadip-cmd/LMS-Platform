import express from 'express';
import {
    createLecture,
    getCourseLectures,
    getLectureById,
    updateLecture,
    deleteLecture,
    addLectureAttachment,
    updateLectureAttachment,
    removeLectureAttachment
} from '../../controller/lecture/lecture.controller.js';
import { isAuthenticated,  isInstructorOrAdmin } from '../../middlewares/isAuthenticated.js';
import { upload ,handleMulterError} from '../../middlewares/multer.js';

const lectureRouter = express.Router();

// All lecture routes require authentication
lectureRouter.use(isAuthenticated);

// Routes accessible to students, instructors, and admins
lectureRouter.get('/course/:courseId', getCourseLectures);
lectureRouter.get('/:id', getLectureById);

// Routes for both instructors and admins
lectureRouter.post('/create', isInstructorOrAdmin, upload.single('videoFile'),handleMulterError, createLecture);
lectureRouter.put('/:id/update', isInstructorOrAdmin, upload.single('videoFile'),handleMulterError, updateLecture);
lectureRouter.delete('/:id/delete', isInstructorOrAdmin, deleteLecture);

// Lecture attachment routes for both instructors and admins
lectureRouter.post('/:id/attachments', isInstructorOrAdmin, upload.single('file'),handleMulterError, addLectureAttachment);
lectureRouter.put(
    '/:id/attachments/:attachmentId',
    isAuthenticated,
    isInstructorOrAdmin,
    upload.single('file'),
    handleMulterError,
    updateLectureAttachment
  );
lectureRouter.delete('/:id/attachments/:attachmentId', isInstructorOrAdmin, removeLectureAttachment);

export default lectureRouter;