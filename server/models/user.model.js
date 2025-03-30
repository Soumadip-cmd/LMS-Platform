import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true // Allows null values to not violate unique constraint
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["instructor", "student", "admin"],
        default: 'student'
    },
    languageToLearn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language'
    },
    learningGoal: {
        type: String,
        enum: ["Casual", "Professional", "Exam Prep"],
        required: function() {
            return this.role === 'student';
        }
    },
    preferredLearningStyle: {
        type: String,
        enum: ["Audio", "Visual", "Interactive"],
        default: "Visual"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    enrolledCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    examAttempts: [
        {
            exam: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Quiz'
            },
            score: Number,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    purchaseHistory: [
        {
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            },
            amount: Number,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    feedback: [
        {
            content: String,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    subscriptionPlan: {
        type: String,
        enum: ["Free", "Basic", "Premium"],
        default: "Free"
    },
    subscriptionStatus: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    subscriptionExpiryDate: {
        type: Date
    },
    photoUrl: {
        type: String,
        default: ""
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);