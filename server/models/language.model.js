import mongoose from "mongoose";

const languageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Moderate", "Hard"],
        default: "Moderate"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    iconUrl: {
        type: String
    }
}, { timestamps: true });

export const Language = mongoose.model("Language", languageSchema);