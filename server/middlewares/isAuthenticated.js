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
    req.role = decode.role; // Store role in request object
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
    req.role = decode.role;
    
    // Check role directly from token without database query
    if (decode.role !== "instructor") {
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
    req.role = decode.role;
    
    // Check role directly from token without database query
    if (decode.role !== "admin") {
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
export const isInstructorOrAdmin = (req, res, next) => {
  try {
      if (req.user && (req.user.role === "instructor" || req.user.role === "admin")) {
          next();
      } else {
          return res.status(403).json({
              success: false,
              message: "Access denied. Instructor or Admin privileges required."
          });
      }
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          success: false,
          message: "Server error"
      });
  }
};
export { isAuthenticated, isInstructor, isAdmin };