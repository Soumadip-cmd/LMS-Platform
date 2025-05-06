import { Course } from "../../models/course.model.js";
import { Lecture } from "../../models/lecture.model.js";
import { Language } from "../../models/language.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../../utils/cloudinary.js";

export const createCourse = async (req, res) => {
    try {
        const { title, language, level, description, duration, price, discountPrice, instructorId } = req.body;
        
        // Validate required fields
        if (!title || !language || !level || !description || !duration?.weeks || !price) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing."
            });
        }

        // Determine the instructor ID
        // If admin is creating course for an instructor, use the provided instructorId
        // Otherwise use the current user's ID
        const instructor = req.user.role === "admin" ? (instructorId || req.id) : req.id;

        // Create course
        const course = await Course.create({
            title,
            language,
            level,
            description,
            duration: {
                weeks: duration.weeks
            },
            instructor,
            price,
            discountPrice,
            status: "draft"
        });

        // Update Language model to add this course
        await Language.findByIdAndUpdate(
            language,
            { $push: { courses: course._id } }
        );

        return res.status(201).json({
            success: true,
            course,
            message: "Course created successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course"
        });
    }
};


export const searchCourses = async (req, res) => {
    try {
        const { query = "", language = [], level = [], status, sortByPrice = "" } = req.query;
        
        // Create search criteria
        const searchCriteria = {};

        // If query is provided, add text search
        if (query) {
            searchCriteria.$or = [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ];
        }

        // Add status filter only if provided
        if (status) {
            searchCriteria.status = status;
        }

        // Filter by language
        if (language.length > 0) {
            searchCriteria.language = { $in: language };
        }

        // Filter by level
        if (level.length > 0) {
            searchCriteria.level = { $in: level };
        }

        // Define sorting options
        const sortOptions = {};
        if (sortByPrice === "low") {
            sortOptions.price = 1;
        } else if (sortByPrice === "high") {
            sortOptions.price = -1;
        } else {
            sortOptions.createdAt = -1;
        }

        // Find courses
        const courses = await Course.find(searchCriteria)
            .populate({ path: "instructor", select: "name photoUrl" })
            .populate({ path: "language", select: "name code" })
            .sort(sortOptions);

        return res.status(200).json({
            success: true,
            courses: courses.map(course => ({
                _id: course._id,
                title: course.title,
                language: course.language,
                level: course.level,
                description: course.description,
                instructor: course.instructor,
                price: course.price,
                discountPrice: course.discountPrice,
                status: course.status,
                duration: course.duration
            })),
            totalCourses: courses.length
        });
    } catch (error) {
        console.error('Search Courses Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to search courses",
            error: error.message
        });
    }
};

export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ status: "published" })
            .populate({ path: "instructor", select: "name photoUrl" })
            .populate({ path: "language", select: "name code" });
            
        return res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get published courses"
        });
    }
};

export const getInstructorCourses = async (req, res) => {
    try {
        // If admin, can see all courses or filter by instructor ID
        // If instructor, can only see their own courses
        const { instructorId } = req.query;
        let query = {};
        
        if (req.user.role === "admin") {
            // Admin can filter by instructor if specified, otherwise see all courses
            if (instructorId) {
                query = { instructor: instructorId };
            }
        } else {
            // Instructor can only see their own courses
            query = { instructor: req.id };
        }
        
        const courses = await Course.find(query)
            .populate({ path: "language", select: "name code" })
            .populate({ path: "instructor", select: "name photoUrl" });
            
        return res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get instructor courses"
        });
    }
};

export const getAllCoursesAdmin = async (req, res) => {
    try {
        const { status, language, level, sortBy } = req.query;
        
        // Build query
        const query = {};
        if (status) query.status = status;
        if (language) query.language = language;
        if (level) query.level = level;
        
        // Build sort options
        const sortOptions = {};
        if (sortBy === "recent") {
            sortOptions.createdAt = -1;
        } else if (sortBy === "price-asc") {
            sortOptions.price = 1;
        } else if (sortBy === "price-desc") {
            sortOptions.price = -1;
        } else if (sortBy === "title") {
            sortOptions.title = 1;
        } else {
            sortOptions.createdAt = -1; // Default
        }
        
        const courses = await Course.find(query)
            .populate({ path: "instructor", select: "name photoUrl" })
            .populate({ path: "language", select: "name code" })
            .sort(sortOptions);
            
        return res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get courses"
        });
    }
};






