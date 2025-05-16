import mongoose from "mongoose";
import { Quiz } from "../../models/quiz.model.js";
import { Course } from "../../models/course.model.js";
import { User } from "../../models/user.model.js";
import { uploadMedia, deleteMediaFromCloudinary } from "../../utils/cloudinary.js";

/**
 * Create a new quiz
 * @route POST /api/quizzes
 * @access Instructor only
 */
export const createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      lessonId,
      languageId,
      level,
      timeLimit,
      passingScore,
      allowRetake,
      maxRetakes,
      showAnswersAfterSubmission,
      randomizeQuestionOrder,
      tags
    } = req.body;

    const creatorId = req.id;

    // Validate required fields
    if (!title || !courseId || !languageId || !level) {
      return res.status(400).json({
        success: false,
        message: "Title, course, language, and level are required"
      });
    }

    // Check if course exists and user is authorized
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Ensure creator is instructor of the course or admin
    const user = await User.findById(creatorId);
    const isAuthorized = course.instructor.toString() === creatorId || user.role === "admin";

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You can only create quizzes for courses you instruct"
      });
    }

    // Create quiz object
    const quiz = new Quiz({
      title,
      description,
      course: courseId,
      ...(lessonId && { lesson: lessonId }),
      language: languageId,
      level,
      ...(timeLimit && { timeLimit }),
      ...(passingScore && { passingScore }),
      ...(allowRetake !== undefined && { allowRetake }),
      ...(maxRetakes && { maxRetakes }),
      ...(showAnswersAfterSubmission !== undefined && { showAnswersAfterSubmission }),
      ...(randomizeQuestionOrder !== undefined && { randomizeQuestionOrder }),
      ...(tags && { tags }),
      creator: creatorId,
      questions: [],
      status: "draft"
    });

    // Save quiz
    await quiz.save();

    return res.status(201).json({
      success: true,
      quiz,
      message: "Quiz created successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create quiz"
    });
  }
};

/**
 * Get all quizzes with filters
 * @route GET /api/quizzes
 * @access Public (for published quizzes) / Private (for all quizzes)
 */
export const getQuizzes = async (req, res) => {
  try {
    const {
      course,
      language,
      level,
      status,
      search,
      creator,
      isPublished,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = {};

    // For non-admin users, only show published quizzes unless they're the creator
    if (req.user && req.user.role !== "admin") {
      if (req.user._id.toString() === creator) {
        // Creator can see all their quizzes
        query.creator = req.user._id;
      } else {
        // Others can only see published quizzes
        query.status = "published";
      }
    } else if (!req.user) {
      // Unauthenticated users can only see published quizzes
      query.status = "published";
    } else if (status) {
      // Admin can filter by status
      query.status = status;
    }

    // Apply other filters
    if (course) query.course = course;
    if (language) query.language = language;
    if (level) query.level = level;
    if (creator && req.user && req.user.role === "admin") {
      query.creator = creator;
    }
    if (isPublished !== undefined) {
      query.isPublished = isPublished === "true";
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const quizzes = await Quiz.find(query)
      .populate("course", "title")
      .populate("language", "name")
      .populate("creator", "name")
      .select("-questions -attempts")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const totalQuizzes = await Quiz.countDocuments(query);

    return res.status(200).json({
      success: true,
      quizzes,
      pagination: {
        totalQuizzes,
        totalPages: Math.ceil(totalQuizzes / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes"
    });
  }
};

/**
 * Get a single quiz by ID
 * @route GET /api/quizzes/:id
 * @access Public (for published quizzes) / Private (for all quizzes)
 */
export const getQuizById = async (req, res) => {
  try {
    const quizId = req.params.id;

    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID"
      });
    }

    // Find quiz with populated fields
    const quiz = await Quiz.findById(quizId)
      .populate("course", "title")
      .populate("language", "name")
      .populate("creator", "name")
      .populate("lesson", "lectureTitle");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    // Check access permissions
    const isAdmin = req.user && req.user.role === "admin";
    const isCreator = req.user && req.user._id.toString() === quiz.creator._id.toString();
    const isPublished = quiz.status === "published";

    if (!isPublished && !isAdmin && !isCreator) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this quiz"
      });
    }

    return res.status(200).json({
      success: true,
      quiz
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz"
    });
  }
};

