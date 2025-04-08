import { Language } from "../../models/language.model.js";
import { uploadMedia, deleteMediaFromCloudinary } from "../../utils/cloudinary.js";
import{ Course} from "../../models/course.model.js";

export const createLanguage = async (req, res) => {
    try {
        const { name, code, description, difficulty } = req.body;
        const icon = req.file;

        // Validate required fields
        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "Language name and code are required."
            });
        }

        // Check if language already exists
        const existingLanguage = await Language.findOne({ 
            $or: [{ name }, { code }] 
        });
        
        if (existingLanguage) {
            return res.status(400).json({
                success: false,
                message: "Language with this name or code already exists."
            });
        }

        // Create language object
        const languageData = {
            name,
            code,
            ...(description && { description }),
            ...(difficulty && { difficulty })
        };

        // Upload icon if provided
        if (icon) {
            const cloudResponse = await uploadMedia(icon.path);
            languageData.iconUrl = cloudResponse.secure_url;
        }

        // Create and save language
        const language = await Language.create(languageData);

        return res.status(201).json({
            success: true,
            language,
            message: "Language created successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create language."
        });
    }
};


export const getAllLanguages = async (req, res) => {
    try {
        const languages = await Language.find({ isActive: true })
            .select("name code difficulty iconUrl");
        
        return res.status(200).json({
            success: true,
            count: languages.length,
            languages
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch languages."
        });
    }
};


export const getLanguageById = async (req, res) => {
    try {
        const language = await Language.findById(req.params.id)
            .populate({
                path: 'courses',
                select: 'title level description thumbnailUrl rating.average'
            });
        
        if (!language) {
            return res.status(404).json({
                success: false,
                message: "Language not found."
            });
        }
        
        return res.status(200).json({
            success: true,
            language
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch language."
        });
    }
};


export const updateLanguage = async (req, res) => {
    try {
        const { name, description, difficulty, isActive } = req.body;
        const icon = req.file;
        
        const language = await Language.findById(req.params.id);
        
        if (!language) {
            return res.status(404).json({
                success: false,
                message: "Language not found."
            });
        }
        
        // Create update object
        const updateData = {
            ...(name && { name }),
            ...(description && { description }),
            ...(difficulty && { difficulty }),
            ...(isActive !== undefined && { isActive })
        };
        
        // Handle icon update
        if (icon) {
            // Delete old icon if exists
            if (language.iconUrl) {
                const publicId = language.iconUrl.split("/").pop().split(".")[0];
                deleteMediaFromCloudinary(publicId);
            }
            
            // Upload new icon
            const cloudResponse = await uploadMedia(icon.path);
            updateData.iconUrl = cloudResponse.secure_url;
        }
        
        // Update language
        const updatedLanguage = await Language.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        return res.status(200).json({
            success: true,
            language: updatedLanguage,
            message: "Language updated successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update language."
        });
    }
};


export const deleteLanguage = async (req, res) => {
    try {
        const language = await Language.findById(req.params.id);
        
        if (!language) {
            return res.status(404).json({
                success: false,
                message: "Language not found."
            });
        }
        
        // Check if language has associated courses
        if (language.courses && language.courses.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete language with associated courses. Deactivate it instead."
            });
        }
        
        // Delete icon from cloudinary
        if (language.iconUrl) {
            const publicId = language.iconUrl.split("/").pop().split(".")[0];
            deleteMediaFromCloudinary(publicId);
        }
        
        // Delete language
        await Language.findByIdAndDelete(req.params.id);
        
        return res.status(200).json({
            success: true,
            message: "Language deleted successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete language."
        });
    }
};


export const getLanguageCourses = async (req, res) => {
    try {
        const languageId = req.params.id;
        
        // Check if language exists
        const language = await Language.findById(languageId);
        
        if (!language) {
            return res.status(404).json({
                success: false,
                message: "Language not found."
            });
        }
        
        // Find all courses for this language with available information
      
        const courses = await Course.find({ 
            language: languageId
          
        })
        .populate({ path: "instructor", select: "name photoUrl" })
        .populate({
            path: "lessons",
            select: "title description duration"
        })
        .select("title description level duration price discountPrice thumbnailUrl rating status materials")
        .sort({ createdAt: -1 });
        
        // Format the response with detailed course information
        const formattedCourses = courses.map(course => ({
            _id: course._id,
            title: course.title,
            description: course.description,
            level: course.level,
            duration: course.duration,
            price: course.price,
            discountPrice: course.discountPrice,
            thumbnailUrl: course.thumbnailUrl,
            rating: course.rating,
            status: course.status,
            instructor: course.instructor,
            enrollmentCount: course.enrolledStudents ? course.enrolledStudents.length : 0,
            lessonCount: course.lessons ? course.lessons.length : 0,
         
            materialCount: course.materials ? course.materials.length : 0,
          
            lessons: course.lessons,
         
            materials: course.materials
        }));
        
        return res.status(200).json({
            success: true,
            language: {
                _id: language._id,
                name: language.name,
                code: language.code,
                description: language.description,
                difficulty: language.difficulty,
                iconUrl: language.iconUrl
            },
            courses: formattedCourses,
            count: formattedCourses.length
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch language courses.",
            error: error.message
        });
    }
};