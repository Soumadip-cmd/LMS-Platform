// utils/socket.js
import { Server } from "socket.io";
import { User } from "../models/user.model.js";

let io;
const userSocketMap = new Map(); // Maps userId to socketId

/**
 * Initialize Socket.IO server
 * @param {object} server - HTTP server instance
 */
export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
      credentials: true
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

    // Handle disconnection
    socket.on("disconnect", async () => {
      try {
        const userId = socket.userId;
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