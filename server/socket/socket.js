
// utils/socket.js
import { Server } from "socket.io";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
let io;
const userSocketMap = new Map(); // Maps userId to socketId
const studySessionMap = new Map(); // Maps userId to study session data
const blogRoomMap = new Map(); // Maps userId to blogId they're currently viewing
const blogTypingMap = new Map(); // Maps blogId to users currently typing
/**
 * Initialize Socket.IO server
 * @param {object} server - HTTP server instance
 */


export const sendAchievementNotification = async (userId, notification) => {
  try {
    // Save notification to database
    await Notification.create({
      recipient: userId,
      title: notification.title,
      message: notification.message,
      type: 'achievement',
      relatedAchievement: notification.achievementId
    });

    // Send real-time notification if user is online
    if (io && isUserOnline(userId)) {
      const achievementNotification = {
        ...notification,
        timestamp: new Date()
      };

      io.to(`user:${userId}`).emit("achievementNotification", achievementNotification);
      io.to(`user:${userId}`).emit("notification", achievementNotification);
    }
  } catch (error) {
    console.error("Error sending achievement notification:", error);
  }
};

export const initializeSocket = (server) => {
  // Configure CORS with multiple origins support
  const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',')
    : ['http://localhost:3000', 'https://preplings.com', 'https://www.preplings.com'];

  io = new Server(server, {
    cors: {
      origin: function(origin, callback) {
        // Allow requests with no origin
        if (!origin) return callback(null, true);

        // Log the origin for debugging
        console.log('Socket origin:', origin);

        // Check if the origin is in the allowed list
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
          callback(null, true);
        } else {
          // Special case for preplings.com domains
          if (origin.includes('preplings.com')) {
            console.log('Allowing preplings.com socket domain:', origin);
            callback(null, true);
          } else {
            // In development, allow all origins
            if (process.env.NODE_ENV !== 'production') {
              callback(null, true);
            } else {
              callback(new Error('Not allowed by CORS'));
            }
          }
        }
      },
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Accept', 'Origin', 'X-Requested-With']
    }
  });

  // Socket connection handling
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Handle user authentication
    socket.on("authenticate", async (userId) => {
      try {
        if (!userId) return;

        // Store socket mapping
        userSocketMap.set(userId, socket.id);
        socket.userId = userId;

        // Join user to their personal room
        socket.join(`user:${userId}`);

        // Update user's online status in database
        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          lastActive: new Date()
        });

        // Broadcast user's online status to all clients
        socket.broadcast.emit("userStatus", { userId, status: true });

        // Send currently online users to the newly connected user
        const onlineUsers = Array.from(userSocketMap.keys());
        socket.emit("onlineUsers", onlineUsers);

        console.log(`User ${userId} authenticated, online users: ${onlineUsers.length}`);
      } catch (error) {
        console.error("Socket authentication error:", error);
      }
    });



      // Blog-related socket handlers
    socket.on("joinBlog", (blogId) => {
      if (!socket.userId || !blogId) return;
      
      // Leave previous blog room if any
      const previousBlogId = blogRoomMap.get(socket.userId);
      if (previousBlogId) {
        socket.leave(`blog:${previousBlogId}`);
      }
      
      // Join new blog room
      socket.join(`blog:${blogId}`);
      blogRoomMap.set(socket.userId, blogId);
      
      console.log(`User ${socket.userId} joined blog ${blogId}`);
      
      // Notify others in the blog room
      socket.to(`blog:${blogId}`).emit("userJoinedBlog", {
        userId: socket.userId,
        blogId
      });
    });

    socket.on("leaveBlog", (blogId) => {
      if (!socket.userId || !blogId) return;
      
      socket.leave(`blog:${blogId}`);
      blogRoomMap.delete(socket.userId);
      
      console.log(`User ${socket.userId} left blog ${blogId}`);
      
      // Notify others in the blog room
      socket.to(`blog:${blogId}`).emit("userLeftBlog", {
        userId: socket.userId,
        blogId
      });
    });

    // Handle typing indicators for comments
    socket.on("commentTyping", ({ blogId, isTyping, username }) => {
      if (!socket.userId || !blogId) return;
      
      if (isTyping) {
        // Add user to typing list
        if (!blogTypingMap.has(blogId)) {
          blogTypingMap.set(blogId, new Set());
        }
        blogTypingMap.get(blogId).add(socket.userId);
      } else {
        // Remove user from typing list
        if (blogTypingMap.has(blogId)) {
          blogTypingMap.get(blogId).delete(socket.userId);
          if (blogTypingMap.get(blogId).size === 0) {
            blogTypingMap.delete(blogId);
          }
        }
      }
      
      // Broadcast typing status to others in the blog room
      socket.to(`blog:${blogId}`).emit("userTyping", {
        userId: socket.userId,
        username,
        isTyping,
        blogId
      });
    });

    // Handle reply typing indicators
    socket.on("replyTyping", ({ blogId, commentId, isTyping, username }) => {
      if (!socket.userId || !blogId || !commentId) return;
      
      // Broadcast reply typing status to others in the blog room
      socket.to(`blog:${blogId}`).emit("userReplyTyping", {
        userId: socket.userId,
        username,
        isTyping,
        blogId,
        commentId
      });
    });

    // Handle new comment events
    socket.on("newComment", ({ blogId, comment }) => {
      if (!socket.userId || !blogId) return;
      
      // Broadcast new comment to all users in the blog room except sender
      socket.to(`blog:${blogId}`).emit("commentAdded", {
        blogId,
        comment,
        addedBy: socket.userId
      });
      
      console.log(`New comment added to blog ${blogId} by user ${socket.userId}`);
    });

    // Handle new reply events
    socket.on("newReply", ({ blogId, commentId, reply }) => {
      if (!socket.userId || !blogId || !commentId) return;
      
      // Broadcast new reply to all users in the blog room except sender
      socket.to(`blog:${blogId}`).emit("replyAdded", {
        blogId,
        commentId,
        reply,
        addedBy: socket.userId
      });
      
      console.log(`New reply added to comment ${commentId} in blog ${blogId} by user ${socket.userId}`);
    });

    // Handle comment like events
    socket.on("commentLiked", ({ blogId, commentId, likesCount, isLiked }) => {
      if (!socket.userId || !blogId || !commentId) return;
      
      // Broadcast like update to all users in the blog room except sender
      socket.to(`blog:${blogId}`).emit("commentLikeUpdated", {
        blogId,
        commentId,
        likesCount,
        isLiked,
        likedBy: socket.userId
      });
    });

    // Handle reply like events
    socket.on("replyLiked", ({ blogId, commentId, replyId, likesCount, isLiked }) => {
      if (!socket.userId || !blogId || !commentId || !replyId) return;
      
      // Broadcast reply like update to all users in the blog room except sender
      socket.to(`blog:${blogId}`).emit("replyLikeUpdated", {
        blogId,
        commentId,
        replyId,
        likesCount,
        isLiked,
        likedBy: socket.userId
      });
    });

    // Handle blog post like events
    socket.on("blogLiked", ({ blogId, likesCount, isLiked }) => {
      if (!socket.userId || !blogId) return;
      
      // Broadcast blog like update to all users in the blog room except sender
      socket.to(`blog:${blogId}`).emit("blogLikeUpdated", {
        blogId,
        likesCount,
        isLiked,
        likedBy: socket.userId
      });
    });
    // Handle private messaging
    socket.on("privateMessage", ({ recipientId, message }) => {
      if (!socket.userId) return;

      const messageData = {
        senderId: socket.userId,
        message,
        timestamp: new Date()
      };

      io.to(`user:${recipientId}`).emit("privateMessage", messageData);
    });
    socket.on("studySession:start", async ({ userId, courseId }) => {
      try {
        if (!userId || !courseId) return;

        const startTime = new Date();

        // Store session info
        studySessionMap.set(userId, {
          courseId,
          startTime,
          lastHeartbeat: startTime
        });

        console.log(`User ${userId} started studying course ${courseId}`);

        // Emit event to acknowledge session start
        socket.emit("studySession:started", {
          courseId,
          startTime
        });
      } catch (error) {
        console.error("Error starting study session:", error);
      }
    });

    // Handle heartbeat to update study time
    socket.on("studySession:heartbeat", async ({ userId }) => {
      try {
        if (!userId || !studySessionMap.has(userId)) return;

        const now = new Date();
        const sessionData = studySessionMap.get(userId);
        const elapsed = Math.floor((now - sessionData.lastHeartbeat) / 1000);

        // Only count if elapsed time is reasonable (less than 5 minutes)
        if (elapsed < 300) {
          // Update the last heartbeat time
          sessionData.lastHeartbeat = now;
          studySessionMap.set(userId, sessionData);

          // Acknowledge heartbeat
          socket.emit("studySession:heartbeatAck", {
            elapsed,
            totalSession: Math.floor((now - sessionData.startTime) / 1000)
          });
        }
      } catch (error) {
        console.error("Error processing heartbeat:", error);
      }
    });

    // Handle study session end
    socket.on("studySession:end", async ({ userId }) => {
      try {
        if (!userId || !studySessionMap.has(userId)) return;

        const sessionData = studySessionMap.get(userId);
        const now = new Date();
        const sessionDuration = Math.floor((now - sessionData.startTime) / 1000);

        // Import required models
        const { CourseProgress } = await import("../models/courseprogress.model.js");
        const { checkAndAwardAchievements } = await import("../utils/achievement.service.js");

        // Update course progress
        let courseProgress = await CourseProgress.findOne({
          userId,
          courseId: sessionData.courseId
        });

        if (!courseProgress) {
          // Create new progress record if it doesn't exist
          courseProgress = new CourseProgress({
            userId,
            courseId: sessionData.courseId,
            completed: false,
            lectureProgress: [],
            lastAccessedAt: now,
            studyTime: sessionDuration,
            studySessions: [{
              startTime: sessionData.startTime,
              endTime: now,
              duration: sessionDuration
            }]
          });
        } else {
          // Update existing progress
          courseProgress.lastAccessedAt = now;
          courseProgress.studyTime += sessionDuration;
          courseProgress.studySessions.push({
            startTime: sessionData.startTime,
            endTime: now,
            duration: sessionDuration
          });
        }

        await courseProgress.save();

        // Check for achievements
        const newAchievements = await checkAndAwardAchievements(userId);

        // Clear session data
        studySessionMap.delete(userId);

        // Send session summary to client
        socket.emit("studySession:ended", {
          duration: sessionDuration,
          totalStudyTime: courseProgress.studyTime,
          newAchievements: newAchievements.map(a => ({
            title: a.title,
            description: a.description
          }))
        });

        console.log(`User ${userId} ended study session. Duration: ${sessionDuration} seconds`);
      } catch (error) {
        console.error("Error ending study session:", error);
      }
    });


    // Handle disconnection
    // socket.on("disconnect", async () => {
    //   try {
    //     const userId = socket.userId;
    //     if (!userId) return;

    //     // Remove from socket mapping
    //     userSocketMap.delete(userId);

    //     // Update user's online status in database
    //     await User.findByIdAndUpdate(userId, {
    //       isOnline: false,
    //       lastActive: new Date()
    //     });

    //     // Broadcast user's offline status to all clients
    //     io.emit("userStatus", { userId, status: false });

    //     console.log(`User ${userId} disconnected, remaining online users: ${userSocketMap.size}`);
    //   } catch (error) {
    //     console.error("Socket disconnection error:", error);
    //   }
    // });
    socket.on("disconnect", async () => {
      try {
        const userId = socket.userId;
        if (!userId) return;



          // Clean up blog-related data
    const currentBlogId = blogRoomMap.get(userId);
    if (currentBlogId) {
      // Remove from blog room
      socket.leave(`blog:${currentBlogId}`);
      blogRoomMap.delete(userId);
      
      // Clean up typing indicators
      if (blogTypingMap.has(currentBlogId)) {
        blogTypingMap.get(currentBlogId).delete(userId);
        if (blogTypingMap.get(currentBlogId).size === 0) {
          blogTypingMap.delete(currentBlogId);
        }
      }
      
      // Notify others that user left the blog
      socket.to(`blog:${currentBlogId}`).emit("userLeftBlog", {
        userId,
        blogId: currentBlogId
      });
    }
        // Handle active study session if it exists
        if (studySessionMap.has(userId)) {
          const sessionData = studySessionMap.get(userId);
          const now = new Date();
          const sessionDuration = Math.floor((now - sessionData.startTime) / 1000);

          // Import required models
          const { CourseProgress } = await import("../models/courseprogress.model.js");

          // Update course progress
          let courseProgress = await CourseProgress.findOne({
            userId,
            courseId: sessionData.courseId
          });

          if (courseProgress) {
            courseProgress.lastAccessedAt = now;
            courseProgress.studyTime += sessionDuration;
            courseProgress.studySessions.push({
              startTime: sessionData.startTime,
              endTime: now,
              duration: sessionDuration
            });

            await courseProgress.save();
          }

          // Clear session data
          studySessionMap.delete(userId);

          console.log(`User ${userId} disconnected during study session. Duration: ${sessionDuration} seconds`);
        }

        // Remove from socket mapping
        userSocketMap.delete(userId);

        // Update user's online status in database
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastActive: new Date()
        });

        // Broadcast user's offline status to all clients
        io.emit("userStatus", { userId, status: false });

        console.log(`User ${userId} disconnected, remaining online users: ${userSocketMap.size}`);
      } catch (error) {
        console.error("Socket disconnection error:", error);
      }
    });




    
    // Handle explicit logout
    socket.on("logout", async (userId) => {
      try {
        if (!userId) return;

        // Remove from socket mapping
        userSocketMap.delete(userId);

        // Update user's online status in database
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastActive: new Date()
        });

        // Broadcast user's offline status to all clients
        io.emit("userStatus", { userId, status: false });

        console.log(`User ${userId} logged out`);
      } catch (error) {
        console.error("Socket logout error:", error);
      }
    });
  });

  return io;
};



