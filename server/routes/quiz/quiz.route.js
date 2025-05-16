import express from 'express';
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  updateQuestion,
  removeQuestion,
  startQuizAttempt,
  submitQuizAnswers,
  getQuizResults,
  generateQuiz
} from '../../controller/quiz/quiz.controller.js';
import { isAuthenticated, isInstructorOrAdmin } from '../../middlewares/isAuthenticated.js';
import { upload } from '../../middlewares/multer.js';

const quizRouter = express.Router();

// Apply authentication to all routes
quizRouter.use(isAuthenticated);

// GET all quizzes (with filters)
quizRouter.get('/', getQuizzes);

// GET quiz by ID
quizRouter.get('/:id', getQuizById);

// POST create a new quiz
quizRouter.post('/create', isInstructorOrAdmin, createQuiz);

// PUT update quiz
quizRouter.put('/:id', isInstructorOrAdmin, updateQuiz);

// DELETE quiz
quizRouter.delete('/:id', isInstructorOrAdmin, deleteQuiz);

// POST add question to quiz
quizRouter.post('/:id/questions', isInstructorOrAdmin, upload.single('media'), addQuestion);

// PUT update question
quizRouter.put('/:id/questions/:questionId', isInstructorOrAdmin, upload.single('media'), updateQuestion);

// DELETE remove question from quiz
quizRouter.delete('/:id/questions/:questionId', isInstructorOrAdmin, removeQuestion);

// POST start quiz attempt
quizRouter.post('/:id/attempt', startQuizAttempt);

// POST submit quiz answers
quizRouter.post('/:id/submit', submitQuizAnswers);

// GET quiz results
quizRouter.get('/:id/results', getQuizResults);

// POST generate quiz from content
quizRouter.post('/generate', isInstructorOrAdmin, generateQuiz);

export default quizRouter;