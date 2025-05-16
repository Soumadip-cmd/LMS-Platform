import mongoose from "mongoose";

const courseSectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    lessons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lecture'
        }
    ],
    quizzes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        }
    ],
    assignments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment'
        }
    ],
    liveLessons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LiveSession'
        }
    ],
    isPublished: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Create indexes for better performance
courseSectionSchema.index({ course: 1, order: 1 });

export const CourseSection = mongoose.model("CourseSection", courseSectionSchema);