/**
 * Update user online status and broadcast to all clients
 * @param {string} userId - User ID
 * @param {boolean} status - Online status (true/false)
 */
export const updateUserStatus = (userId, status) => {
  if (!io) {
    console.error("Socket not initialized");
    return;
  }

  io.emit("userStatus", { userId, status });
};

/**
 * Send notification to a specific user
 * @param {string} userId - Target user ID
 * @param {object} notification - Notification data
 */
export const sendUserNotification = (userId, notification) => {
  if (!io) {
    console.error("Socket not initialized");
    return;
  }

  io.to(`user:${userId}`).emit("notification", notification);
};

/**
 * Send course-related notification to a specific user
 * @param {string} userId - Target user ID
 * @param {object} notification - Notification data containing course information
 */
export const sendCourseNotification = async (userId, notification) => {
  try {
    // Save notification to database
    await Notification.create({
      recipient: userId,
      title: notification.title,
      message: notification.message,
      type: 'course',
      relatedCourse: notification.courseId,
      relatedLecture: notification.lectureId
    });

    // Send real-time notification if user is online
    if (io && isUserOnline(userId)) {
      const courseNotification = {
        ...notification,
        type: 'course',
        timestamp: new Date()
      };

      io.to(`user:${userId}`).emit("courseNotification", courseNotification);
      io.to(`user:${userId}`).emit("notification", courseNotification);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
/**
 * Get currently online users
 * @returns {Array} Array of online user IDs
 */
export const getOnlineUsers = () => {
  return Array.from(userSocketMap.keys());
};

/**
 * Check if a user is online
 * @param {string} userId - User ID to check
 * @returns {boolean} True if user is online
 */
export const isUserOnline = (userId) => {
  return userSocketMap.has(userId);
};

/**
 * Get Socket.IO instance
 * @returns {object} Socket.IO instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};