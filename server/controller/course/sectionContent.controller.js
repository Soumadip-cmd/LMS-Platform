import mongoose from "mongoose";
import { CourseSection } from "../../models/courseSection.model.js";
import { Course } from "../../models/course.model.js";
import { Lecture } from "../../models/lecture.model.js";
import { Quiz } from "../../models/quiz.model.js";
import { Assignment } from "../../models/assignment.model.js";
import { User } from "../../models/user.model.js";
import { uploadMedia } from "../../utils/cloudinary.js";

/**
 * Add a lesson to a course section
 * @route POST /api/courses/:courseId/sections/:sectionId/lessons
 * @access Instructor or Admin only
 */
export const addLessonToSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, content, videoUrl, videoPlaybackHours, videoPlaybackMinutes, videoPlaybackSeconds } = req.body;
    const creatorId = req.id;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Lesson title is required"
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
        message: "You can only add lessons to courses you instruct"
      });
    }

    // Calculate total duration in minutes
    const totalDurationMinutes = 
      (parseInt(videoPlaybackHours) || 0) * 60 + 
      (parseInt(videoPlaybackMinutes) || 0) + 
      (parseInt(videoPlaybackSeconds) || 0) / 60;

    // Create lesson object
    const lesson = new Lecture({
      lectureTitle: title,
      lectureContent: content,
      course: courseId,
      creator: creatorId,
      duration: totalDurationMinutes,
      videoUrl: videoUrl
    });

    // Handle file uploads if present
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadMedia(file.path);
        
        if (file.fieldname === 'featuredImage') {
          lesson.thumbnailUrl = result.secure_url;
        } else if (file.fieldname === 'videoFile') {
          lesson.videoUrl = result.secure_url;
        } else if (file.fieldname === 'exerciseFiles') {
          lesson.materials.push({
            title: file.originalname,
            url: result.secure_url,
            type: file.mimetype.startsWith('image') ? 'Image' : 
                  file.mimetype.startsWith('video') ? 'Video' : 
                  file.mimetype.startsWith('audio') ? 'Audio' : 
                  file.mimetype.includes('pdf') ? 'PDF' : 'Document',
            publicId: result.public_id
          });
        }
      }
    }

    // Save lesson
    await lesson.save();

    // Add lesson to section
    section.lessons.push(lesson._id);
    await section.save();

    // Add lesson to course
    course.lessons.push(lesson._id);
    await course.save();

    return res.status(201).json({
      success: true,
      lesson,
      message: "Lesson added to section successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add lesson to section"
    });
  }
};

/**
 * Add a quiz to a course section
 * @route POST /api/courses/:courseId/sections/:sectionId/quizzes
 * @access Instructor or Admin only
 */
export const addQuizToSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, description, timeLimit, passingScore, instructions } = req.body;
    const creatorId = req.id;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Quiz title is required"
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
        message: "You can only add quizzes to courses you instruct"
      });
    }

    // Create quiz object
    const quiz = new Quiz({
      title,
      description,
      course: courseId,
      timeLimit: timeLimit || 30,
      passingScore: passingScore || 70,
      instructions,
      creator: creatorId,
      status: "draft"
    });

    // Save quiz
    await quiz.save();

    // Add quiz to section
    section.quizzes.push(quiz._id);
    await section.save();

    // Add quiz to course
    course.quizzes.push(quiz._id);
    await course.save();

    return res.status(201).json({
      success: true,
      quiz,
      message: "Quiz added to section successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add quiz to section"
    });
  }
};

/**
 * Add an assignment to a course section
 * @route POST /api/courses/:courseId/sections/:sectionId/assignments
 * @access Instructor or Admin only
 */
export const addAssignmentToSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, description, dueDate, timeLimit, maxScore, allowLateSubmissions, latePenalty } = req.body;
    const creatorId = req.id;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Assignment title and description are required"
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
        message: "You can only add assignments to courses you instruct"
      });
    }

    // Create assignment object
    const assignment = new Assignment({
      title,
      description,
      course: courseId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      timeLimit: timeLimit ? { value: timeLimit, unit: "Days" } : undefined,
      maxScore: maxScore || 100,
      creator: creatorId,
      allowLateSubmissions: allowLateSubmissions !== undefined ? allowLateSubmissions : true,
      latePenalty: latePenalty || 0,
      status: "draft"
    });

    // Handle file uploads if present
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadMedia(file.path);
        
        assignment.attachments.push({
          title: file.originalname,
          fileUrl: result.secure_url,
          fileType: file.mimetype,
          publicId: result.public_id
        });
      }
    }

    // Save assignment
    await assignment.save();

    // Add assignment to section
    section.assignments.push(assignment._id);
    await section.save();

    // Add assignment to course
    course.assignments.push(assignment._id);
    await course.save();

    return res.status(201).json({
      success: true,
      assignment,
      message: "Assignment added to section successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add assignment to section"
    });
  }
};
