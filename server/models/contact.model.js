
import mongoose from "mongoose";



const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"]
    },
    subject: {
        type: String,
        required: [true, "Subject is required"]
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "resolved"],
        default: "pending"
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    response: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const Contact = mongoose.model("Contact", contactSchema);