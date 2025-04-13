
import mongoose from "mongoose";
const liveSessionSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    batch: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scheduledTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in minutes
        default: 60
    },
    platform: {
        type: String,
        enum: ["Zoom", "Google Meet", "Microsoft Teams", "Preplings Platform", "Other"],
        default: "Zoom"
    },
    meetingLink: String,
    meetingId: String,
    meetingPassword: String,
    materials: [{
        title: String,
        url: String,
        type: String // 'slide', 'document', 'video'
    }],
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        attended: {
            type: Boolean,
            default: false
        },
        joinTime: Date,
        leaveTime: Date
    }],
    recordingUrl: String,
    status: {
        type: String,
        enum: ["scheduled", "ongoing", "completed", "cancelled"],
        default: "scheduled"
    }
}, { timestamps: true });

export const LiveSession = mongoose.model("LiveSession", liveSessionSchema);