
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";



// const isAuthenticated = async (req, res, next) => {
//   try {
//     // Check Authorization header first
//     const authHeader = req.headers['authorization'];
//     let token = authHeader && authHeader.split(' ')[1];

//     // If no token in header, check cookies
//     if (!token) {
//       token = req.cookies.access_token;
//     }

//     // If still no token, check query parameter (for special cases like WebSocket connections)
//     if (!token && req.query.token) {
//       token = req.query.token;
//     }

//     // Log token debug info
//     console.log('Token Debug:', {
//       authHeader: !!authHeader,
//       cookieToken: !!req.cookies.access_token,
//       queryToken: !!req.query.token,
//       tokenPresent: !!token
//     });

//     // If token is still missing, return 401
//     if (!token) {
//       return res.status(401).json({
//         message: "Authentication token is missing",
//         success: false,
//         debugInfo: {
//           headers: Object.keys(req.headers),
//           cookies: Object.keys(req.cookies)
//         }
//       });
//     }

//     // Verify token with comprehensive error handling
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.SECRET_KEY, {
//         algorithms: ['HS256']
//       });
//     } catch (verifyError) {
//       console.error('Token Verification Failed:', {
//         name: verifyError.name,
//         message: verifyError.message
//       });

//       // Specific error handling
//       switch (verifyError.name) {
//         case 'TokenExpiredError':
//           return res.status(401).json({
//             message: "Token has expired. Please log in again.",
//             success: false,
//             error: 'TokenExpired'
//           });

//         case 'JsonWebTokenError':
//           return res.status(401).json({
//             message: "Invalid token signature",
//             success: false,
//             error: 'InvalidSignature'
//           });

//         default:
//           return res.status(401).json({
//             message: "Authentication failed",
//             success: false,
//             error: verifyError.name
//           });
//       }
//     }

//     // Validate decoded payload
//     if (!decoded.userId) {
//       console.error('Invalid token payload:', decoded);
//       return res.status(401).json({
//         message: "Invalid token payload",
//         success: false
//       });
//     }

//     // Find user
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       console.error('User not found for ID:', decoded.userId);
//       return res.status(401).json({
//         message: "User no longer exists",
//         success: false
//       });
//     }

//     // Attach user to request
//     req.user = {
//       id: user._id,
//       role: user.role,
//       email: user.email
//     };
//     req.id = user._id;
//     req.role = user.role;

//     console.log('Authentication successful for user:', user.email);
//     next();
//   } catch (error) {
//     console.error('Unexpected Authentication Error:', {
//       message: error.message,
//       stack: error.stack
//     });

//     return res.status(500).json({
//       message: "Internal authentication error",
//       success: false,
//       error: error.message
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

    // If still no token, check query parameter
    if (!token && req.query.token) {
      token = req.query.token;
    }

    // Enhanced debug logging
    console.log('🔍 Auth Middleware Debug:', {
      authHeader: authHeader ? `EXISTS: ${authHeader.substring(0, 20)}...` : 'MISSING',
      extractedToken: token ? `EXISTS: ${token.substring(0, 20)}...` : 'MISSING',
      secretKey: process.env.SECRET_KEY ? 'EXISTS' : 'MISSING',
      headers: Object.keys(req.headers),
      cookies: Object.keys(req.cookies)
    });

    // If token is still missing, return 401
    if (!token) {
      console.log('❌ No token found');
      return res.status(401).json({
        message: "Authentication token is missing",
        success: false,
        debugInfo: {
          authHeader: !!authHeader,
          cookies: Object.keys(req.cookies),
          headers: Object.keys(req.headers)
        }
      });
    }

    // Verify token with comprehensive error handling
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY, {
        algorithms: ['HS256']
      });
      console.log('✅ Token verified successfully:', { userId: decoded.userId });
    } catch (verifyError) {
      console.error('❌ Token Verification Failed:', {
        name: verifyError.name,
        message: verifyError.message,
        token: token.substring(0, 20) + '...'
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
      console.error('❌ Invalid token payload:', decoded);
      return res.status(401).json({
        message: "Invalid token payload",
        success: false
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error('❌ User not found for ID:', decoded.userId);
      return res.status(401).json({
        message: "User no longer exists",
        success: false
      });
    }

    // Attach user to request - MAKE SURE ALL FIELDS ARE INCLUDED
    req.user = {
      _id: user._id,        // ✅ MongoDB ObjectId
      id: user._id,         // ✅ Alternative reference
      role: user.role,
      email: user.email,
      name: user.name       // ✅ Add name field
    };
    req.id = user._id;
    req.role = user.role;

    console.log('✅ User authenticated successfully:', { 
      userId: user._id, 
      email: user.email,
      role: user.role 
    });
    
    next();
  } catch (error) {
    console.error('❌ Unexpected Authentication Error:', {
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

const isStudent = async (req, res, next) => {
  try {
    // Reuse isAuthenticated middleware logic
    await isAuthenticated(req, res, () => {
      // Check if user is a student
      if (req.user.role !== "student") {
        return res.status(403).json({
          message: "Access denied. Student privileges required.",
          success: false,
        });
      }
      next();
    });
  } catch (error) {
    console.error('Student authentication error:', error);
    return res.status(500).json({
      message: "Authentication failed",
      success: false,
    });
  }
};


export { isAuthenticated, isInstructor, isAdmin, isInstructorOrAdmin,isStudent };