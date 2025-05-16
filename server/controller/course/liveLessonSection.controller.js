import mongoose from "mongoose";
import { CourseSection } from "../../models/courseSection.model.js";
import { Course } from "../../models/course.model.js";
import { User } from "../../models/user.model.js";

/**
 * Add a live lesson to a course section
 * @route POST /api/courses/:courseId/sections/:sectionId/live-lessons
 * @access Instructor or Admin only
 */
export const addLiveLessonToSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { 
      title, 
      description, 
      scheduledAt, 
      duration, 
      platform, 
      meetingLink, 
      maxParticipants 
    } = req.body;
    const creatorId = req.id;

    // Validate required fields
    if (!title || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Live lesson title and scheduled date are required"
      });
    }

    // Check if section exists
    const section = await CourseSection.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found"
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
    const user = await User.findById(creatorId);
    const isAuthorized = course.instructor.toString() === creatorId || user.role === "admin";
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You can only add live lessons to courses you instruct"
      });
    }

    // Create live lesson object
    const liveLesson = {
      title,
      description,
      scheduledAt: new Date(scheduledAt),
      duration: duration || 60,
      platform: platform || "Zoom",
      meetingLink,
      maxParticipants: maxParticipants || 20,
      instructor: creatorId,
      course: courseId,
      status: "scheduled"
    };

    // Add live lesson to section
    // Note: This is a placeholder. In a real implementation, you would create a LiveSession model
    // and add the ID to the section.liveLessons array
    section.liveLessons.push(liveLesson);
    await section.save();

    return res.status(201).json({
      success: true,
      liveLesson,
      message: "Live lesson added to section successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add live lesson to section"
    });
  }
};
