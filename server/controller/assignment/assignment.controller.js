import mongoose from "mongoose";
import { Assignment } from "../../models/assignment.model.js";
import { Course } from "../../models/course.model.js";
import { User } from "../../models/user.model.js";
import { uploadMedia, deleteMediaFromCloudinary } from "../../utils/cloudinary.js";

/**
 * Create a new assignment
 * @route POST /api/assignments
 * @access Instructor only
 */
export const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      lessonId,
      dueDate,
      timeLimit,
      maxScore,
      reminders,
      allowLateSubmissions,
      latePenalty
    } = req.body;

    const creatorId = req.id;

    // Validate required fields
    if (!title || !description || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and course are required"
      });
    }

    // Check if course exists and user is authorized
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Ensure creator is instructor of the course or admin
    const user = await User.findById(creatorId);
    const isAuthorized = course.instructor.toString() === creatorId || user.role === "admin";
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You can only create assignments for courses you instruct"
      });
    }

    // Create assignment object
    const assignment = new Assignment({
      title,
      description,
      course: courseId,
      ...(lessonId && { lesson: lessonId }),
      ...(dueDate && { dueDate: new Date(dueDate) }),
      ...(timeLimit && { timeLimit }),
      ...(maxScore && { maxScore }),
      ...(reminders && { reminders }),
      creator: creatorId,
      ...(allowLateSubmissions !== undefined && { allowLateSubmissions }),
      ...(latePenalty !== undefined && { latePenalty }),
      status: "draft"
    });

    // Handle file upload if present
    if (req.file) {
      const result = await uploadMedia(req.file.path);
      
      assignment.attachments.push({
        title: req.file.originalname,
        fileUrl: result.secure_url,
        fileType: req.file.mimetype,
        publicId: result.public_id
      });
    }

    // Save assignment
    await assignment.save();

    return res.status(201).json({
      success: true,
      assignment,
      message: "Assignment created successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create assignment"
    });
  }
};

/**
 * Get all assignments (with filters)
 * @route GET /api/assignments
 * @access Public (for published assignments) / Private (for all assignments)
 */
export const getAssignments = async (req, res) => {
  try {
    const { course, status, creator } = req.query;
    
    // Build query
    const query = {};

    // For non-admin users, only show published assignments unless they're the creator
    if (req.user && req.user.role !== "admin") {
      if (req.user._id.toString() === creator) {
        // Creator can see all their assignments
        query.creator = req.user._id;
      } else {
        // Others can only see published assignments
        query.status = "published";
      }
    } else if (!req.user) {
      // Unauthenticated users can only see published assignments
      query.status = "published";
    } else if (status) {
      // Admin can filter by status
      query.status = status;
    }

    // Apply other filters
    if (course) query.course = course;
    if (creator && req.user && req.user.role === "admin") {
      query.creator = creator;
    }

    // Find assignments with populated fields
    const assignments = await Assignment.find(query)
      .populate("course", "title")
      .populate("creator", "name")
      .populate("lesson", "lectureTitle")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      assignments
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch assignments"
    });
  }
};

/**
 * Get a single assignment by ID
 * @route GET /api/assignments/:id
 * @access Public (for published assignments) / Private (for all assignments)
 */
export const getAssignmentById = async (req, res) => {
  try {
    const assignmentId = req.params.id;

    // Validate assignmentId
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID"
      });
    }

    // Find assignment with populated fields
    const assignment = await Assignment.findById(assignmentId)
      .populate("course", "title")
      .populate("creator", "name")
      .populate("lesson", "lectureTitle");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
    }

    // Check if user is authorized to view this assignment
    const isPublished = assignment.status === "published";
    const isCreator = req.user && assignment.creator._id.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === "admin";
    const isInstructor = req.user && assignment.course.instructor === req.user._id.toString();

    if (!isPublished && !isCreator && !isAdmin && !isInstructor) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this assignment"
      });
    }

    return res.status(200).json({
      success: true,
      assignment
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch assignment"
    });
  }
};

/**
 * Update assignment details
 * @route PUT /api/assignments/:id
 * @access Private (Creator or Admin only)
 */
