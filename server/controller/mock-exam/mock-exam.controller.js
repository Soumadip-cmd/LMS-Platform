import { MockTest, MockTestAttempt } from "../../models/mock.model.js";
import { Course } from "../../models/course.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// Create a new mock test
const createMockTest = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    language,
    level,
    duration,
    totalScore,
    passScore,
    sections,
    availableFor,
    specificCourses,
    price,
    isFree
  } = req.body;

  if (!title || !description || !language || !level || !duration || !passScore) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Get the user ID correctly - use id instead of _id 
  const userId = req.user.id; // <-- THIS IS THE FIX
  
  if (!userId) {
    throw new ApiError(400, "User ID not found. Authentication issue.");
  }

  // Calculate total score from sections if not provided
  let calculatedTotalScore = totalScore;
  if (!calculatedTotalScore && sections) {
    calculatedTotalScore = sections.reduce((total, section) => {
      return total + section.questions.reduce((questionsTotal, question) => {
        return questionsTotal + question.points;
      }, 0);
    }, 0);
  }

  // Create mock test with the correct creator ID
  const mockTest = await MockTest.create({
    title,
    description,
    language,
    level,
    duration,
    totalScore: calculatedTotalScore || totalScore,
    passScore,
    sections,
    availableFor: availableFor || "All",
    specificCourses: specificCourses || [],
    creator: userId, 
    thumbnailUrl: req.file?.path,
    price: price || 0,
    isFree: isFree !== undefined ? isFree : (price ? false : true)
  });

  return res
    .status(201)
    .json(new ApiResponse(201, mockTest, "Mock test created successfully"));
});

// Get all mock tests with optional filters
const getAllMockTests = asyncHandler(async (req, res) => {
  const {
    language,
    level,
    availableFor,
    isPublished,
    debug
  } = req.query;

  // Start with an empty filter object
  const filters = {};
  
  // Only apply isPublished filter if it's explicitly provided
  if (isPublished !== undefined) {
    filters.isPublished = isPublished === 'true';
  }

  if (language) filters.language = language;
  if (level) filters.level = level;
  if (availableFor) filters.availableFor = availableFor;
  
  // Log the filters being used
  console.log("Query filters:", filters);
  
  // Count total documents (for debugging)
  const totalCount = await MockTest.countDocuments({});
  
  // Execute the query
  const mockTests = await MockTest.find(filters)
    .populate("language", "name code")
    .populate("creator", "username email")
    .select("-sections.questions.correctAnswer");
    
  // If debug mode is enabled, include additional info
  const responseData = debug === 'true' 
    ? {
        tests: mockTests,
        count: mockTests.length,
        totalInDatabase: totalCount,
        appliedFilters: filters
      }
    : mockTests;
  
  return res
    .status(200)
    .json(new ApiResponse(200, responseData, "Mock tests fetched successfully"));
});
// Get mock test by ID
const getMockTestById = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const isAdmin = req.user.role === "admin" || req.user.role === "instructor";

  const mockTest = await MockTest.findById(testId)
    .populate("language", "name code")
    .populate("creator", "username email");

  if (!mockTest) {
    throw new ApiError(404, "Mock test not found");
  }

  // Remove correct answers for non-admin users
  if (!isAdmin) {
    mockTest.sections.forEach(section => {
      section.questions.forEach(question => {
        question.correctAnswer = undefined;
      });
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, mockTest, "Mock test fetched successfully"));
});

// Update mock test 
const updateMockTest = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const updateData = req.body;

  const mockTest = await MockTest.findById(testId);

  if (!mockTest) {
    throw new ApiError(404, "Mock test not found");
  }

  // Check if user is authorized (creator or admin)

  if (mockTest.creator.toString() !== req.user.id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to update this mock test");
  }

  // If the test is already published, restrict certain updates
  if (mockTest.isPublished && updateData.sections) {
    throw new ApiError(400, "Cannot modify sections of a published test");
  }

  // Update the thumbnail if a new file is uploaded
  if (req.file?.path) {
    updateData.thumbnailUrl = req.file.path;
  }

  // Handle price and isFree fields
  if (updateData.price !== undefined) {
    updateData.price = updateData.price || 0;
    // If isFree not explicitly set but price was updated
    if (updateData.isFree === undefined) {
      updateData.isFree = updateData.price === 0;
    }
  } else if (updateData.isFree !== undefined && updateData.isFree === true) {
    // If setting to free but no price specified, set price to 0
    updateData.price = 0;
  }

  const updatedMockTest = await MockTest.findByIdAndUpdate(
    testId,
    updateData,
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedMockTest, "Mock test updated successfully"));
});
// Delete mock test
const deleteMockTest = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  const mockTest = await MockTest.findById(testId);

  if (!mockTest) {
    throw new ApiError(404, "Mock test not found");
  }


  if (mockTest.creator.toString() !== req.user.id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to delete this mock test");
  }

  // Check if there are any attempts
  const attempts = await MockTestAttempt.countDocuments({ mockTest: testId });
  if (attempts > 0 && req.user.role !== "admin") {
    throw new ApiError(400, "Cannot delete a mock test with existing attempts");
  }

  await MockTest.findByIdAndDelete(testId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Mock test deleted successfully"));
});

