import express from "express";
import authRouter from "./auth/auth.route.js";
import userRouter from "./user/user.route.js";
import adminRouter from "./admin/admin.route.js";
import languageRouter from "./language/language.route.js";

import Socialrouter from "./auth/social.route.js";
import courseRouter from "./course/course.route.js";
import Lecturerouter from "./lectures/lecture.route.js";
const mainRouter = express.Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/social',Socialrouter)
mainRouter.use('/users', userRouter);
mainRouter.use('/admin', adminRouter);
mainRouter.use('/languages', languageRouter);
mainRouter.use('/courses',courseRouter)
mainRouter.use('/lectures',Lecturerouter)
export default mainRouter;