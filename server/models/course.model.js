import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
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
    description: {
        type: String,
        required: true
    },
    duration: {
        weeks: {
            type: Number,
            required: true
        }
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    materials: [
        {
            title: String,
            type: {
                type: String,
                enum: ["PDF", "Document", "Video", "Audio", "Link"]
            },
            url: String,
            publicId: String
        }
    ],
    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    rating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                rating: Number,
                comment: String,
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number
    },
    status: {
        type: String,
        enum: ["draft", "inProgress", "published", "archived", "underReview"],
        default: "draft"
    },
    thumbnailUrl: {
        type: String
    },
    isLive: {
        type: Boolean,
        default: false
    },
    liveSessionDetails: {
        platform: {
            type: String,
            enum: ["Zoom", "Google Meet", "Microsoft Teams", "Preplings Platform", "Other"],
            default: "Zoom"
        },
        sessionsPerWeek: {
            type: Number,
            default: 0
        },
        sessionDuration: {
            type: Number, // in minutes
            default: 60
        },
        maxStudentsPerSession: {
            type: Number,
            default: 20
        },
        timeZone: {
            type: String,
            default: "UTC"
        }
    },
    batches: [{
        batchName: String,
        startDate: Date,
        endDate: Date,
        enrollmentOpen: {
            type: Boolean,
            default: true
        },
        maxStudents: {
            type: Number,
            default: 30
        },
        currentEnrollments: {
            type: Number,
            default: 0
        }
    }],
    requirements: [String],
    learningOutcomes: [String],

    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);