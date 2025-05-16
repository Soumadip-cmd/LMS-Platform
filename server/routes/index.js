import express from "express";
import authRouter from "./auth/auth.route.js";
import userRouter from "./user/user.route.js";
import adminRouter from "./admin/admin.route.js";
import languageRouter from "./language/language.route.js";
import blogRouter from "./blog/blog.route.js";
import Socialrouter from "./auth/social.route.js";
import courseRouter from "./course/course.route.js";
import courseSectionRouter from "./course/courseSection.route.js";
import Lecturerouter from "./lectures/lecture.route.js";
import courseProgressRouter from "./progress/course-progress.route.js";
import Mockrouter from "./mock-exam/mock-exam.route.js";
import studySessionRouter from "./progress/studySession.routes.js";
import LiveCourserouter from "./course/live.course.route.js";
import contactRouter from "./contact-us/contact.routes.js";
import assignmentRouter from "./assignment/assignment.route.js";
import quizRouter from "./quiz/quiz.route.js";
const mainRouter = express.Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/social',Socialrouter)
mainRouter.use('/users', userRouter);
mainRouter.use('/admin', adminRouter);
mainRouter.use('/languages', languageRouter);
mainRouter.use('/courses',courseRouter)
mainRouter.use('/courses',courseSectionRouter)
mainRouter.use('/live-course', LiveCourserouter);
mainRouter.use('/lectures',Lecturerouter)
mainRouter.use('/progress',courseProgressRouter)
mainRouter.use('/mock',Mockrouter)
mainRouter.use('/study-session', studySessionRouter);
mainRouter.use("/contact",contactRouter);
mainRouter.use("/blog",blogRouter);
mainRouter.use("/assignments", assignmentRouter);
mainRouter.use("/quizzes", quizRouter);
export default mainRouter;