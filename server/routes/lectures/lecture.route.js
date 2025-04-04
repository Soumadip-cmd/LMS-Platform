import express from 'express';
import {
    createLecture,
    getCourseLectures,
    getLectureById,
    updateLecture,
    deleteLecture,
    addLectureAttachment,
    removeLectureAttachment
} from '../../controller/lecture/lecture.controller.js';
import { isAuthenticated, isInstructor, isAdmin, isInstructorOrAdmin } from '../../middlewares/isAuthenticated.js';
import { upload } from '../../middlewares/multer.js';

const lectureRouter = express.Router();

// All lecture routes require authentication
lectureRouter.use(isAuthenticated);

// Routes accessible to students, instructors, and admins
lectureRouter.get('/course/:courseId', getCourseLectures);
lectureRouter.get('/:id', getLectureById);

// Routes for both instructors and admins
lectureRouter.post('/', isInstructorOrAdmin, upload.single('video'), createLecture);
lectureRouter.put('/:id', isInstructorOrAdmin, upload.single('video'), updateLecture);
lectureRouter.delete('/:id', isInstructorOrAdmin, deleteLecture);

// Lecture attachment routes for both instructors and admins
lectureRouter.post('/:id/attachments', isInstructorOrAdmin, upload.single('file'), addLectureAttachment);
lectureRouter.delete('/:id/attachments/:attachmentId', isInstructorOrAdmin, removeLectureAttachment);

export default lectureRouter;