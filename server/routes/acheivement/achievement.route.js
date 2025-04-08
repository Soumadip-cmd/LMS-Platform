import express from 'express';
import { isAuthenticated, isAdmin, isStudent } from "../../middlewares/isAuthenticated.js";
import { 
  getAllAchievements, 
  getUserAchievements,
  getUserAchievementsProgress,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  initializeAchievements,
  checkUserAchievements
} from "../../controller/achievement/achievement.controller.js";

const achievementRouter = express.Router();

// Public routes
achievementRouter.get('/all', getAllAchievements);

// Authenticated routes
achievementRouter.get('/user', isAuthenticated, getUserAchievements);
achievementRouter.get('/user/progress', isAuthenticated, getUserAchievementsProgress);
achievementRouter.post('/check', isAuthenticated, checkUserAchievements);

// Admin routes
achievementRouter.post('/create', isAuthenticated, isAdmin, createAchievement);
achievementRouter.put('/update/:id', isAuthenticated, isAdmin, updateAchievement);
achievementRouter.delete('/delete/:id', isAuthenticated, isAdmin, deleteAchievement);
achievementRouter.post('/initialize', isAuthenticated, isAdmin, initializeAchievements);

export default achievementRouter;