/**
 * Update quiz details
 * @route PUT /api/quizzes/:id
 * @access Private (Creator or Admin only)
 */
export const updateQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const userId = req.id;
    const {
      title,
      description,
      timeLimit,
      passingScore,
      allowRetake,
      maxRetakes,
      showAnswersAfterSubmission,
      randomizeQuestionOrder,
      tags,
      status
    } = req.body;

    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID"
      });
    }

    // Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    // Check if user is authorized
    const user = await User.findById(userId);
    const isAdmin = user.role === "admin";
    const isCreator = quiz.creator.toString() === userId;

    if (!isAdmin && !isCreator) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this quiz"
      });
    }

    // Create update object
    const updateData = {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(timeLimit && { timeLimit }),
      ...(passingScore && { passingScore }),
      ...(allowRetake !== undefined && { allowRetake }),
      ...(maxRetakes && { maxRetakes }),
      ...(showAnswersAfterSubmission !== undefined && { showAnswersAfterSubmission }),
      ...(randomizeQuestionOrder !== undefined && { randomizeQuestionOrder }),
      ...(tags && { tags })
    };

    // Only allow status updates if there are questions or if setting to draft
    if (status) {
      if (status === "published" && (!quiz.questions || quiz.questions.length === 0)) {
        return res.status(400).json({
          success: false,
          message: "Cannot publish quiz without questions"
        });
      }
      updateData.status = status;
    }

    // Update quiz
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      updateData,
      { new: true }
    ).populate("course", "title")
     .populate("language", "name")
     .populate("creator", "name");

    return res.status(200).json({
      success: true,
      quiz: updatedQuiz,
      message: "Quiz updated successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update quiz"
    });
  }
};

/**
 * Add question to quiz
 * @route POST /api/quizzes/:id/questions
 * @access Private (Creator or Admin only)
 */
export const addQuestion = async (req, res) => {
  try {
    const quizId = req.params.id;
    const userId = req.id;
    const {
      questionText,
      questionType,
      options,
      correctAnswer,
      explanation,
      difficulty,
      points
    } = req.body;

    const mediaFile = req.file;

    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID"
      });
    }

    // Validate required fields
    if (!questionText || !questionType) {
      return res.status(400).json({
        success: false,
        message: "Question text and type are required"
      });
    }

    // Validate question type
    const validTypes = ["MultipleChoice", "TrueFalse", "FillInTheBlank", "ShortAnswer"];
    if (!validTypes.includes(questionType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question type"
      });
    }

    // Validate options based on question type
    if (questionType === "MultipleChoice" && (!options || options.length < 2)) {
      return res.status(400).json({
        success: false,
        message: "Multiple choice questions require at least 2 options"
      });
    }

    if (questionType === "TrueFalse" && (!options || options.length !== 2)) {
      return res.status(400).json({
        success: false,
        message: "True/False questions require exactly 2 options"
      });
    }

    // Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    // Check if user is authorized
    const user = await User.findById(userId);
    const isAdmin = user.role === "admin";
    const isCreator = quiz.creator.toString() === userId;

    if (!isAdmin && !isCreator) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this quiz"
      });
    }

    // Handle media upload if provided
    let mediaUrl = "";
    let mediaType = "none";

    if (mediaFile) {
      const cloudResponse = await uploadMedia(mediaFile.path);
      mediaUrl = cloudResponse.secure_url;

      // Determine media type based on file mime type
      if (mediaFile.mimetype.startsWith("image")) {
        mediaType = "image";
      } else if (mediaFile.mimetype.startsWith("audio")) {
        mediaType = "audio";
      } else if (mediaFile.mimetype.startsWith("video")) {
        mediaType = "video";
      }
    }

    // Create question object
    const question = {
      questionText,
      questionType,
      ...(options && { options }),
      ...(correctAnswer && { correctAnswer }),
      ...(explanation && { explanation }),
      ...(difficulty && { difficulty }),
      ...(points && { points }),
      ...(mediaUrl && { mediaUrl, mediaType })
    };

    // Add question to quiz
    quiz.questions.push(question);
    await quiz.save();

    return res.status(200).json({
      success: true,
      question: quiz.questions[quiz.questions.length - 1],
      message: "Question added successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add question"
    });
  }
};

