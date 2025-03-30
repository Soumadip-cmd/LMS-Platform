import express from 'express';
import { 

  getUserProfile,
  updateProfile,
  addToWishlist,
  removeFromWishlist,
  submitFeedback,
  getPurchaseHistory,
  becomeInstructor,
  getExamHistory,
 
  updateLearningPreferences
} from '../../controller/auth/user.controller.js';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';

const userRouter = express.Router();



// Protected routes

//get user profile
userRouter.get('/profile', isAuthenticated, getUserProfile);

//update user profile

userRouter.put('/profile-update', isAuthenticated, updateProfile);

//add to wish list
userRouter.post('/add-wishlist', isAuthenticated, addToWishlist);

//delete from wishlist
userRouter.delete('/delete-wishlist/:courseId', isAuthenticated, removeFromWishlist);

//submit feedback
userRouter.post('/add-feedback', isAuthenticated, submitFeedback);

//get purchase history
userRouter.get('/purchases-history', isAuthenticated, getPurchaseHistory);

//instructor apply
userRouter.post('/become-instructor', isAuthenticated, becomeInstructor);

//exam history get
userRouter.get('/exam-history', isAuthenticated, getExamHistory);



//learning preferance
userRouter.put('/learning-preferences', isAuthenticated, updateLearningPreferences);


export default userRouter;