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
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    facebookId: {
        type: String,
        sparse: true,
        unique: true
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
    // Instructor specific fields from UI
    instructorProfile: {
        teachLanguage: {
            type: String,
            required: function() {
                return this.role === 'instructor';
            }
        },
        qualification: {
            type: String,
            required: function() {
                return this.role === 'instructor';
            }
        },
        linkedin: {
            type: String
        },
        dob: {
            type: String,
            required: function() {
                return this.role === 'instructor';
            }
        },
        address: {
            type: String,
            required: function() {
                return this.role === 'instructor';
            }
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: function() {
                return this.role === 'instructor';
            }
        },
        country: {
            type: String,
            required: function() {
                return this.role === 'instructor';
            }
        },
        contactNumber: {
            type: String,
            required: function() {
                return this.role === 'instructor';
            }
        },
        resumeUrl: {
            type: String,
            required: function() {
                return this.role === 'instructor';
            }
        },
        applicationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        applicationDate: {
            type: Date,
            default: Date.now
        }
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
    },
    authProvider: {
        type: String,
        enum: ["local", "google", "facebook"],
        default: "local"
    },
    // New fields for blog notification system
    preferredCategories: {
        type: [String],
        default: []
    },
    notificationPreferences: {
        email: {
            type: Boolean,
            default: true
        },
        push: {
            type: Boolean,
            default: true
        },
        categories: {
            type: Boolean,
            default: true
        },
        courseUpdates: {
            type: Boolean,
            default: true
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // For content recommendation system
    readHistory: [
        {
            blog: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Blog'
            },
            readAt: {
                type: Date,
                default: Date.now
            },
            completionPercentage: {
                type: Number,
                default: 100
            }
        }
    ]
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);