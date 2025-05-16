import mongoose from "mongoose";

// Schema for achievement definitions
const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  criteria: {
    type: String,
    enum: [
      "FIRST_COURSE", 
      "COURSE_COMPLETION", 
      "STREAK", 
      "MULTIPLE_COURSES", 
      "QUIZ_SCORE", 
      "STUDY_TIME",
      "ASSIGNMENT_COMPLETION"
    ],
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    default: "https://placehold.co/100x100?text=Achievement"
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Schema for tracking which users have earned which achievements
const userAchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
    required: true
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  notified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Create compound index to ensure a user can only earn an achievement once
userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export const Achievement = mongoose.model("Achievement", achievementSchema);
export const UserAchievement = mongoose.model("UserAchievement", userAchievementSchema);