// Publish/unpublish mock test
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const { isPublished } = req.body;

  const mockTest = await MockTest.findById(testId);

  if (!mockTest) {
    throw new ApiError(404, "Mock test not found");
  }

  if (mockTest.creator.toString() !== req.user.id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to update this mock test");
  }

  // Validate the test before publishing
  if (isPublished === true) {
    if (!mockTest.sections || mockTest.sections.length === 0) {
      throw new ApiError(400, "Cannot publish a mock test without sections");
    }

    // Check that all sections have questions
    for (const section of mockTest.sections) {
      if (!section.questions || section.questions.length === 0) {
        throw new ApiError(400, `Section "${section.title}" has no questions`);
      }
    }
  }

  mockTest.isPublished = isPublished;
  await mockTest.save();

  return res
    .status(200)
    .json(new ApiResponse(
      200, 
      { isPublished }, 
      `Mock test ${isPublished ? "published" : "unpublished"} successfully`
    ));
});
// Start a mock test attempt

const startMockTestAttempt = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  
  const userId = req.user.id;

  const mockTest = await MockTest.findById(testId);

  if (!mockTest) {
    throw new ApiError(404, "Mock test not found");
  }

  if (!mockTest.isPublished) {
    throw new ApiError(400, "This mock test is not published yet");
  }

  // Check if the test is available for the user
  if (mockTest.availableFor === "Premium" && req.user.subscription !== "premium") {
    throw new ApiError(403, "This mock test is only available for premium users");
  }

  if (mockTest.availableFor === "Specific") {
    const enrolledCourses = await Course.find({ enrolledStudents: userId });
    const enrolledCourseIds = enrolledCourses.map(course => course._id.toString());
    
    const isEnrolled = mockTest.specificCourses.some(courseId => 
      enrolledCourseIds.includes(courseId.toString())
    );

    if (!isEnrolled) {
      throw new ApiError(403, "You need to be enrolled in specific courses to access this test");
    }
  }

  // Check if user has an ongoing attempt
  const existingAttempt = await MockTestAttempt.findOne({
    user: userId,
    mockTest: testId,
    isCompleted: false
  });

  if (existingAttempt) {
    return res
      .status(200)
      .json(new ApiResponse(200, existingAttempt, "Ongoing attempt found"));
  }

  // Create a new attempt
  const newAttempt = await MockTestAttempt.create({
    user: userId,
    mockTest: testId,
    startTime: new Date()
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newAttempt, "Mock test attempt started successfully"));
});


// Start a mock test attempt (for testing purposes)
// Uncomment this function if you want to use it for testing purposes

// const startMockTestAttempt = asyncHandler(async (req, res) => {
//   const { testId } = req.params;
//   const userId = req.user.id;
  
//   const mockTest = await MockTest.findById(testId);
  
//   if (!mockTest) {
//     throw new ApiError(404, "Mock test not found");
//   }
  
//   if (!mockTest.isPublished) {
//     throw new ApiError(400, "This mock test is not published yet");
//   }
  
//   // FOR TESTING: We'll bypass availability restrictions
  
//   // For premium tests, bypass the premium subscription check
//   // if (mockTest.availableFor === "Premium" && req.user.subscription !== "premium") {
//   //   throw new ApiError(403, "This mock test is only available for premium users");
//   // }
  
//   // For specific course tests, bypass the enrollment check
//   // if (mockTest.availableFor === "Specific") {
//   //   const enrolledCourses = await Course.find({ enrolledStudents: userId });
//   //   const enrolledCourseIds = enrolledCourses.map(course => course._id.toString());
//   //   
//   //   const isEnrolled = mockTest.specificCourses.some(courseId => 
//   //     enrolledCourseIds.includes(courseId.toString())
//   //   );
//   //   
//   //   if (!isEnrolled) {
//   //     throw new ApiError(403, "You need to be enrolled in specific courses to access this test");
//   //   }
//   // }
  
//   // Check if user has an ongoing attempt
//   const existingAttempt = await MockTestAttempt.findOne({
//     user: userId,
//     mockTest: testId,
//     isCompleted: false
//   });
  
//   if (existingAttempt) {
//     return res
//       .status(200)
//       .json(new ApiResponse(200, existingAttempt, "Ongoing attempt found"));
//   }
  
