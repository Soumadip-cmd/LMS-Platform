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

// Middleware to debug user information
const debugUserMiddleware = (req, res, next) => {
  console.log("User info in request:", req.user);
  console.log("User ID:", req.user?.id);
  if (!req.user || !req.user.id) {
    console.error("User information is missing in the request");
  }
  next();
};

const Mockrouter = Router();

// Apply authentication to all routes
Mockrouter.use(isAuthenticated);

// GET all mock tests
Mockrouter.get("/all", getAllMockTests);

// POST create a new mock test
Mockrouter.post("/create", isAdmin, debugUserMiddleware, upload.single("thumbnail"), createMockTest);

// GET mock test by ID
Mockrouter.get("/:testId", getMockTestById);

// UPDATE mock test
Mockrouter.patch("/update/:testId", isInstructorOrAdmin, upload.single("thumbnail"), updateMockTest);

// DELETE mock test
Mockrouter.delete("/delete/:testId", isInstructorOrAdmin, deleteMockTest);

// PUBLISH/UNPUBLISH mock test
Mockrouter.patch("/:testId/publish", isInstructorOrAdmin, togglePublishStatus);

// START a mock test attempt
Mockrouter.post("/:testId/start", startMockTestAttempt);

// SUBMIT mock test answers
Mockrouter.post("/attempts/:attemptId/submit", submitMockTestAnswers);

// GET user's own attempts
Mockrouter.get("/attempts/user", getUserAttempts);

// GET another user's attempts (Admin only)
Mockrouter.get("/attempts/user/:userId", isAdmin, getUserAttempts);

// GET attempt results
Mockrouter.get("/attempts/:attemptId", getAttemptResults);

// GRADE manual review questions
Mockrouter.patch("/attempts/:attemptId/grade", isInstructorOrAdmin, gradeManualReviewQuestions);

export default Mockrouter;