import mongoose from "mongoose";

// Schema for assignment submissions
const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    publicId: String
  }],
  grade: {
    score: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number
    },
    feedback: String,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    gradedAt: Date
  },
  status: {
    type: String,
    enum: ["submitted", "late", "graded", "returned"],
    default: "submitted"
  }
});

// Main assignment schema
const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  },
  dueDate: {
    type: Date
  },
  timeLimit: {
    value: {
      type: Number
    },
    unit: {
      type: String,
      enum: ["Hours", "Days", "Weeks"],
      default: "Days"
    }
  },
  maxScore: {
    type: Number,
    default: 100
  },
  attachments: [{
    title: String,
    fileUrl: String,
    fileType: String,
    publicId: String
  }],
  submissions: [submissionSchema],
  reminders: {
    due: {
      type: String,
      default: "1 Day Before"
    },
    overdue: {
      type: String,
      default: "1 Day After"
    }
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft"
  },
  allowLateSubmissions: {
    type: Boolean,
    default: true
  },
  latePenalty: {
    type: Number, // percentage deduction
    default: 0
  }
}, { timestamps: true });

// Create indexes for better performance
assignmentSchema.index({ course: 1, status: 1 });
assignmentSchema.index({ creator: 1 });
assignmentSchema.index({ dueDate: 1 });

// Add virtual for submission count
assignmentSchema.virtual('submissionCount').get(function() {
  return this.submissions?.length || 0;
});

export const Assignment = mongoose.model("Assignment", assignmentSchema);
