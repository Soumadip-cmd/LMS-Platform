import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture',
    required: true
  },
  viewed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  }
});

// Add study session schema
const studySessionSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // Duration in seconds
    default: 0
  }
});

const courseProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  lectureProgress: [lectureProgressSchema],
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  studyTime: {
    type: Number,
    default: 0
  },
  studySessions: [studySessionSchema],

  processedRequests: {
    type: [String],
    default: []
  }
}, { timestamps: true });

// Create index for faster queries
courseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);