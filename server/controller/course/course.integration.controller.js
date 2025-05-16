import mongoose from "mongoose";
import { Course } from "../../models/course.model.js";
import { Quiz } from "../../models/quiz.model.js";
import { Assignment } from "../../models/assignment.model.js";
import { User } from "../../models/user.model.js";

/**
 * Add a quiz to a course
 * @route POST /api/courses/:courseId/quizzes
 * @access Private (Instructor or Admin only)
 */
const addQuizToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { quizId } = req.body;
    const userId = req.id;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course or quiz ID"
      });
    }

    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Find quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    // Check authorization
    const user = await User.findById(userId);
    const isAdmin = user.role === "admin";
    const isInstructor = course.instructor.toString() === userId;

    if (!isAdmin && !isInstructor) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this course"
      });
    }

    // Check if quiz is already in course
    if (course.quizzes.includes(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Quiz is already added to this course"
      });
    }

    // Add quiz to course
    course.quizzes.push(quizId);
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Quiz added to course successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add quiz to course"
    });
  }
};

/**
 * Remove a quiz from a course
 * @route DELETE /api/courses/:courseId/quizzes/:quizId
 * @access Private (Instructor or Admin only)
 */
const removeQuizFromCourse = async (req, res) => {
  try {
    const { courseId, quizId } = req.params;
    const userId = req.id;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course or quiz ID"
      });
    }

    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Check authorization
    const user = await User.findById(userId);
    const isAdmin = user.role === "admin";
    const isInstructor = course.instructor.toString() === userId;

    if (!isAdmin && !isInstructor) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this course"
      });
    }

    // Check if quiz is in course
    if (!course.quizzes.includes(quizId)) {
      return res.status(400).json({
        success: false,
        message: "Quiz is not part of this course"
      });
    }

    // Remove quiz from course
    course.quizzes = course.quizzes.filter(id => id.toString() !== quizId);
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Quiz removed from course successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove quiz from course"
    });
  }
};

/**
 * Add an assignment to a course
 * @route POST /api/courses/:courseId/assignments
 * @access Private (Instructor or Admin only)
 */
const addAssignmentToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { assignmentId } = req.body;
    const userId = req.id;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course or assignment ID"
      });
    }

    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
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

    // Check authorization
    const user = await User.findById(userId);
    const isAdmin = user.role === "admin";
    const isInstructor = course.instructor.toString() === userId;

    if (!isAdmin && !isInstructor) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this course"
      });
    }

    // Check if assignment is already in course
    if (course.assignments.includes(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Assignment is already added to this course"
      });
    }

    // Add assignment to course
    course.assignments.push(assignmentId);
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Assignment added to course successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add assignment to course"
    });
  }
};

/**
 * Remove an assignment from a course
 * @route DELETE /api/courses/:courseId/assignments/:assignmentId
 * @access Private (Instructor or Admin only)
 */
const removeAssignmentFromCourse = async (req, res) => {
  try {
    const { courseId, assignmentId } = req.params;
    const userId = req.id;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course or assignment ID"
      });
    }

    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Check authorization
    const user = await User.findById(userId);
    const isAdmin = user.role === "admin";
    const isInstructor = course.instructor.toString() === userId;

    if (!isAdmin && !isInstructor) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this course"
      });
    }

    // Check if assignment is in course
    if (!course.assignments.includes(assignmentId)) {
      return res.status(400).json({
        success: false,
        message: "Assignment is not part of this course"
      });
    }

    // Remove assignment from course
    course.assignments = course.assignments.filter(id => id.toString() !== assignmentId);
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Assignment removed from course successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove assignment from course"
    });
  }
};

export {
  addQuizToCourse,
  removeQuizFromCourse,
  addAssignmentToCourse,
  removeAssignmentFromCourse
};
