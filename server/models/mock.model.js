import mongoose from "mongoose";

// Schema for individual questions
const questionSchema = new mongoose.Schema({
  questionType: {
    type: String,
    enum: [
      "MultipleChoice", 
      "TrueFalse", 
      "Matching", 
      "FillInTheBlank", 
      "ShortAnswer",
      "FormFilling",
      "Writing",
      "Speaking",
      "ErrorCorrection",
      "SentenceReordering",
      "SentenceTransformation",
      "ClozeTest"
    ],
    required: true
  },
  skillArea: {
    type: String,
    enum: ["Listening", "Reading", "Writing", "Speaking", "Grammar"],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String
  },
  imageUrl: {
    type: String
  },
  options: [String],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // Can be String, Array, or Object depending on question type
    required: true
  },
  points: {
    type: Number,
    default: 1
  },
  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true
  },
  instructions: {
    type: String
  },
  timeLimit: {
    type: Number, // in seconds
    default: 60
  }
});

// Schema for mock test sections
const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  skillArea: {
    type: String,
    enum: ["Listening", "Reading", "Writing", "Speaking", "Grammar"],
    required: true
  },
  instructions: {
    type: String
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  questions: [questionSchema],
  passScore: {
    type: Number,
    required: true
  }
});

// Main mock test schema
const mockTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: true
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  totalScore: {
    type: Number,
    required: true
  },
  passScore: {
    type: Number,
    required: true
  },
  sections: [sectionSchema],
  isPublished: {
    type: Boolean,
    default: false
  },
  availableFor: {
    type: String,
    enum: ["All", "Premium", "Specific"],
    default: "All"
  },
  specificCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Schema for tracking user test attempts
const mockTestAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mockTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MockTest',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  totalScore: {
    type: Number,
    default: 0
  },
  sectionScores: [{
    sectionId: String,
    score: Number,
    maxScore: Number
  }],
  answers: [{
    questionId: String,
    userAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    score: Number
  }],
  feedback: {
    type: String
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateUrl: {
    type: String
  }
}, { timestamps: true });

export const MockTest = mongoose.model("MockTest", mockTestSchema);
export const MockTestAttempt = mongoose.model("MockTestAttempt", mockTestAttemptSchema);