
import mongoose from "mongoose";


/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNumber
 *         - subject
 *         - message
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the contact
 *         firstName:
 *           type: string
 *           description: First name of the person
 *         lastName:
 *           type: string
 *           description: Last name of the person
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the person
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the person
 *         subject:
 *           type: string
 *           description: Subject of the contact request
 *         message:
 *           type: string
 *           description: Message content
 *         status:
 *           type: string
 *           enum: [pending, in-progress, resolved]
 *           default: pending
 *           description: Status of the contact request
 *         assignedTo:
 *           type: string
 *           description: ID of the admin assigned to this request
 *         response:
 *           type: string
 *           description: Admin's response to the contact request
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */
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