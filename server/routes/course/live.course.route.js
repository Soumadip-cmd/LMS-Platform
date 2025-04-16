import express from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";
import { upload } from "../../middlewares/multer.js";
import {
    createCourseBatch,
    updateCourseBatch,
    scheduleLiveSession,
    updateLiveSession,
    cancelLiveSession,
    getUpcomingLiveSessions,
    getPastLiveSessions,
    joinLiveSession,
    leaveLiveSession,
    enrollInCourseBatch,
    getLiveSessionAnalytics,
    addSessionRecording,
    updateLiveCourseSettings
} from "../../controller/course/live.course.controller.js";

const LiveCourserouter = express.Router();

// Course batch routes
LiveCourserouter.post("/courses/:courseId/batches", isAuthenticated, createCourseBatch);
LiveCourserouter.patch("/courses/:courseId/batches/:batchId", isAuthenticated, updateCourseBatch);
LiveCourserouter.post("/courses/:courseId/batches/:batchId/enroll", isAuthenticated, enrollInCourseBatch);

// Live session routes
LiveCourserouter.post("/sessions", isAuthenticated,upload.array('materials'), scheduleLiveSession);
LiveCourserouter.patch("/sessions/:sessionId", isAuthenticated, updateLiveSession);
LiveCourserouter.patch("/sessions/:sessionId/cancel", isAuthenticated, cancelLiveSession);
LiveCourserouter.post("/sessions/:sessionId/recording", isAuthenticated, addSessionRecording);

// Live session participation routes
LiveCourserouter.post("/sessions/:sessionId/join", isAuthenticated, joinLiveSession);
LiveCourserouter.post("/sessions/:sessionId/leave", isAuthenticated, leaveLiveSession);

// Session listing routes
LiveCourserouter.get("/courses/:courseId/upcoming-sessions", isAuthenticated, getUpcomingLiveSessions);
LiveCourserouter.get("/courses/:courseId/past-sessions", isAuthenticated, getPastLiveSessions);

// Analytics routes
LiveCourserouter.get("/courses/:courseId/live-analytics", isAuthenticated, getLiveSessionAnalytics);

// Live course settings
LiveCourserouter.patch("/courses/:courseId/live-settings", isAuthenticated, updateLiveCourseSettings);

export default LiveCourserouter;