export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        let course = await Course.findById(courseId)
            .populate({ path: "instructor", select: "name photoUrl" })
            .populate({ path: "language", select: "name code" })
            .populate("lessons");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        // Manually populate quizzes if needed
        if (course.quizzes && course.quizzes.length > 0) {
            try {
                course = await course.populate({
                    path: "quizzes",
                    select: "title description level timeLimit passingScore status"
                });
            } catch (populateError) {
                console.warn('Quiz population failed:', populateError);
                // Continue without quiz population
            }
        }
        
        return res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        console.error('Course Fetch Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to get course by id",
            errorDetails: error.message
        });
    }
};
export const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const {
            title,
            language,
            level,
            description,
            duration,
            price,
            discountPrice,
            status,
            instructor
        } = req.body;
        const thumbnail = req.file;

        // Check if course exists
        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        // Authorization check - Admin can update any course, Instructor can only update their own
        if (req.user.role !== "admin" && course.instructor.toString() !== req.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this course"
            });
        }

        // Handle thumbnail upload
        let thumbnailUrl;
        if (thumbnail) {
            if (course.thumbnailUrl) {
                // Extract public ID from the URL
                const publicId = course.thumbnailUrl.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId);
            }
            // Upload new thumbnail
            const uploadResult = await uploadMedia(thumbnail.path);
            thumbnailUrl = uploadResult.secure_url;
        }

        // If language is being changed, update relationships
        if (language && language !== course.language.toString()) {
            // Remove course from old language
            await Language.findByIdAndUpdate(
                course.language,
                { $pull: { courses: courseId } }
            );
            
            // Add course to new language
            await Language.findByIdAndUpdate(
                language,
                { $push: { courses: courseId } }
            );
        }

        // Create update data object
        const updateData = {
            ...(title && { title }),
            ...(language && { language }),
            ...(level && { level }),
            ...(description && { description }),
            ...(duration?.weeks && { duration: { weeks: duration.weeks } }),
            ...(price && { price }),
            ...(discountPrice && { discountPrice }),
            ...(status && { status }),
            ...(thumbnailUrl && { thumbnailUrl })
        };
        
        // If admin is updating the instructor
        if (req.user.role === "admin" && instructor) {
            updateData.instructor = instructor;
        }

        // Update course
        course = await Course.findByIdAndUpdate(
            courseId,
            updateData,
            { new: true }
        );

        return res.status(200).json({
            success: true,
            course,
            message: "Course updated successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update course"
        });
    }
};



export const addCourseMaterial = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, type } = req.body;
        const file = req.file;

        if (!title || !type || !file) {
            return res.status(400).json({
                success: false,
                message: "Title, type, and file are required"
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        // Authorization check
        if (req.user.role !== "admin" && course.instructor.toString() !== req.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this course"
            });
        }

        // Create full URL including server address
        const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

        // Add material to course
        course.materials.push({
            title,
            type,
            url: fullUrl, // Full URL to access the file
            publicId: file.filename
        });

        await course.save();

        return res.status(200).json({
            success: true,
            course,
            message: "Course material added successfully."
        });
    } catch (error) {
        console.error('Add Course Material Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to add course material"
        });
    }
};
export const removeCourseMaterial = async (req, res) => {
    try {
        const { courseId, materialId } = req.params;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        // Authorization check - Admin can update any course, Instructor can only update their own
        if (req.user.role !== "admin" && course.instructor.toString() !== req.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this course"
            });
        }

        // Find material
        const material = course.materials.id(materialId);
        if (!material) {
            return res.status(404).json({
                success: false,
                message: "Material not found!"
            });
        }

        // Delete file from cloudinary
        if (material.publicId) {
            await deleteMediaFromCloudinary(material.publicId);
        }

        // Remove material from course
        course.materials.pull(materialId);
        await course.save();

        return res.status(200).json({
            success: true,
            message: "Course material removed successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove course material"
        });
    }
};

