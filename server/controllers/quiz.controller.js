import mongoose from "mongoose";
import { Quiz } from "../models/quiz.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { Language } from "../models/language.model.js";
import { uploadMedia, deleteMediaFromCloudinary } from "../utils/cloudinary.js";

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
    if (!mongoose.Types.ObjectId.isValid(quizId) || !mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz or question ID"
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

    // Find question in quiz
    const question = quiz.questions.id(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found in this quiz"
      });
    }

    // Handle media changes
    let mediaUrl = question.mediaUrl;
    let mediaType = question.mediaType;

    // Remove existing media if requested
    if (removeMedia === true && question.mediaUrl) {
      // Extract public ID from URL
      const publicId = question.mediaUrl.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
      mediaUrl = "";
      mediaType = "none";
    }

    // Upload new media if provided
    if (mediaFile) {
      // Remove old media if exists
      if (question.mediaUrl) {
        const publicId = question.mediaUrl.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }

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

    // Update question fields
    if (questionText) question.questionText = questionText;
    if (questionType) question.questionType = questionType;
    if (options) question.options = options;
    if (correctAnswer !== undefined) question.correctAnswer = correctAnswer;
    if (explanation !== undefined) question.explanation = explanation;
    if (difficulty) question.difficulty = difficulty;
    if (points) question.points = points;
    
    question.mediaUrl = mediaUrl;
    question.mediaType = mediaType;

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
    if (!mongoose.Types.ObjectId.isValid(quizId) || !mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz or question ID"
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

    // Find question in quiz
    const question = quiz.questions.id(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found in this quiz"
      });
    }

    // Delete media if exists
    if (question.mediaUrl) {
      const publicId = question.mediaUrl.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    // Remove question
    quiz.questions.pull(questionId);
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
 * Submit a quiz attempt
 * @route POST /api/quizzes/:id/submit
 * @access Private
 */
// Continuing from the previous part of the submitQuizAttempt function
export const submitQuizAttempt = async (req, res) => {
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
          message: "Answers and start time are required"
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
  
      // Calculate time taken
      const startTimeDate = new Date(startTime);
      const endTimeDate = new Date();
      const timeTakenMinutes = (endTimeDate - startTimeDate) / (1000 * 60);
  
      // Check if time limit exceeded (if applicable)
      if (quiz.timeLimit > 0 && timeTakenMinutes > quiz.timeLimit) {
        return res.status(400).json({
          success: false,
          message: "Time limit exceeded"
        });
      }
  
      // Process answers and calculate score
      let totalPoints = 0;
      let earnedPoints = 0;
      const processedAnswers = [];
  
      // Process each answer
      for (const answer of answers) {
        const question = quiz.questions.id(answer.questionId);
        
        if (!question) continue;
        
        // Add to total possible points
        totalPoints += question.points;
        
        // Check if answer is correct
        const isCorrect = quiz.checkAnswer(answer.questionId, answer.userAnswer);
        const pointsEarned = isCorrect ? question.points : 0;
        earnedPoints += pointsEarned;
        
        // Add to processed answers
        processedAnswers.push({
          questionId: answer.questionId,
          userAnswer: answer.userAnswer,
          isCorrect,
          points: pointsEarned
        });
      }
  
      // Calculate percentage score
      const scorePercentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
      const passed = scorePercentage >= quiz.passingScore;
  
      // Create attempt record
      const attempt = {
        user: userId,
        score: scorePercentage,
        totalPoints,
        answers: processedAnswers,
        startTime: startTimeDate,
        endTime: endTimeDate,
        passed
      };
  
      // Add attempt to quiz
      quiz.attempts.push(attempt);
      await quiz.save();
  
      // Add quiz to user's exam history if passed
      if (passed) {
        await User.findByIdAndUpdate(userId, {
          $push: {
            examAttempts: {
              exam: quizId,
              score: scorePercentage,
              date: endTimeDate
            }
          }
        });
      }
  
      // Prepare response
      let response = {
        success: true,
        result: {
          score: scorePercentage,
          passed,
          timeTaken: timeTakenMinutes,
          totalQuestions: quiz.questions.length,
          answeredQuestions: answers.length,
          correctAnswers: processedAnswers.filter(a => a.isCorrect).length
        }
      };
  
      // Include answers and explanations if enabled
      if (quiz.showAnswersAfterSubmission) {
        const feedbackDetails = processedAnswers.map(answer => {
          const question = quiz.questions.id(answer.questionId);
          return {
            questionId: question._id,
            questionText: question.questionText,
            yourAnswer: answer.userAnswer,
            isCorrect: answer.isCorrect,
            correctAnswer: question.questionType === "MultipleChoice" || question.questionType === "TrueFalse" 
              ? question.options.find(o => o.isCorrect).text
              : question.correctAnswer,
            explanation: question.explanation,
            points: answer.points
          };
        });
        
        response.result.feedback = feedbackDetails;
      }
  
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to submit quiz attempt"
      });
    }
  };
  
  /**
   * Get quiz results (for user)
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
  
      // Filter attempts for this user
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
      userAttempts.sort((a, b) => b.endTime - a.endTime);
  
      // Format results
      const results = userAttempts.map(attempt => ({
        attemptId: attempt._id,
        score: attempt.score,
        passed: attempt.passed,
        date: attempt.endTime,
        timeTaken: (attempt.endTime - attempt.startTime) / (1000 * 60), // in minutes
        correctAnswers: attempt.answers.filter(a => a.isCorrect).length,
        totalQuestions: quiz.questions.length
      }));
  
      return res.status(200).json({
        success: true,
        quizTitle: quiz.title,
        passingScore: quiz.passingScore,
        results
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
   * Get quiz statistics (for creator/admin)
   * @route GET /api/quizzes/:id/stats
   * @access Private (Creator or Admin only)
   */
  export const getQuizStats = async (req, res) => {
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
          message: "You don't have permission to view these statistics"
        });
      }
  
      // Calculate statistics
      const totalAttempts = quiz.attempts.length;
      const passedAttempts = quiz.attempts.filter(attempt => attempt.passed).length;
      const passRate = totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0;
      
      // Calculate average score
      let averageScore = 0;
      if (totalAttempts > 0) {
        const totalScore = quiz.attempts.reduce((sum, attempt) => sum + attempt.score, 0);
        averageScore = totalScore / totalAttempts;
      }
  
      // Get question statistics
      const questionStats = quiz.questions.map(question => {
        const questionAttempts = quiz.attempts.flatMap(attempt => 
          attempt.answers.filter(answer => answer.questionId.toString() === question._id.toString())
        );
        
        const totalQuestionAttempts = questionAttempts.length;
        const correctAnswers = questionAttempts.filter(answer => answer.isCorrect).length;
        const successRate = totalQuestionAttempts > 0 ? (correctAnswers / totalQuestionAttempts) * 100 : 0;
        
        return {
          questionId: question._id,
          questionText: question.questionText,
          difficulty: question.difficulty,
          totalAttempts: totalQuestionAttempts,
          correctAnswers,
          successRate
        };
      });
  
      // Most recent attempts (limited to 10)
      const recentAttempts = await User.populate(
        quiz.attempts.slice(-10).sort((a, b) => b.endTime - a.endTime),
        { path: "user", select: "name" }
      );
  
      const formattedRecentAttempts = recentAttempts.map(attempt => ({
        user: attempt.user.name,
        score: attempt.score,
        passed: attempt.passed,
        date: attempt.endTime
      }));
  
      return res.status(200).json({
        success: true,
        stats: {
          totalAttempts,
          passedAttempts,
          passRate,
          averageScore,
          questionStats,
          recentAttempts: formattedRecentAttempts
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch quiz statistics"
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
  
      // Delete media from all questions
      for (const question of quiz.questions) {
        if (question.mediaUrl) {
          const publicId = question.mediaUrl.split("/").pop().split(".")[0];
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
   * Generate quiz from content (AI-powered)
   * @route POST /api/quizzes/generate
   * @access Private (Instructor only)
   */
  export const generateQuiz = async (req, res) => {
    try {
      const userId = req.id;
      const {
        content,
        courseId,
        lessonId,
        languageId,
        level,
        title,
        description,
        questionCount = 10,
        difficulty = "Medium",
        questionTypes = ["MultipleChoice", "TrueFalse"]
      } = req.body;
  
      // Validate required fields
      if (!content || !courseId || !languageId || !level) {
        return res.status(400).json({
          success: false,
          message: "Content, course, language and level are required"
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
  
      // Create a placeholder quiz first
      const quiz = new Quiz({
        title: title || "Auto-generated Quiz",
        description: description || "Automatically generated quiz from content",
        course: courseId,
        ...(lessonId && { lesson: lessonId }),
        language: languageId,
        level,
        creator: userId,
        questions: [],
        status: "draft",
        isAutoGenerated: true
      });
  
      // Save placeholder quiz
      await quiz.save();
  
      // In a production app, here you would:
      // 1. Call an AI service (like OpenAI) to generate questions
      // 2. Process the response into quiz questions
      // 3. Add the questions to the quiz
      
      // For now, we'll just generate some placeholder questions to demonstrate the flow
      const dummyQuestions = [];
      
      // Generate dummy questions based on specified count and types
      for (let i = 0; i < questionCount; i++) {
        // Choose a random question type from the specified types
        const randomTypeIndex = Math.floor(Math.random() * questionTypes.length);
        const questionType = questionTypes[randomTypeIndex];
        
        let question = {
          questionText: `Sample Question ${i + 1} about the content`,
          questionType,
          difficulty,
          points: 1
        };
        
        // Add options or correct answer based on question type
        if (questionType === "MultipleChoice") {
          question.options = [
            { text: "Option 1", isCorrect: i % 4 === 0 },
            { text: "Option 2", isCorrect: i % 4 === 1 },
            { text: "Option 3", isCorrect: i % 4 === 2 },
            { text: "Option 4", isCorrect: i % 4 === 3 }
          ];
        } else if (questionType === "TrueFalse") {
          question.options = [
            { text: "True", isCorrect: i % 2 === 0 },
            { text: "False", isCorrect: i % 2 === 1 }
          ];
        } else if (questionType === "FillInTheBlank") {
          question.correctAnswer = "sample answer";
        } else if (questionType === "ShortAnswer") {
          question.correctAnswer = "sample response";
        }
        
        dummyQuestions.push(question);
      }
      
      // Add dummy questions to quiz
      quiz.questions = dummyQuestions;
      await quiz.save();
  
      return res.status(200).json({
        success: true,
        message: "Quiz generated successfully",
        quiz: {
          _id: quiz._id,
          title: quiz.title,
          questionCount: quiz.questions.length
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate quiz"
      });
    }
  };