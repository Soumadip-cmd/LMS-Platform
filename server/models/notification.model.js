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
    enum: ['course', 'message', 'system', 'enrollment', 'reminder'],
    required: true
  },
  isRead: {
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
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d' // Auto-delete notifications after 30 days
  }
}, { timestamps: true });

// Index for faster querying by recipient
notificationSchema.index({ recipient: 1, isRead: 1 });

export const Notification = mongoose.model("Notification", notificationSchema);