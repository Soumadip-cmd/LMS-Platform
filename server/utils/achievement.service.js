import { Achievement, UserAchievement } from "../models/achievement.model.js";
import { CourseProgress } from "../models/courseprogress.model.js";
import { sendAchievementNotification } from "../socket/socket.js";


export const checkAndAwardAchievements = async (userId) => {
  try {
    // Get all achievements
    const allAchievements = await Achievement.find();
    
    // Get user's current achievements
    const userAchievements = await UserAchievement.find({ userId });
    const earnedAchievementIds = userAchievements.map(ua => ua.achievementId.toString());
    
    // Check each achievement that hasn't been earned yet
    const newAchievements = [];
    
    for (const achievement of allAchievements) {
      // Skip if already earned
      if (earnedAchievementIds.includes(achievement._id.toString())) {
        continue;
      }
      
      let achieved = false;
      
      // Check different criteria
      switch (achievement.criteria) {
        case "COURSE_COMPLETION":
          // Check if any course has been completed
          const completedCourses = await CourseProgress.countDocuments({ 
            userId, 
            completed: true 
          });
          achieved = completedCourses >= achievement.threshold;
          break;
          
        case "MULTIPLE_COURSES":
          // Check if user has completed multiple courses
          const multipleCompletions = await CourseProgress.countDocuments({ 
            userId, 
            completed: true 
          });
          achieved = multipleCompletions >= achievement.threshold;
          break;
          
        case "STUDY_TIME":
          // Check total study time
          const progressRecords = await CourseProgress.find({ userId });
          const totalStudyTime = progressRecords.reduce((total, record) => {
            return total + (record.studyTime || 0);
          }, 0);
          // If threshold is in hours, convert seconds to hours
          achieved = (totalStudyTime / 3600) >= achievement.threshold;
          break;
          
        case "FIRST_COURSE":
          // Check if user has started at least one course
          const startedCourses = await CourseProgress.countDocuments({ userId });
          achieved = startedCourses >= achievement.threshold;
          break;
          
        
      }
      
      // Award the achievement if criteria met
      if (achieved) {
        const userAchievement = new UserAchievement({
          userId,
          achievementId: achievement._id
        });
        
        await userAchievement.save();
        newAchievements.push(achievement);
        
        // Send notification
        const notification = {
          title: "Achievement Unlocked!",
          message: `You've earned: ${achievement.title}`,
          achievementId: achievement._id
        };
        
        await sendAchievementNotification(userId, notification);
      }
    }
    
    return newAchievements;
  } catch (error) {
    console.error("Error checking achievements:", error);
    return [];
  }
};

export const getUserAchievementsWithProgress = async (userId) => {
    try {
      // Get all achievements
      const allAchievements = await Achievement.find();
      
      // Get user's earned achievements
      const userAchievements = await UserAchievement.find({ userId }).populate('achievementId');
      const earnedAchievementIds = userAchievements.map(ua => ua.achievementId._id.toString());
      
      // Get user's course progress data for calculating achievement progress
      const userCourseProgress = await CourseProgress.find({ userId });
      
      // Calculate total study time
      const totalStudyTime = userCourseProgress.reduce((total, progress) => {
        return total + (progress.studyTime || 0);
      }, 0);
      
      // Count completed courses
      const completedCourses = userCourseProgress.filter(progress => progress.completed).length;
      
      // Format achievements with progress
      const achievementsWithProgress = allAchievements.map(achievement => {
        // Check if achievement is earned
        const isEarned = earnedAchievementIds.includes(achievement._id.toString());
        const earnedData = userAchievements.find(ua => 
          ua.achievementId._id.toString() === achievement._id.toString()
        );
        
        // Calculate progress based on criteria
        let progress = 0;
        let currentValue = 0;
        
        switch (achievement.criteria) {
          case "COURSE_COMPLETION":
          case "MULTIPLE_COURSES":
            currentValue = completedCourses;
            progress = Math.min(100, Math.round((completedCourses / achievement.threshold) * 100));
            break;
            
          case "STUDY_TIME":
            // Convert seconds to hours
            currentValue = Math.round(totalStudyTime / 3600);
            progress = Math.min(100, Math.round((currentValue / achievement.threshold) * 100));
            break;
            
          case "FIRST_COURSE":
            currentValue = userCourseProgress.length;
            progress = Math.min(100, Math.round((currentValue / achievement.threshold) * 100));
            break;
            
          default:
            progress = isEarned ? 100 : 0;
        }
        
        return {
          id: achievement._id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          criteria: achievement.criteria,
          threshold: achievement.threshold,
          earnedAt: isEarned ? earnedData.earnedAt : null,
          earned: isEarned,
          progress: isEarned ? 100 : progress,
          currentValue
        };
      });
      
      return achievementsWithProgress;
    } catch (error) {
      console.error("Error getting achievements with progress:", error);
      return [];
    }
  };
  
  // for initializing default achievements
  export const initializeDefaultAchievements = async () => {
    try {
      const defaultAchievements = [
        {
          title: "First Steps",
          description: "Enroll in your first course",
          icon: "🏁",
          criteria: "FIRST_COURSE",
          threshold: 1
        },
        {
          title: "Course Graduate",
          description: "Complete your first course",
          icon: "🎓",
          criteria: "COURSE_COMPLETION",
          threshold: 1
        },
        {
          title: "Learning Enthusiast",
          description: "Complete 5 courses",
          icon: "🌟",
          criteria: "MULTIPLE_COURSES",
          threshold: 5
        },
        {
          title: "Study Warrior",
          description: "Study for a total of 10 hours",
          icon: "⏱️",
          criteria: "STUDY_TIME",
          threshold: 10
        },
        {
          title: "Study Master",
          description: "Study for a total of 50 hours",
          icon: "🕰️",
          criteria: "STUDY_TIME",
          threshold: 50
        },
        {
          title: "Learning Champion",
          description: "Complete 10 courses",
          icon: "🏆",
          criteria: "MULTIPLE_COURSES",
          threshold: 10
        }
      ];
      
      // Check if achievements already exist
      const existingCount = await Achievement.countDocuments();
      
      if (existingCount === 0) {
        // Create all default achievements
        await Achievement.insertMany(defaultAchievements);
        console.log("Default achievements initialized");
      }
    } catch (error) {
      console.error("Error initializing default achievements:", error);
    }
  };