export const updateAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const userId = req.id;
    const {
      title,
      description,
      dueDate,
      timeLimit,
      maxScore,
      reminders,
      allowLateSubmissions,
      latePenalty,
      status
    } = req.body;

    // Validate assignmentId
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID"
      });
    }

    // Find assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
    }

    // Check if user is authorized to update this assignment
    const user = await User.findById(userId);
    const isCreator = assignment.creator.toString() === userId;
    const isAdmin = user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this assignment"
      });
    }

    // Update assignment fields
    if (title) assignment.title = title;
    if (description) assignment.description = description;
    if (dueDate) assignment.dueDate = new Date(dueDate);
    if (timeLimit) assignment.timeLimit = timeLimit;
    if (maxScore) assignment.maxScore = maxScore;
    if (reminders) assignment.reminders = reminders;
    if (allowLateSubmissions !== undefined) assignment.allowLateSubmissions = allowLateSubmissions;
    if (latePenalty !== undefined) assignment.latePenalty = latePenalty;
    if (status && (isAdmin || (isCreator && status !== "published"))) {
      assignment.status = status;
    }

    // Handle file upload if present
    if (req.file) {
      const result = await uploadMedia(req.file.path);
      
      assignment.attachments.push({
        title: req.file.originalname,
        fileUrl: result.secure_url,
        fileType: req.file.mimetype,
        publicId: result.public_id
      });
    }

    // Save updated assignment
    await assignment.save();

    return res.status(200).json({
      success: true,
      assignment,
      message: "Assignment updated successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update assignment"
    });
  }
};

/**
 * Delete assignment
 * @route DELETE /api/assignments/:id
 * @access Private (Creator or Admin only)
 */
export const deleteAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const userId = req.id;

    // Validate assignmentId
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID"
      });
    }

    // Find assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
    }

    // Check if user is authorized to delete this assignment
    const user = await User.findById(userId);
    const isCreator = assignment.creator.toString() === userId;
    const isAdmin = user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this assignment"
      });
    }

    // Delete any attached files from cloud storage
    for (const attachment of assignment.attachments) {
      if (attachment.publicId) {
        await deleteMediaFromCloudinary(attachment.publicId);
      }
    }

    // Delete assignment
    await Assignment.findByIdAndDelete(assignmentId);

    return res.status(200).json({
      success: true,
      message: "Assignment deleted successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete assignment"
    });
  }
};

/**
 * Add attachment to assignment
 * @route POST /api/assignments/:id/attachments
 * @access Private (Creator or Admin only)
 */
export const addAssignmentAttachment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const userId = req.id;
    const { title } = req.body;
    const file = req.file;

    // Validate assignmentId
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID"
      });
    }

    // Check if file is provided
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    // Find assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
    }

    // Check if user is authorized to add attachments
    const user = await User.findById(userId);
    const isCreator = assignment.creator.toString() === userId;
    const isAdmin = user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this assignment"
      });
    }

    // Upload file to cloud storage
    const result = await uploadMedia(file.path);

    // Add attachment to assignment
    assignment.attachments.push({
      title: title || file.originalname,
      fileUrl: result.secure_url,
      fileType: file.mimetype,
      publicId: result.public_id
    });

    // Save updated assignment
    await assignment.save();

    return res.status(200).json({
      success: true,
      attachment: assignment.attachments[assignment.attachments.length - 1],
      message: "Attachment added successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add attachment"
    });
  }
};

/**
 * Remove attachment from assignment
 * @route DELETE /api/assignments/:id/attachments/:attachmentId
 * @access Private (Creator or Admin only)
 */
export const removeAssignmentAttachment = async (req, res) => {
  try {
    const { id: assignmentId, attachmentId } = req.params;
    const userId = req.id;

    // Validate assignmentId
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment ID"
      });
    }

    // Find assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
    }

    // Check if user is authorized to remove attachments
    const user = await User.findById(userId);
    const isCreator = assignment.creator.toString() === userId;
    const isAdmin = user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this assignment"
      });
    }

    // Find attachment
    const attachmentIndex = assignment.attachments.findIndex(
      attachment => attachment._id.toString() === attachmentId
    );

    if (attachmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Attachment not found"
      });
    }

    // Delete file from cloud storage
    const attachment = assignment.attachments[attachmentIndex];
    if (attachment.publicId) {
      await deleteMediaFromCloudinary(attachment.publicId);
    }

    // Remove attachment from assignment
    assignment.attachments.splice(attachmentIndex, 1);

    // Save updated assignment
    await assignment.save();

    return res.status(200).json({
      success: true,
      message: "Attachment removed successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove attachment"
    });
  }
};


