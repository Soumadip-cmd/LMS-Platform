import mongoose from "mongoose";
import { CourseSection } from "../../models/courseSection.model.js";
import { Course } from "../../models/course.model.js";
import { User } from "../../models/user.model.js";

/**
 * Create a new course section
 * @route POST /api/courses/:courseId/sections
 * @access Instructor or Admin only
 */
export const createCourseSection = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, summary, order } = req.body;
    const createdBy = req.id;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Section title is required"
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Ensure creator is instructor of the course or admin
    const user = await User.findById(createdBy);
    const isAuthorized = course.instructor.toString() === createdBy || user.role === "admin";
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You can only create sections for courses you instruct"
      });
    }

    // Create section
    const section = new CourseSection({
      title,
      summary,
      course: courseId,
      order: order || await getNextSectionOrder(courseId),
      createdBy
    });

    // Save section
    await section.save();

    return res.status(201).json({
      success: true,
      section,
      message: "Section created successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create section"
    });
  }
};

/**
 * Get all sections for a course
 * @route GET /api/courses/:courseId/sections
 * @access Public (for published courses) / Private (for draft courses)
 */
export const getCourseSections = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // If course is not published, check authorization
    if (course.status !== "published" && req.user) {
      const isAuthorized = course.instructor.toString() === req.id || req.user.role === "admin";
      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view sections for this course"
        });
      }
    } else if (course.status !== "published" && !req.user) {
      return res.status(403).json({
        success: false,
        message: "This course is not published yet"
      });
    }

    // Get sections
    const sections = await CourseSection.find({ course: courseId })
      .sort({ order: 1 })
      .populate("lessons", "title description duration")
      .populate("quizzes", "title description timeLimit")
      .populate("assignments", "title description dueDate")
      .populate("liveLessons", "title description scheduledAt");

    return res.status(200).json({
      success: true,
      sections
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch sections"
    });
  }
};

/**
 * Update a course section
 * @route PUT /api/courses/:courseId/sections/:sectionId
 * @access Instructor or Admin only
 */
export const updateCourseSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, summary, order, isPublished } = req.body;
    const userId = req.id;

    // Check if section exists
    const section = await CourseSection.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found"
      });
    }

    // Check if user is authorized
    const isAuthorized = section.createdBy.toString() === userId || req.user.role === "admin";
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this section"
      });
    }

    // Update section
    if (title) section.title = title;
    if (summary !== undefined) section.summary = summary;
    if (order !== undefined) section.order = order;
    if (isPublished !== undefined) section.isPublished = isPublished;

    // Save updated section
    await section.save();

    return res.status(200).json({
      success: true,
      section,
      message: "Section updated successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update section"
    });
  }
};

/**
 * Delete a course section
 * @route DELETE /api/courses/:courseId/sections/:sectionId
 * @access Instructor or Admin only
 */
export const deleteCourseSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const userId = req.id;

    // Check if section exists
    const section = await CourseSection.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found"
      });
    }

    // Check if user is authorized
    const isAuthorized = section.createdBy.toString() === userId || req.user.role === "admin";
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this section"
      });
    }

    // Delete section
    await CourseSection.findByIdAndDelete(sectionId);

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete section"
    });
  }
};

// Helper function to get the next section order
const getNextSectionOrder = async (courseId) => {
  const lastSection = await CourseSection.findOne({ course: courseId })
    .sort({ order: -1 })
    .limit(1);

  return lastSection ? lastSection.order + 1 : 1;
};
