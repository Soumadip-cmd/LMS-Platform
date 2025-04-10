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
} from "../controllers/mockTest.controller.js";
import { isAuthenticated, isInstructorOrAdmin, isAdmin } from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

// Apply authentication to all routes
router.use(isAuthenticated);

// Mock test management routes (Admin/Instructor only)
router.route("/")
  .post(
    isInstructorOrAdmin, 
    upload.single("thumbnail"), 
    createMockTest
  )
  .get(getAllMockTests);

router.route("/:testId")
  .get(getMockTestById)
  .patch(
    isInstructorOrAdmin, 
    upload.single("thumbnail"), 
    updateMockTest
  )
  .delete(isInstructorOrAdmin, deleteMockTest);

router.route("/:testId/publish")
  .patch(isInstructorOrAdmin, togglePublishStatus);

// Test attempt routes (All authenticated users)
router.route("/:testId/start")
  .post(startMockTestAttempt);

router.route("/attempts/:attemptId/submit")
  .post(submitMockTestAnswers);

router.route("/attempts/user")
  .get(getUserAttempts);

router.route("/attempts/user/:userId")
  .get(isAdmin, getUserAttempts);

router.route("/attempts/:attemptId")
  .get(getAttemptResults);

// Grading routes (Admin/Instructor only)
router.route("/attempts/:attemptId/grade")
  .patch(isInstructorOrAdmin, gradeManualReviewQuestions);

export default router;