//   // Create a new attempt
//   const newAttempt = await MockTestAttempt.create({
//     user: userId,
//     mockTest: testId,
//     startTime: new Date()
//   });
  
//   return res
//     .status(201)
//     .json(new ApiResponse(201, newAttempt, "Mock test attempt started successfully"));
// });

// Submit answers for a mock test attempt
const submitMockTestAnswers = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const { answers, endTime } = req.body;

  // Validate input
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    throw new ApiError(400, "Valid answers must be provided");
  }

  const attempt = await MockTestAttempt.findById(attemptId);

  if (!attempt) {
    throw new ApiError(404, "Test attempt not found");
  }

  if (attempt.user.toString() !== req.user.id.toString()) {
    throw new ApiError(403, "You are not authorized to submit answers for this attempt");
  }

  if (attempt.isCompleted) {
    throw new ApiError(400, "This test attempt is already completed");
  }

  const mockTest = await MockTest.findById(attempt.mockTest);

  if (!mockTest) {
    throw new ApiError(404, "Mock test not found");
  }

  // Check if mockTest has the expected structure
  if (!mockTest.sections || !Array.isArray(mockTest.sections) || mockTest.sections.length === 0) {
    console.error("Mock test has no sections:", mockTest);
    throw new ApiError(400, "Mock test structure is invalid");
  }

  // Evaluate answers and calculate scores
  const evaluatedAnswers = [];
  const sectionScores = [];
  let totalScore = 0;

  // Create a map of section IDs to help with scoring
  const sectionsMap = new Map();
  mockTest.sections.forEach(section => {
    if (!section.questions || !Array.isArray(section.questions)) {
      console.warn(`Section ${section._id} has no questions array`);
      return;
    }

    const sectionScore = {
      sectionId: section._id.toString(),
      score: 0,
      maxScore: section.questions.reduce((total, q) => total + (q.points || 1), 0)
    };
    sectionScores.push(sectionScore);
    sectionsMap.set(section._id.toString(), { sectionScore, questionMap: new Map() });
    
    // Map questions within each section
    section.questions.forEach(question => {
      if (question && question._id) {
        sectionsMap.get(section._id.toString()).questionMap.set(
          question._id.toString(), 
          question
        );
      }
    });
  });

  // Evaluate each answer (only if we have sections to evaluate against)
  if (sectionsMap.size > 0) {
    answers.forEach(answer => {
      const { sectionId, questionId, userAnswer } = answer;
      
      if (!sectionId || !questionId) {
        console.warn("Answer missing sectionId or questionId:", answer);
        return;
      }
      
      const sectionData = sectionsMap.get(sectionId);
      if (!sectionData) {
        console.warn(`Section ${sectionId} not found for answer:`, answer);
        return;
      }
      
      const question = sectionData.questionMap.get(questionId);
      if (!question) {
        console.warn(`Question ${questionId} not found in section ${sectionId}`);
        return;
      }
      
      let isCorrect = false;
      let score = 0;
      
      // Evaluate based on question type
      try {
        switch (question.questionType) {
          case "MultipleChoice":
          case "TrueFalse":
            isCorrect = userAnswer === question.correctAnswer;
            score = isCorrect ? question.points : 0;
            break;
            
          case "Matching":
          case "FillInTheBlank":
            // For array-based answers, check if arrays match
            if (Array.isArray(userAnswer) && Array.isArray(question.correctAnswer)) {
              isCorrect = userAnswer.length === question.correctAnswer.length &&
                userAnswer.every((val, index) => val === question.correctAnswer[index]);
              score = isCorrect ? question.points : 0;
            }
            break;
            
          case "ShortAnswer":
            // For short answers, instructors will need to review
            // Set as pending review with 0 score initially
            isCorrect = null; // Requires manual review
            score = 0;
            break;
            
          // Add more evaluation logic for other question types
          default:
            isCorrect = null; // Requires manual review
            score = 0;
        }
      } catch (error) {
        console.error(`Error evaluating answer for question ${questionId}:`, error);
        isCorrect = null;
        score = 0;
      }
      
      // Add to evaluated answers
      evaluatedAnswers.push({
        questionId,
        userAnswer,
        isCorrect,
        score
      });
      
      // Update section score
      sectionData.sectionScore.score += score;
      totalScore += score;
    });
  }

  // Update the attempt with scores and answers
  attempt.answers = evaluatedAnswers;
  attempt.sectionScores = sectionScores;
  attempt.totalScore = totalScore;
  attempt.endTime = endTime || new Date();
  attempt.isCompleted = true;
  
  // Check if passed
  const passed = totalScore >= mockTest.passScore;
  
  // Save the updated attempt
  await attempt.save();
  
  return res
    .status(200)
    .json(new ApiResponse(
      200, 
      { 
        attempt, 
        passed,
        totalScore,
        passScore: mockTest.passScore
      }, 
      "Mock test completed successfully"
    ));
});

