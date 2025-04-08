import express from 'express';
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import { 
  getStudyTimeStats,
  getAllStudySessions,
  recordStudyTime,
  getStudyTimeSummary
} from "../../controller/study-sesesion/study-session.controller.js";

const studySessionRouter = express.Router();

// All routes require authentication
studySessionRouter.use(isAuthenticated);

// Get study time summary for dashboard
studySessionRouter.get('/summary', getStudyTimeSummary);

// Get all study sessions for all courses
studySessionRouter.get('/all/study', getAllStudySessions);

// Get study time stats for a specific course
studySessionRouter.get('/stats-study/:courseId', getStudyTimeStats);

// Manually record study time
studySessionRouter.post('/record-study/:courseId', recordStudyTime);

export default studySessionRouter;