export const updateCourseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { status } = req.body;

        if (!["draft", "inProgress", "published", "archived", "underReview"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        // Authorization check - Admin can update any course, Instructor can only update their own
        if (req.user.role !== "admin" && course.instructor.toString() !== req.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this course"
            });
        }

        // Update course status
        course.status = status;
        await course.save();

        return res.status(200).json({
            success: true,
            message: `Course status updated to ${status}`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update course status"
        });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }
        
        // Delete thumbnail from cloudinary if exists
        if (course.thumbnailUrl) {
            const publicId = course.thumbnailUrl.split("/").pop().split(".")[0];
            await deleteMediaFromCloudinary(publicId);
        }
        
        // Delete all materials from cloudinary
        for (const material of course.materials) {
            if (material.publicId) {
                await deleteMediaFromCloudinary(material.publicId);
            }
        }
        
        // Delete all associated lectures
        const lectures = await Lecture.find({ course: courseId });
        for (const lecture of lectures) {
            // Delete lecture video if exists
            if (lecture.publicId) {
                await deleteMediaFromCloudinary(lecture.publicId);
            }
            
            // Delete lecture attachments if any
            for (const attachment of lecture.attachments || []) {
                if (attachment.publicId) {
                    await deleteMediaFromCloudinary(attachment.publicId);
                }
            }
            
            // Delete the lecture
            await Lecture.findByIdAndDelete(lecture._id);
        }
        
        // Remove course from language
        if (course.language) {
            await Language.findByIdAndUpdate(
                course.language,
                { $pull: { courses: courseId } }
            );
        }
        
        // Delete the course
        await Course.findByIdAndDelete(courseId);
        
        return res.status(200).json({
            success: true,
            message: "Course and all associated content deleted successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete course"
        });
    }
};


export const getTopCourses = async (req, res) => {
    try {
      const { limit = 4, language, level } = req.query;
      
      // Build query object
      const query = { status: "published" };
      
      // Add optional filters if provided
      if (language) query.language = language;
      if (level) query.level = level;
      
      // Find top courses based on rating and enrollment count
      const topCourses = await Course.find(query)
        .sort({ "rating.average": -1, "enrolledStudents.length": -1 })
        .limit(parseInt(limit))
        .populate({ path: "instructor", select: "name photoUrl" })
        .populate({ path: "language", select: "name code" });
      
      return res.status(200).json({
        success: true,
        topCourses
      });
    } catch (error) {
      console.error('Get Top Courses Error:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch top courses"
      });
    }
  };
  
  export const getFeaturedCourses = async (req, res) => {
    try {
      const { 
        limit = 8, 
        page = 1, 
        language = [], 
        level = [], 
        sortBy = "popularity", 
        price = ""
      } = req.query;
      
      // Parse page and limit to integers
      const pageInt = parseInt(page);
      const limitInt = parseInt(limit);
      const skip = (pageInt - 1) * limitInt;
      
      // Build query object
      const query = { status: "published" };
      
      // Add language filter if provided
      if (language.length > 0) {
        const languageArr = Array.isArray(language) ? language : [language];
        query.language = { $in: languageArr };
      }
      
      // Add level filter if provided
      if (level.length > 0) {
        const levelArr = Array.isArray(level) ? level : [level];
        query.level = { $in: levelArr };
      }
      
      // Add price filter if provided
      if (price === "free") {
        query.price = 0;
      } else if (price === "paid") {
        query.price = { $gt: 0 };
      }
      
      // Determine sort options
      let sortOptions = {};
      switch(sortBy) {
        case "price-low":
          sortOptions = { price: 1 };
          break;
        case "price-high":
          sortOptions = { price: -1 };
          break;
        case "newest":
          sortOptions = { createdAt: -1 };
          break;
        case "popularity":
        default:
          sortOptions = { "enrolledStudents.length": -1, "rating.average": -1 };
          break;
      }
      
      // Get total count for pagination
      const totalCourses = await Course.countDocuments(query);
      
      // Find featured courses
      const featuredCourses = await Course.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitInt)
        .populate({ path: "instructor", select: "name photoUrl" })
        .populate({ path: "language", select: "name code" });
      
      return res.status(200).json({
        success: true,
        featuredCourses,
        pagination: {
          total: totalCourses,
          page: pageInt,
          totalPages: Math.ceil(totalCourses / limitInt),
          limit: limitInt
        }
      });
    } catch (error) {
      console.error('Get Featured Courses Error:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch featured courses"
      });
    }
  };