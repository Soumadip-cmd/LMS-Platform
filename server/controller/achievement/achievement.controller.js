import { Achievement, UserAchievement } from "../../models/achievement.model.js";
import mongoose from "mongoose";
import { checkAndAwardAchievements, getUserAchievementsWithProgress, initializeDefaultAchievements } from "../../utils/achievement.service.js";

// Get all achievements
export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find();
    
    return res.status(200).json({
      success: true,
      achievements
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch achievements"
    });
  }
};

// Get user's achievements
export const getUserAchievements = async (req, res) => {
  try {
    const userId = req.id;
    
    const userAchievements = await UserAchievement.find({ userId })
      .populate('achievementId');
    
    // Format the response
    const achievements = userAchievements.map(ua => ({
      id: ua.achievementId._id,
      title: ua.achievementId.title,
      description: ua.achievementId.description,
      icon: ua.achievementId.icon,
      earnedAt: ua.earnedAt
    }));
    
    return res.status(200).json({
      success: true,
      achievements
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user achievements"
    });
  }
};

// Get user's achievements with progress
export const getUserAchievementsProgress = async (req, res) => {
  try {
    const userId = req.id;
    
    const achievementsWithProgress = await getUserAchievementsWithProgress(userId);
    
    return res.status(200).json({
      success: true,
      achievements: achievementsWithProgress
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user achievements with progress"
    });
  }
};

// Create new achievement (admin only)
export const createAchievement = async (req, res) => {
  try {
    const { title, description, icon, criteria, threshold } = req.body;
    
    const achievement = new Achievement({
      title,
      description,
      icon,
      criteria,
      threshold
    });
    
    await achievement.save();
    
    return res.status(201).json({
      success: true,
      achievement
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create achievement"
    });
  }
};

// Update achievement (admin only)
export const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon, criteria, threshold } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid achievement ID"
      });
    }
    
    const achievement = await Achievement.findByIdAndUpdate(
      id,
      { title, description, icon, criteria, threshold },
      { new: true }
    );
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      achievement
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update achievement"
    });
  }
};

// Delete achievement (admin only)
export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid achievement ID"
      });
    }
    
    const achievement = await Achievement.findByIdAndDelete(id);
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found"
      });
    }
    
    // Also delete all user achievements for this achievement
    await UserAchievement.deleteMany({ achievementId: id });
    
    return res.status(200).json({
      success: true,
      message: "Achievement deleted successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete achievement"
    });
  }
};

// Initialize default achievements (admin only)
export const initializeAchievements = async (req, res) => {
  try {
    await initializeDefaultAchievements();
    
    return res.status(200).json({
      success: true,
      message: "Default achievements initialized successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to initialize default achievements"
    });
  }
};

// Manually check achievements for a user (for testing)
export const checkUserAchievements = async (req, res) => {
  try {
    const userId = req.id;
    
    const newAchievements = await checkAndAwardAchievements(userId);
    
    return res.status(200).json({
      success: true,
      message: "Achievements checked successfully",
      newAchievements: newAchievements.map(a => ({
        title: a.title,
        description: a.description
      }))
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to check achievements"
    });
  }
};