/**
 * Update a question
 * @route PUT /api/quizzes/:id/questions/:questionId
 * @access Private (Creator or Admin only)
 */
export const updateQuestion = async (req, res) => {
  try {
    const { id: quizId, questionId } = req.params;
    const userId = req.id;
    const {
      questionText,
      questionType,
      options,
      correctAnswer,
      explanation,
      difficulty,
      points,
      removeMedia
    } = req.body;

    const mediaFile = req.file;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID"
      });
    }

    // Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    // Check if user is authorized
    const user = await User.findById(userId);
    const isAdmin = user.role === "admin";
    const isCreator = quiz.creator.toString() === userId;

    if (!isAdmin && !isCreator) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this quiz"
      });
    }

    // Find question
    const question = quiz.questions.id(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    // Handle media
    if (removeMedia && question.mediaUrl) {
      // Extract public ID from the URL
      const publicId = question.mediaUrl.split('/').pop().split('.')[0];
      await deleteMediaFromCloudinary(publicId);
      question.mediaUrl = '';
      question.mediaType = 'none';
    }

    if (mediaFile) {
      // Delete old media if exists
      if (question.mediaUrl) {
        const publicId = question.mediaUrl.split('/').pop().split('.')[0];
        await deleteMediaFromCloudinary(publicId);
      }

      // Upload new media
      const cloudResponse = await uploadMedia(mediaFile.path);
      question.mediaUrl = cloudResponse.secure_url;

      // Determine media type based on file mime type
      if (mediaFile.mimetype.startsWith("image")) {
        question.mediaType = "image";
      } else if (mediaFile.mimetype.startsWith("audio")) {
        question.mediaType = "audio";
      } else if (mediaFile.mimetype.startsWith("video")) {
        question.mediaType = "video";
      }
    }

    // Update question fields
    if (questionText) question.questionText = questionText;
    if (questionType) question.questionType = questionType;
    if (options) question.options = options;
    if (correctAnswer !== undefined) question.correctAnswer = correctAnswer;
    if (explanation !== undefined) question.explanation = explanation;
    if (difficulty) question.difficulty = difficulty;
    if (points) question.points = points;

    // Save quiz
    await quiz.save();

    return res.status(200).json({
      success: true,
      question,
      message: "Question updated successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update question"
    });
  }
};

/**
 * Remove a question from quiz
 * @route DELETE /api/quizzes/:id/questions/:questionId
 * @access Private (Creator or Admin only)
 */
export const removeQuestion = async (req, res) => {
  try {
    const { id: quizId, questionId } = req.params;
    const userId = req.id;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID"
      });
    }

    // Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    // Check if user is authorized
    const user = await User.findById(userId);
    const isAdmin = user.role === "admin";
    const isCreator = quiz.creator.toString() === userId;

    if (!isAdmin && !isCreator) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this quiz"
      });
    }

    // Find question
    const questionIndex = quiz.questions.findIndex(q => q._id.toString() === questionId);
    if (questionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    // Remove question
    quiz.questions.splice(questionIndex, 1);
    await quiz.save();

    return res.status(200).json({
      success: true,
      message: "Question removed successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove question"
    });
  }
};

/**
 * Delete a quiz
 * @route DELETE /api/quizzes/:id
 * @access Private (Creator or Admin only)
 */
