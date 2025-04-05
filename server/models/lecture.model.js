import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,  // in minutes
    },
    videoUrl: { 
        type: String 
    },
    publicId: { 
        type: String 
    },
    videoFileName: {
        type: String
    },
  
    isPreviewFree: { 
        type: Boolean,
        default: false
    },
    fileUrl: {
        type: String
    },
    fileName: {
        type: String
    },
    attachments: [
        {
            title: String,
            fileUrl: String,
            publicId: String,
            fileType: String
        }
    ],
    
    notes: {
        type: String
    },
    zoomMeetingId: {
        type: String
    },
    zoomMeetingPassword: {
        type: String
    },
    liveSessionSchedule: {
        date: Date,
        duration: Number  // in minutes
    },
    completedBy: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            completedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Lecture = mongoose.model("Lecture", lectureSchema);