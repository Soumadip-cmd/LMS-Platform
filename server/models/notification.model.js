import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['course', 'achievement', 'progress', 'system'],
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  relatedLecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  },
  relatedAchievement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Notification = mongoose.model("Notification", notificationSchema);