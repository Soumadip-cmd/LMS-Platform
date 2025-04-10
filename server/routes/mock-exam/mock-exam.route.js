import { Router } from "express";
import {
  createMockTest,
  getAllMockTests,
  getMockTestById,
  updateMockTest,
  deleteMockTest,
  togglePublishStatus,
  startMockTestAttempt,
  submitMockTestAnswers,
  getUserAttempts,
  getAttemptResults,
  gradeManualReviewQuestions
} from "../../controller/mock-exam/mock-exam.controller.js";
import { isAuthenticated, isInstructorOrAdmin, isAdmin } from "../../middlewares/isAuthenticated.js";
import { upload } from "../../middlewares/multer.js";

const Mockrouter = Router();

// Apply authentication to all routes
Mockrouter.use(isAuthenticated);

// Mock test management routes (Admin/Instructor only)
Mockrouter.route("/")
  .post(
    isInstructorOrAdmin, 
    upload.single("thumbnail"), 
    createMockTest
  )
  .get(getAllMockTests);

Mockrouter.route("/:testId")
  .get(getMockTestById)
  .patch(
    isInstructorOrAdmin, 
    upload.single("thumbnail"), 
    updateMockTest
  )
  .delete(isInstructorOrAdmin, deleteMockTest);

Mockrouter.route("/:testId/publish")
  .patch(isInstructorOrAdmin, togglePublishStatus);

// Test attempt routes (All authenticated users)
Mockrouter.route("/:testId/start")
  .post(startMockTestAttempt);

Mockrouter.route("/attempts/:attemptId/submit")
  .post(submitMockTestAnswers);
Mockrouter.route("/attempts/user")
  .get(getUserAttempts);

Mockrouter.route("/attempts/user/:userId")
  .get(isAdmin, getUserAttempts);

Mockrouter.route("/attempts/:attemptId")
  .get(getAttemptResults);

// Grading routes (Admin/Instructor only)
Mockrouter.route("/attempts/:attemptId/grade")
  .patch(isInstructorOrAdmin, gradeManualReviewQuestions);

export default Mockrouter;