export const deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const userId = req.id;

    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID"
      });
    }

    // Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    // Check if user is authorized
    const user = await User.findById(userId);
    const isAdmin = user.role === "admin";
    const isCreator = quiz.creator.toString() === userId;

    if (!isAdmin && !isCreator) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this quiz"
      });
    }

    // Delete media files if any
    for (const question of quiz.questions) {
      if (question.mediaUrl) {
        const publicId = question.mediaUrl.split('/').pop().split('.')[0];
        await deleteMediaFromCloudinary(publicId);
      }
    }

    // Delete quiz
    await Quiz.findByIdAndDelete(quizId);

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete quiz"
    });
  }
};

/**
 * Start a quiz attempt
 * @route POST /api/quizzes/:id/attempt
 * @access Private
 */
export const startQuizAttempt = async (req, res) => {
  try {
    const quizId = req.params.id;
    const userId = req.id;

    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID"
      });
    }

    // Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    // Check if quiz is published
    if (quiz.status !== "published") {
      return res.status(403).json({
        success: false,
        message: "This quiz is not available"
      });
    }

    // Check if user has exceeded max retakes
    const userAttempts = quiz.attempts.filter(attempt =>
      attempt.user.toString() === userId
    );

    if (!quiz.allowRetake && userAttempts.length > 0) {
      return res.status(403).json({
        success: false,
        message: "Retakes are not allowed for this quiz"
      });
    }

    if (quiz.maxRetakes !== 0 && userAttempts.length >= quiz.maxRetakes) {
      return res.status(403).json({
        success: false,
        message: `Maximum number of attempts (${quiz.maxRetakes}) reached`
      });
    }

    // Prepare quiz for user (may randomize questions if enabled)
    let quizQuestions = quiz.questions;

    if (quiz.randomizeQuestionOrder) {
      quizQuestions = [...quiz.questions].sort(() => Math.random() - 0.5);
    }

    // Return quiz with questions but without correct answers
    const sanitizedQuestions = quizQuestions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.questionType === "MultipleChoice" || q.questionType === "TrueFalse"
        ? q.options.map(o => ({ _id: o._id, text: o.text }))
        : undefined,
      difficulty: q.difficulty,
      points: q.points,
      mediaUrl: q.mediaUrl,
      mediaType: q.mediaType
    }));

    return res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        questions: sanitizedQuestions,
        startTime: new Date()
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to start quiz attempt"
    });
  }
};

/**
 * Submit quiz answers
 * @route POST /api/quizzes/:id/submit
 * @access Private
 */
export const submitQuizAnswers = async (req, res) => {
  try {
    const quizId = req.params.id;
    const userId = req.id;
    const { answers, startTime } = req.body;

    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID"
      });
    }

    // Validate required fields
    if (!answers || !Array.isArray(answers) || !startTime) {
      return res.status(400).json({
        success: false,
        message: "Answers array and start time are required"
      });
    }

    // Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    // Check if quiz is published
    if (quiz.status !== "published") {
      return res.status(403).json({
        success: false,
        message: "This quiz is not available for submission"
      });
    }

    // Calculate time taken
    const endTime = new Date();
    const startTimeDate = new Date(startTime);
    const timeTakenMs = endTime - startTimeDate;
    const timeTakenMinutes = Math.round(timeTakenMs / 60000);

    // Check if time limit exceeded
    if (quiz.timeLimit > 0 && timeTakenMinutes > quiz.timeLimit) {
      return res.status(400).json({
        success: false,
        message: "Time limit exceeded"
      });
    }

    // Grade answers
    let totalPoints = 0;
    let earnedPoints = 0;
    const gradedAnswers = [];

    for (const answer of answers) {
      const { questionId, userAnswer } = answer;

      // Find the question in the quiz
      const question = quiz.questions.id(questionId);
      if (!question) continue;

      // Add to total points
      totalPoints += question.points || 1;

      // Grade based on question type
      let isCorrect = false;
      let score = 0;

      if (question.questionType === "MultipleChoice" || question.questionType === "TrueFalse") {
        // For multiple choice, check if selected option is correct
        const selectedOption = question.options.id(userAnswer);
        isCorrect = selectedOption && selectedOption.isCorrect;
      } else if (question.questionType === "FillInTheBlank") {
        // For fill in the blank, check exact match
        isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      } else if (question.questionType === "ShortAnswer") {
        // For short answer, check if answer contains key phrases
        const userAnswerLower = userAnswer.toLowerCase().trim();
        const correctAnswerLower = question.correctAnswer.toLowerCase().trim();
        isCorrect = userAnswerLower.includes(correctAnswerLower) || correctAnswerLower.includes(userAnswerLower);
      }

      // Calculate score
      score = isCorrect ? (question.points || 1) : 0;
      earnedPoints += score;

      // Add to graded answers
      gradedAnswers.push({
        questionId,
        userAnswer,
        isCorrect,
        score,
        correctAnswer: quiz.showAnswersAfterSubmission ? question.correctAnswer : undefined,
        explanation: quiz.showAnswersAfterSubmission ? question.explanation : undefined
      });
    }

    // Calculate percentage score
    const percentageScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    // Determine if passed
    const passed = percentageScore >= quiz.passingScore;

    // Create attempt record
    const attempt = {
      user: userId,
      date: endTime,
      timeTaken: timeTakenMinutes,
      answers: gradedAnswers,
      score: {
        earned: earnedPoints,
        total: totalPoints,
        percentage: percentageScore
      },
      passed
    };

    // Add attempt to quiz
    quiz.attempts.push(attempt);
    await quiz.save();

    return res.status(200).json({
      success: true,
      result: {
        score: {
          earned: earnedPoints,
          total: totalPoints,
          percentage: percentageScore
        },
        passed,
        timeTaken: timeTakenMinutes,
        answers: gradedAnswers,
        showAnswers: quiz.showAnswersAfterSubmission
      },
      message: passed ? "Congratulations! You passed the quiz." : "You did not pass the quiz."
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz answers"
    });
  }
};