// Get all attempts for a user
const getUserAttempts = asyncHandler(async (req, res) => {
  // Fix: Use req.user.id instead of req.user._id
  const userId = req.params.userId || req.user.id;
  
  // Fix: Also use req.user.id in the authorization check
  if (req.params.userId && req.params.userId !== req.user.id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to view these attempts");
  }
  
  console.log("Looking for attempts for user:", userId);
  
  const attempts = await MockTestAttempt.find({ user: userId })
    .populate({
      path: "mockTest",
      select: "title language level duration passScore totalScore"
    })
    .sort({ createdAt: -1 });
  
  console.log("Found attempts:", attempts.length);
  
  return res
    .status(200)
    .json(new ApiResponse(
      200, 
      attempts, 
      attempts.length > 0 
        ? "User attempts fetched successfully" 
        : "No attempts found for this user"
    ));
});
// Get detailed results for a specific attempt


const getAttemptResults = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  
  const attempt = await MockTestAttempt.findById(attemptId)
    .populate({
      path: "mockTest",
      populate: [
        {
          path: "language",
          select: "name code"
        },
        {
          path: "creator",
          select: "username email"
        }
      ]
    })
    .populate({
      path: "user",
      select: "username email"
    });
    
  if (!attempt) {
    throw new ApiError(404, "Test attempt not found");
  }
  
  // Check authorization
  if (attempt.user._id.toString() !== req.user.id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to view these results");
  }
  
  // Calculate additional statistics
  const stats = {
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    pendingReview: 0
  };
  
  attempt.answers.forEach(answer => {
    stats.totalQuestions++;
    if (answer.isCorrect === true) stats.correctAnswers++;
    else if (answer.isCorrect === false) stats.incorrectAnswers++;
    else stats.pendingReview++;
  });
  
  return res
    .status(200)
    .json(new ApiResponse(200, {
      attempt,
      stats,
      passThreshold: attempt.mockTest?.passScore || 0,
      passed: attempt.totalScore >= (attempt.mockTest?.passScore || 0)
    }, "Attempt results fetched successfully"));
});
// Grade manual review questions (for instructors/admins)
const gradeManualReviewQuestions = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const { questionScores, feedback } = req.body;
  
  // Check if user is authorized
  if (req.user.role !== "admin" && req.user.role !== "instructor") {
    throw new ApiError(403, "You are not authorized to grade test attempts");
  }
  
  const attempt = await MockTestAttempt.findById(attemptId);
  
  if (!attempt) {
    throw new ApiError(404, "Test attempt not found");
  }
  
  if (!attempt.isCompleted) {
    throw new ApiError(400, "Cannot grade an incomplete test attempt");
  }
  
  let totalScoreAdjustment = 0;
  
  // Update scores for manually graded questions
  questionScores.forEach(({ questionId, score, isCorrect }) => {
    const answerIndex = attempt.answers.findIndex(a => a.questionId === questionId);
    
    if (answerIndex !== -1) {
      const oldScore = attempt.answers[answerIndex].score || 0;
      attempt.answers[answerIndex].score = score;
      attempt.answers[answerIndex].isCorrect = isCorrect;
      
      totalScoreAdjustment += (score - oldScore);
    }
  });
  
  // Update total score
  attempt.totalScore += totalScoreAdjustment;
  
  // Add feedback if provided
  if (feedback) {
    attempt.feedback = feedback;
  }
  
  // Update section scores
  if (totalScoreAdjustment !== 0) {
    // Recalculate section scores based on updated answers
    const mockTest = await MockTest.findById(attempt.mockTest);
    
    const questionSectionMap = new Map();
    mockTest.sections.forEach(section => {
      section.questions.forEach(question => {
        questionSectionMap.set(question._id.toString(), section._id.toString());
      });
    });
    
    // Reset section scores
    attempt.sectionScores.forEach(sectionScore => {
      sectionScore.score = 0;
    });
    
    // Recalculate section scores
    attempt.answers.forEach(answer => {
      const sectionId = questionSectionMap.get(answer.questionId);
      if (sectionId) {
        const sectionScoreIndex = attempt.sectionScores.findIndex(
          s => s.sectionId === sectionId
        );
        if (sectionScoreIndex !== -1) {
          attempt.sectionScores[sectionScoreIndex].score += answer.score;
        }
      }
    });
  }
  
  await attempt.save();
  
  return res
    .status(200)
    .json(new ApiResponse(200, attempt, "Test attempt graded successfully"));
});

export {
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
};