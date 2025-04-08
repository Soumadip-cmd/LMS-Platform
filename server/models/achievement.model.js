import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String
  },
  criteria: {
    type: String,
    enum: [
      "COURSE_COMPLETION", 
      "MULTIPLE_COURSES", 
      "STREAK", 
      "QUIZ_PERFECT", 
      "STUDY_TIME",
      "FIRST_COURSE"
    ],
    required: true
  },
  threshold: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export const Achievement = mongoose.model("Achievement", achievementSchema);

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
  }
}, { timestamps: true });

// Create index for faster queries
userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export const UserAchievement = mongoose.model("UserAchievement", userAchievementSchema);