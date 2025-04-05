
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// const isAuthenticated = async (req, res, next) => {
//   try {
//      Check for token in cookies
//     const token = req.cookies.token;

//     if (!token) {
//       return res.status(401).json({
//         message: "User not authenticated",
//         success: false,
//       });
//     }

//      Verify token
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);

//    Find user to ensure they still exist and are active
//     const user = await User.findById(decoded.userId);

//     if (!user) {
//       return res.status(401).json({
//         message: "User no longer exists",
//         success: false,
//       });
//     }

//     // Attach user information to request object
//     req.user = {
//       id: user._id,
//       role: user.role,
//       email: user.email
//     };

//     // Set req.id for backward compatibility with existing code
//     req.id = user._id;
//     req.role = user.role;

//     next();
//   } catch (error) {
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({
//         message: "Invalid token",
//         success: false,
//       });
//     }

//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({
//         message: "Token expired. Please login again.",
//         success: false,
//       });
//     }

//     console.error('Authentication error:', error);
//     return res.status(500).json({
//       message: "Authentication failed",
//       success: false,
//     });
//   }
// };


const isAuthenticated = async (req, res, next) => {
  try {
    // Check Authorization header first
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];

    // If no token in header, check cookies
    if (!token) {
      token = req.cookies.access_token;
    }

    console.log('Token Debug:', {
      authHeader: !!authHeader,
      cookieToken: !!req.cookies.access_token,
      tokenPresent: !!token
    });

    if (!token) {
      return res.status(401).json({
        message: "Authentication token is missing",
        success: false,
        debugInfo: {
          headers: Object.keys(req.headers),
          cookies: Object.keys(req.cookies)
        }
      });
    }

    // Verify token with comprehensive error handling
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY, {
        algorithms: ['HS256']
      });
    } catch (verifyError) {
      console.error('Token Verification Failed:', {
        name: verifyError.name,
        message: verifyError.message
      });

      // Specific error handling
      switch (verifyError.name) {
        case 'TokenExpiredError':
          return res.status(401).json({
            message: "Token has expired. Please log in again.",
            success: false,
            error: 'TokenExpired'
          });
        
        case 'JsonWebTokenError':
          return res.status(401).json({
            message: "Invalid token signature",
            success: false,
            error: 'InvalidSignature'
          });
        
        default:
          return res.status(401).json({
            message: "Authentication failed",
            success: false,
            error: verifyError.name
          });
      }
    }

    // Validate decoded payload
    if (!decoded.userId) {
      console.error('Invalid token payload:', decoded);
      return res.status(401).json({
        message: "Invalid token payload",
        success: false
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error('User not found for ID:', decoded.userId);
      return res.status(401).json({
        message: "User no longer exists",
        success: false
      });
    }

    // Attach user to request
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email
    };
    req.id = user._id;
    req.role = user.role;

    console.log('Authentication successful for user:', user.email);
    next();
  } catch (error) {
    console.error('Unexpected Authentication Error:', {
      message: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      message: "Internal authentication error",
      success: false,
      error: error.message
    });
  }
};

const isInstructor = async (req, res, next) => {
  try {
    // Reuse isAuthenticated middleware logic
    await isAuthenticated(req, res, () => {
      // Check if user is an instructor or admin
      if (req.user.role !== "instructor" && req.user.role !== "admin") {
        return res.status(403).json({
          message: "Access denied. Instructor privileges required.",
          success: false,
        });
      }
      next();
    });
  } catch (error) {
    console.error('Instructor authentication error:', error);
    return res.status(500).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    // Reuse isAuthenticated middleware logic
    await isAuthenticated(req, res, () => {
      // Check if user is an admin
      if (req.user.role !== "admin") {
        return res.status(403).json({
          message: "Access denied. Admin privileges required.",
          success: false,
        });
      }
      next();
    });
  } catch (error) {
    console.error('Admin authentication error:', error);
    return res.status(500).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

const isInstructorOrAdmin = async (req, res, next) => {
  try {
    // Reuse isAuthenticated middleware logic
    await isAuthenticated(req, res, () => {
      // Check if user is an instructor or admin
      if (req.user.role !== "instructor" && req.user.role !== "admin") {
        return res.status(403).json({
          message: "Access denied. Instructor or Admin privileges required.",
          success: false,
        });
      }
      next();
    });
  } catch (error) {
    console.error('Instructor/Admin authentication error:', error);
    return res.status(500).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

export { isAuthenticated, isInstructor, isAdmin, isInstructorOrAdmin };