/**
 * Get quiz results
 * @route GET /api/quizzes/:id/results
 * @access Private
 */
export const getQuizResults = async (req, res) => {
  try {
    const quizId = req.params.id;
    const userId = req.id;

    // Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID"
      });
    }

    // Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    // Find user's attempts
    const userAttempts = quiz.attempts.filter(attempt =>
      attempt.user.toString() === userId
    );

    if (userAttempts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attempts found for this quiz"
      });
    }

    // Sort attempts by date (newest first)
    userAttempts.sort((a, b) => b.date - a.date);

    // Get latest attempt
    const latestAttempt = userAttempts[0];

    // Get best attempt (highest score)
    const bestAttempt = [...userAttempts].sort((a, b) =>
      b.score.percentage - a.score.percentage
    )[0];

    return res.status(200).json({
      success: true,
      results: {
        totalAttempts: userAttempts.length,
        latestAttempt: {
          date: latestAttempt.date,
          score: latestAttempt.score,
          passed: latestAttempt.passed,
          timeTaken: latestAttempt.timeTaken
        },
        bestAttempt: {
          date: bestAttempt.date,
          score: bestAttempt.score,
          passed: bestAttempt.passed,
          timeTaken: bestAttempt.timeTaken
        },
        canRetake: quiz.allowRetake && (quiz.maxRetakes === 0 || userAttempts.length < quiz.maxRetakes)
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz results"
    });
  }
};

/**
 * Generate a quiz from content
 * @route POST /api/quizzes/generate
 * @access Private (Instructor or Admin only)
 */
export const generateQuiz = async (req, res) => {
  try {
    const { content, courseId, title, description, numQuestions = 5, level = "Beginner" } = req.body;
    const userId = req.id;

    // Validate required fields
    if (!content || !courseId || !title) {
      return res.status(400).json({
        success: false,
        message: "Content, course ID, and title are required"
      });
    }

    // Check if course exists and user is authorized
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Ensure creator is instructor of the course or admin
    const user = await User.findById(userId);
    const isAuthorized = course.instructor.toString() === userId || user.role === "admin";

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You can only generate quizzes for courses you instruct"
      });
    }

    // TODO: Implement AI-based quiz generation here
    // For now, return a placeholder response
    return res.status(501).json({
      success: false,
      message: "Quiz generation feature is not yet implemented"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate quiz"
    });
  }
};