// controllers/contact.controller.js
import { Contact } from "../../models/contact.model.js";
import { User } from "../../models/user.model.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { sendUserNotification } from "../../socket/socket.js";
import path from 'path';
// Create a new contact request
export const createContact = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, subject, message } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phoneNumber || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Create contact
        const contact = await Contact.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            subject,
            message
        });

        // Send confirmation email to user using your template
        await sendEmail(
            email,
            "Thank you for contacting Preplings",
            "contact-confirmation",
            {
                firstName,
                lastName,
                subject,
                referenceId: contact._id,
                submissionDate: new Date().toLocaleDateString()
            }
        );

        // Send notification to admin
        const admins = await User.find({ role: "admin" });
        if (admins.length > 0) {
            admins.forEach(async (admin) => {
                if (admin.email) {
                    // Send email notification
                    await sendEmail(
                        admin.email,
                        "New Contact Request",
                        "admin-notification",
                        {
                            firstName,
                            lastName,
                            email,
                            phoneNumber,
                            subject,
                            message,
                            referenceId: contact._id,
                            submissionDate: new Date().toLocaleDateString()
                        }
                    );
                    
                    // Send socket notification if admin is online
                    sendUserNotification(admin._id.toString(), {
                        title: "New Contact Request",
                        message: `${firstName} ${lastName} has submitted a new contact request.`,
                        type: "contact",
                        contactId: contact._id,
                        timestamp: new Date()
                    });
                }
            });
        }

        return res.status(201).json({
            success: true,
            contact,
            message: "Your message has been sent successfully. We'll get back to you soon."
        });
    } catch (error) {
        console.error('Create Contact Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit contact form"
        });
    }
};

// Get all contact requests (admin only)
export const getAllContacts = async (req, res) => {
    try {
        // Check authorization
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access contact requests"
            });
        }

        // Query parameters for filtering and pagination
        const { status, sortBy, page = 1, limit = 10 } = req.query;
        
        // Build query
        const query = {};
        if (status) query.status = status;

        // Count total documents
        const totalDocuments = await Contact.countDocuments(query);
        
        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Sort options
        const sortOptions = {};
        if (sortBy === "oldest") {
            sortOptions.createdAt = 1;
        } else {
            sortOptions.createdAt = -1; // Default: newest first
        }

        // Fetch contacts
        const contacts = await Contact.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .populate("assignedTo", "name email");

        return res.status(200).json({
            success: true,
            totalDocuments,
            totalPages: Math.ceil(totalDocuments / parseInt(limit)),
            currentPage: parseInt(page),
            contacts
        });
    } catch (error) {
        console.error('Get All Contacts Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve contact requests"
        });
    }
};

// Get a single contact request by ID (admin only)
export const getContactById = async (req, res) => {
    try {
        const { contactId } = req.params;

        // Check authorization
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access contact requests"
            });
        }

        // Find contact
        const contact = await Contact.findById(contactId)
            .populate("assignedTo", "name email");
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact request not found"
            });
        }

        return res.status(200).json({
            success: true,
            contact
        });
    } catch (error) {
        console.error('Get Contact By ID Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve contact request"
        });
    }
};

// Update a contact request (admin only)
export const updateContact = async (req, res) => {
    try {
        const { contactId } = req.params;
        const { status, assignedTo, response } = req.body;

        // Check authorization
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update contact requests"
            });
        }

        // Find contact
        const contact = await Contact.findById(contactId);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact request not found"
            });
        }

        // Update fields
        if (status) contact.status = status;
        if (assignedTo) contact.assignedTo = assignedTo;
        if (response) contact.response = response;
        
        contact.updatedAt = new Date();
        await contact.save();

        // If status changed to resolved and there's a response, send email to the user
        if (status === "resolved" && response) {
            await sendEmail(
                contact.email,
                `RE: ${contact.subject}`,
                "contact-response",
                {
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    subject: contact.subject,
                    originalMessage: contact.message,
                    responseMessage: response,
                    submissionDate: new Date(contact.createdAt).toLocaleDateString()
                }
            );
        }

        return res.status(200).json({
            success: true,
            contact,
            message: "Contact request updated successfully"
        });
    } catch (error) {
        console.error('Update Contact Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to update contact request"
        });
    }
};

// Delete a contact request (admin only)
export const deleteContact = async (req, res) => {
    try {
        const { contactId } = req.params;

        // Check authorization
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete contact requests"
            });
        }

        // Find and delete contact
        const contact = await Contact.findByIdAndDelete(contactId);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact request not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contact request deleted successfully"
        });
    } catch (error) {
        console.error('Delete Contact Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete contact request"
        });
    }
};

// Search contact requests (admin only)
export const searchContacts = async (req, res) => {
    try {
        const { query } = req.query;

        // Check authorization
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to search contact requests"
            });
        }

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        // Search in name, email, subject, and message
        const contacts = await Contact.find({
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { subject: { $regex: query, $options: 'i' } },
                { message: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            contacts
        });
    } catch (error) {
        console.error('Search Contacts Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to search contact requests"
        });
    }
};

// Get contact statistics (admin only)
export const getContactStats = async (req, res) => {
    try {
        // Check authorization
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view contact statistics"
            });
        }

        // Count contacts by status
        const pendingCount = await Contact.countDocuments({ status: "pending" });
        const inProgressCount = await Contact.countDocuments({ status: "in-progress" });
        const resolvedCount = await Contact.countDocuments({ status: "resolved" });
        
        // Get total count
        const totalCount = pendingCount + inProgressCount + resolvedCount;

        // Get weekly data (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const weeklyData = await Contact.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { 
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } 
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        return res.status(200).json({
            success: true,
            stats: {
                total: totalCount,
                pending: pendingCount,
                inProgress: inProgressCount,
                resolved: resolvedCount,
                weeklyData
            }
        });
    } catch (error) {
        console.error('Get Contact Stats Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve contact statistics"
        });
    }
};