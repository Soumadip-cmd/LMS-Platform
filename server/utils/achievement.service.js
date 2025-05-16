import { Achievement, UserAchievement } from "../models/achievement.model.js";
import { CourseProgress } from "../models/courseprogress.model.js";
import { User } from "../models/user.model.js";
import { sendAchievementNotification } from "../socket/socket.js";

/**
 * Check and award achievements to a user based on their activity
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - Array of newly awarded achievements
 */
export const checkAndAwardAchievements = async (userId) => {
  try {
    // Get all achievements that are active
    const allAchievements = await Achievement.find({ isActive: true });
    
    // Get user's existing achievements
    const existingAchievements = await UserAchievement.find({ userId })
      .populate('achievementId')
      .lean();
    
    // Create a set of achievement IDs the user already has
    const existingAchievementIds = new Set(
      existingAchievements.map(ua => ua.achievementId._id.toString())
    );
    
    // Filter out achievements the user already has
    const eligibleAchievements = allAchievements.filter(
      achievement => !existingAchievementIds.has(achievement._id.toString())
    );
    
    if (eligibleAchievements.length === 0) {
      return []; // No new achievements to check
    }
    
    // Get user data needed for achievement checks
    const user = await User.findById(userId);
    const courseProgress = await CourseProgress.find({ userId });
    
    // Array to store newly awarded achievements
    const newAchievements = [];
    
    // Check each eligible achievement
    for (const achievement of eligibleAchievements) {
      let isEarned = false;
      
      switch (achievement.criteria) {
        case "FIRST_COURSE":
          // Check if user has started at least one course
          isEarned = courseProgress.length >= achievement.threshold;
          break;
          
        case "COURSE_COMPLETION":
          // Check if user has completed courses
          const completedCourses = courseProgress.filter(cp => cp.completed).length;
          isEarned = completedCourses >= achievement.threshold;
          break;
          
        case "STREAK":
          // This would require tracking daily logins, which we'd implement separately
          // For now, we'll skip this check
          break;
          
        case "MULTIPLE_COURSES":
          // Check if user is enrolled in multiple courses
          isEarned = courseProgress.length >= achievement.threshold;
          break;
          
        case "QUIZ_SCORE":
          // This would require checking quiz scores, which we'd implement separately
          // For now, we'll skip this check
          break;
          
        case "STUDY_TIME":
          // Check total study time across all courses (in hours)
          const totalStudySeconds = courseProgress.reduce(
            (total, cp) => total + (cp.studyTime || 0), 0
          );
          const studyHours = totalStudySeconds / 3600;
          isEarned = studyHours >= achievement.threshold;
          break;
          
        case "ASSIGNMENT_COMPLETION":
          // This would require checking assignment completions, which we'd implement separately
          // For now, we'll skip this check
          break;
      }
      
      // If achievement is earned, award it to the user
      if (isEarned) {
        const userAchievement = await UserAchievement.create({
          userId,
          achievementId: achievement._id,
          earnedAt: new Date(),
          notified: false
        });
        
        // Add to new achievements list
        newAchievements.push(achievement);
        
        // Send notification if socket functions are available
        if (typeof sendAchievementNotification === 'function') {
          sendAchievementNotification(userId, {
            title: "New Achievement Unlocked!",
            message: `Congratulations! You've earned the "${achievement.title}" achievement.`,
            achievementId: achievement._id,
            icon: achievement.icon
          });
        }
      }
    }
    
    return newAchievements;
  } catch (error) {
    console.error("Error checking achievements:", error);
    return [];
  }
};
