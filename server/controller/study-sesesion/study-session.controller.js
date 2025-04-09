import { CourseProgress } from "../../models/courseprogress.model.js";

import mongoose from "mongoose";

// Get study time stats for a specific course
export const getStudyTimeStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    
    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID"
      });
    }
    
    const courseProgress = await CourseProgress.findOne({ userId, courseId });
    
    if (!courseProgress) {
      return res.status(200).json({
        success: true,
        data: {
          totalStudyTime: 0,
          sessions: []
        }
      });
    }
    
    // Get total study time in hours
    const totalStudyTimeHours = (courseProgress.studyTime || 0) / 3600;
    
    // Get recent sessions (limited to last 10)
    const recentSessions = courseProgress.studySessions
      .slice(-10)
      .map(session => ({
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        // Convert duration to hours for frontend
        durationHours: session.duration / 3600
      }));
    
    return res.status(200).json({
      success: true,
      data: {
        totalStudyTime: Math.round(totalStudyTimeHours * 100) / 100, // Round to 2 decimal places
        sessions: recentSessions
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch study time statistics"
    });
  }
};

// Get all study sessions for all courses
export const getAllStudySessions = async (req, res) => {
  try {
    const userId = req.id;
    
    const allProgress = await CourseProgress.find({ userId })
      .populate({
        path: "courseId",
        select: "title thumbnailUrl"
      })
      .select("courseId studyTime studySessions");
    
    // Calculate total study time across all courses
    const totalStudyTime = allProgress.reduce((total, progress) => {
      return total + (progress.studyTime || 0);
    }, 0);
    
    // Format the response
    const courseStudyData = allProgress.map(progress => {
      const course = progress.courseId;
      
      // Get the last 5 sessions for this course
      const recentSessions = progress.studySessions
        .slice(-5)
        .map(session => ({
          startTime: session.startTime,
          endTime: session.endTime,
          duration: session.duration,
          durationHours: session.duration / 3600
        }));
      
      return {
        courseId: course?._id || progress.courseId,
        title: course?.title || "Unknown Course",
        thumbnailUrl: course?.thumbnailUrl,
        totalStudyTime: progress.studyTime || 0,
        totalStudyTimeHours: Math.round(((progress.studyTime || 0) / 3600) * 100) / 100,
        totalSessions: progress.studySessions.length,
        recentSessions
      };
    });
    
    return res.status(200).json({
      success: true,
      data: {
        totalStudyTime,
        totalStudyTimeHours: Math.round((totalStudyTime / 3600) * 100) / 100,
        courses: courseStudyData
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all study sessions"
    });
  }
};

export const recordStudyTime = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { duration, requestId } = req.body;
    const userId = req.id;
    
    console.log(`Recording study time - courseId: ${courseId}, userId: ${userId}, duration: ${duration}, requestId: ${requestId}`);
    
    // Validate input
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID"
      });
    }
    
    const durationNum = Number(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid duration"
      });
    }
    
    // Find or create course progress
    let courseProgress = await CourseProgress.findOne({ userId, courseId });
    
    // Store the original study time for logging
    const originalStudyTime = courseProgress ? courseProgress.studyTime || 0 : 0;
    
    // Check if this exact request was already processed (prevents duplicates)
    if (requestId && courseProgress && courseProgress.processedRequests 
        && courseProgress.processedRequests.includes(requestId)) {
      console.log(`Request already processed - requestId: ${requestId}, studyTime: ${courseProgress.studyTime}`);
      return res.status(200).json({
        success: true,
        message: "Study time already recorded",
        data: {
          totalStudyTime: courseProgress.studyTime,
          newAchievements: []
        }
      });
    }
    
    const now = new Date();
    const startTime = new Date(now.getTime() - (durationNum * 1000));

    if (!courseProgress) {
      console.log(`Creating new course progress for user: ${userId}, course: ${courseId}`);
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
        lastAccessedAt: now,
        studyTime: durationNum,
        studySessions: [{
          startTime,
          endTime: now,
          duration: durationNum
        }],
        processedRequests: requestId ? [requestId] : []
      });
    } else {
      console.log(`Updating existing course progress - current studyTime: ${courseProgress.studyTime}`);
      courseProgress.lastAccessedAt = now;
      courseProgress.studyTime = (courseProgress.studyTime || 0) + durationNum;
      courseProgress.studySessions.push({
        startTime,
        endTime: now,
        duration: durationNum
      });
      
      // Add the request ID to processed requests
      if (requestId) {
        if (!courseProgress.processedRequests) {
          courseProgress.processedRequests = [];
        }
        courseProgress.processedRequests.push(requestId);
        
        // Limit size of processed requests array
        if (courseProgress.processedRequests.length > 100) {
          courseProgress.processedRequests = courseProgress.processedRequests.slice(-100);
        }
      }
    }
    
    console.log(`Saving study time - previous: ${originalStudyTime}, new: ${courseProgress.studyTime}, diff: ${courseProgress.studyTime - originalStudyTime}`);
    
    await courseProgress.save();
    console.log(`Course progress saved successfully - final studyTime: ${courseProgress.studyTime}`);
    
    // Check for new achievements
    const newAchievements = await checkAndAwardAchievements(userId);
    
    if (newAchievements.length > 0) {
      console.log(`User earned ${newAchievements.length} new achievements: ${newAchievements.map(a => a.title).join(', ')}`);
    }
    
    return res.status(200).json({
      success: true,
      message: "Study time recorded successfully",
      data: {
        totalStudyTime: courseProgress.studyTime,
        newAchievements: newAchievements.map(a => ({ 
          title: a.title, 
          description: a.description 
        }))
      }
    });
  } catch (error) {
    console.error("Error recording study time:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to record study time"
    });
  }
};

// Get study time summary (for dashboard)
export const getStudyTimeSummary = async (req, res) => {
  try {
    const userId = req.id;
    
    // Get all course progress
    const allProgress = await CourseProgress.find({ userId });
    
    // Calculate total study time
    const totalStudyTime = allProgress.reduce((total, progress) => {
      return total + (progress.studyTime || 0);
    }, 0);
    
    // Calculate daily study time for the last 7 days
    const now = new Date();
    const dailyStudyTime = Array(7).fill(0);
    const dayLabels = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      
      // Format date for labels (e.g., "Mon", "Tue")
      dayLabels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      
      // Find sessions that occurred on this day
      allProgress.forEach(progress => {
        progress.studySessions.forEach(session => {
          if (session.startTime >= date && session.startTime < nextDate) {
            dailyStudyTime[6 - i] += session.duration;
          }
        });
      });
    }
    
    // Convert seconds to hours
    const dailyStudyTimeHours = dailyStudyTime.map(seconds => 
      Math.round((seconds / 3600) * 100) / 100
    );
    
    return res.status(200).json({
      success: true,
      data: {
        totalStudyTime,
        totalStudyTimeHours: Math.round((totalStudyTime / 3600) * 100) / 100,
        dailyStudyTime: dailyStudyTimeHours,
        dayLabels
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch study time summary"
    });
  }
};