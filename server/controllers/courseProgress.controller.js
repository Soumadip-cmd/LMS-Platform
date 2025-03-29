import mongoose from "mongoose";
import { CourseProgress } from "../models/courseprogress.model.js";
import { Course } from "../models/course.model.js";

/**
 * Get user's progress for a specific course
 * @route GET /api/progress/:courseId
 * @access Private
 */
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Validate courseId format
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID"
      });
    }

    // Step 1: Fetch the course details
    const courseDetails = await Course.findById(courseId)
      .populate("lessons")
      .select("title description level language thumbnailUrl");

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Step 2: Fetch the user's course progress
    const courseProgress = await CourseProgress.findOne({
      courseId,
      userId
    });

    // Update last accessed timestamp if progress exists
    if (courseProgress) {
      courseProgress.lastAccessedAt = new Date();
      await courseProgress.save();
    }

    // Step 3: Return appropriate response based on progress status
    if (!courseProgress) {
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          progress: [],
          completed: false,
          lastAccessedAt: null
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
        lastAccessedAt: courseProgress.lastAccessedAt
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course progress"
    });
  }
};

/**
 * Update progress for a specific lecture
 * @route PUT /api/progress/:courseId/:lectureId
 * @access Private
 */
export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // Validate parameters
    if (!courseId || !lectureId || !mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID or lecture ID"
      });
    }

    // Step 1: Verify course and lecture existence
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const isLectureInCourse = course.lessons.some(lesson => lesson.toString() === lectureId);
    if (!isLectureInCourse) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found in this course"
      });
    }

    // Step 2: Fetch or create course progress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      // If no progress exists, create a new record
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
        lastAccessedAt: new Date()
      });
    } else {
      // Update last accessed timestamp
      courseProgress.lastAccessedAt = new Date();
    }

    // Step 3: Update lecture progress
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      lecture => lecture.lectureId.toString() === lectureId
    );

    const currentTime = new Date();

    if (lectureIndex !== -1) {
      // If lecture already exists, update its status
      courseProgress.lectureProgress[lectureIndex].viewed = true;
      
      // Only update completedAt if it was not viewed before
      if (!courseProgress.lectureProgress[lectureIndex].completedAt) {
        courseProgress.lectureProgress[lectureIndex].completedAt = currentTime;
      }
    } else {
      // Add new lecture progress
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
        completedAt: currentTime
      });
    }

    // Step 4: Check if all lectures are completed
    const totalLectures = course.lessons.length;
    const completedLectures = courseProgress.lectureProgress.filter(
      lectureProg => lectureProg.viewed
    ).length;

    courseProgress.completed = totalLectures === completedLectures;

    // Step 5: Save progress
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Lecture progress updated successfully",
      data: {
        completedLectures,
        totalLectures,
        isCompleted: courseProgress.completed,
        lastAccessedAt: courseProgress.lastAccessedAt
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lecture progress"
    });
  }
};

/**
 * Mark entire course as completed
 * @route PUT /api/progress/:courseId/complete
 * @access Private
 */
export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Validate courseId
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID"
      });
    }

    // Step 1: Verify course existence
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Step 2: Find or create progress record
    let courseProgress = await CourseProgress.findOne({ courseId, userId });
    
    const currentTime = new Date();
    
    if (!courseProgress) {
      // Create new progress record with all lectures marked as viewed
      const lectureProgress = course.lessons.map(lectureId => ({
        lectureId,
        viewed: true,
        completedAt: currentTime
      }));

      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: true,
        lectureProgress,
        lastAccessedAt: currentTime
      });
    } else {
      // Update existing progress record
      courseProgress.lastAccessedAt = currentTime;
      
      // Update all existing lecture progress
      courseProgress.lectureProgress.forEach(progress => {
        progress.viewed = true;
        if (!progress.completedAt) {
          progress.completedAt = currentTime;
        }
      });
      
      // Add any missing lectures
      const existingLectureIds = courseProgress.lectureProgress.map(
        lecture => lecture.lectureId.toString()
      );
      
      course.lessons.forEach(lectureId => {
        if (!existingLectureIds.includes(lectureId.toString())) {
          courseProgress.lectureProgress.push({
            lectureId,
            viewed: true,
            completedAt: currentTime
          });
        }
      });
      
      courseProgress.completed = true;
    }

    await courseProgress.save();
    
    return res.status(200).json({
      success: true,
      message: "Course marked as completed",
      lastAccessedAt: courseProgress.lastAccessedAt
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark course as completed"
    });
  }
};

/**
 * Mark entire course as incomplete
 * @route PUT /api/progress/:courseId/incomplete
 * @access Private
 */
export const markAsIncomplete = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Validate courseId
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID"
      });
    }

    // Find course progress
    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    
    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found"
      });
    }

    // Update progress status
    courseProgress.lectureProgress.forEach(progress => {
      progress.viewed = false;
      // Keep the completedAt timestamp for historical tracking
    });
    
    courseProgress.completed = false;
    courseProgress.lastAccessedAt = new Date();
    
    await courseProgress.save();
    
    return res.status(200).json({
      success: true,
      message: "Course marked as incomplete",
      lastAccessedAt: courseProgress.lastAccessedAt
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark course as incomplete"
    });
  }
};

/**
 * Reset course progress
 * @route DELETE /api/progress/:courseId
 * @access Private
 */
export const resetCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Validate courseId
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID"
      });
    }

    // Delete progress record
    const result = await CourseProgress.findOneAndDelete({ courseId, userId });
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Course progress has been reset"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset course progress"
    });
  }
};

/**
 * Get user's progress for all enrolled courses
 * @route GET /api/progress
 * @access Private
 */
export const getAllCoursesProgress = async (req, res) => {
  try {
    const userId = req.id;
    
    // Get all course progress for the user
    const allProgress = await CourseProgress.find({ userId })
      .populate({
        path: "courseId",
        select: "title thumbnailUrl level"
      });
    
    if (!allProgress || allProgress.length === 0) {
      return res.status(200).json({
        success: true,
        progress: []
      });
    }
    
    // Format the response
    const progress = allProgress.map(item => ({
      courseId: item.courseId._id,
      title: item.courseId.title,
      thumbnailUrl: item.courseId.thumbnailUrl,
      level: item.courseId.level,
      completed: item.completed,
      completedLectures: item.lectureProgress.filter(lecture => lecture.viewed).length,
      lastAccessedAt: item.lastAccessedAt
    }));
    
    return res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all course progress"
    });
  }
};