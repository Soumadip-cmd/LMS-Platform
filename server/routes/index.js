import express from "express";
import authRouter from "./auth/auth.route.js";
import userRouter from "./user/user.route.js";

const mainRouter = express.Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/users', userRouter);

export default mainRouter;