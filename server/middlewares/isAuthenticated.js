import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware to check if user is authenticated
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

// Middleware to check if user is an instructor
const isInstructor = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    
    req.id = decode.userId;
    
    // Fetch user to check role
    const user = await User.findById(decode.userId);
    
    if (!user || user.role !== "instructor") {
      return res.status(403).json({
        message: "Access denied. Instructor privileges required.",
        success: false,
      });
    }
    
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

// Middleware to check if user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    
    req.id = decode.userId;
    
    // Fetch user to check role
    const user = await User.findById(decode.userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
        success: false,
      });
    }
    
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

export { isAuthenticated, isInstructor, isAdmin };