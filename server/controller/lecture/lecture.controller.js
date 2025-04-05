

import { Lecture } from "../../models/lecture.model.js";
import { Course } from "../../models/course.model.js";
import { User } from "../../models/user.model.js";
import { sendCourseNotification } from "../../socket/socket.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the videos directory
const videosDir = path.join(__dirname, '../../public/lecture-videos');
// Create the directory if it doesn't exist
if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
}

// Define the attachments directory
const attachmentsDir = path.join(__dirname, '../../public/lecture-attachments');
// Create the directory if it doesn't exist
if (!fs.existsSync(attachmentsDir)) {
    fs.mkdirSync(attachmentsDir, { recursive: true });
}

export const createLecture = async (req, res) => {
    try {
        const {
            lectureTitle,
            description,
            courseId,
            order,
            duration,
            isPreviewFree,
            notes,
            zoomMeetingId,
            zoomMeetingPassword,
            liveSessionDate,
            liveSessionDuration
        } = req.body;

        const videoFile = req.file;
        const userId = req.id;

        // Validate required fields
        if (!lectureTitle || !courseId || !order) {
            return res.status(400).json({
                success: false,
                message: "Title, course ID, and order are required."
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        // Check if user is authorized (instructor of the course or admin)
        const isAdmin = req.user.role === "admin";
        const isInstructor = course.instructor.toString() === userId;

        if (!isAdmin && !isInstructor) {
            return res.status(403).json({
                success: false,
                message: "You can only add lectures to your own courses."
            });
        }

        // Check if order is already taken
        const existingLecture = await Lecture.findOne({
            course: courseId,
            order: order
        });

        if (existingLecture) {
            return res.status(400).json({
                success: false,
                message: "Lecture with this order already exists. Choose a different order."
            });
        }

        // Create lecture data
        const lectureData = {
            lectureTitle,
            course: courseId,
            order: parseInt(order),
            ...(description && { description }),
            ...(duration && { duration: parseInt(duration) }),
            ...(isPreviewFree !== undefined && { isPreviewFree }),
            ...(notes && { notes }),
            ...(zoomMeetingId && { zoomMeetingId }),
            ...(zoomMeetingPassword && { zoomMeetingPassword })
        };

        // Handle live session if provided
        if (liveSessionDate && liveSessionDuration) {
            lectureData.liveSessionSchedule = {
                date: new Date(liveSessionDate),
                duration: parseInt(liveSessionDuration)
            };
        }

        // Handle video file if provided
        if (videoFile) {
            // Create a permanent destination for the video
            const videoFileName = `${Date.now()}-${videoFile.originalname.replace(/\s+/g, '-')}`;
            const videoPath = path.join(videosDir, videoFileName);
            
            // Move file from temp upload location to permanent location
            fs.renameSync(videoFile.path, videoPath);
            
            // Store the relative URL for the video
            lectureData.videoUrl = `http://localhost:8000/lecture-videos/${videoFileName}`;
            lectureData.videoFileName = videoFileName;
        }

        // Create lecture
        const lecture = await Lecture.create(lectureData);

        // Add lecture to course
        course.lessons.push(lecture._id);
        await course.save();

        // Notify enrolled students
        if (lecture.isPublished) {
            course.enrolledStudents.forEach(studentId => {
                sendCourseNotification(studentId.toString(), {
                    title: "New Lecture Available",
                    message: `A new lecture "${lecture.lectureTitle}" has been added to "${course.title}"`,
                    courseId: courseId,
                    lectureId: lecture._id
                });
            });
        }

        return res.status(201).json({
            success: true,
            lecture,
            message: "Lecture created successfully."
        });
    } catch (error) {
        console.log(error);
        // Clean up the uploaded file if there was an error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
            success: false,
            message: "Failed to create lecture."
        });
    }
};

export const updateLecture = async (req, res) => {
    try {
        const {
            lectureTitle,
            description,
            order,
            duration,
            isPreviewFree,
            notes,
            zoomMeetingId,
            zoomMeetingPassword,
            liveSessionDate,
            liveSessionDuration,
            isPublished
        } = req.body;

        const videoFile = req.file;
        const userId = req.id;
        const lectureId = req.params.id;

        // Find lecture
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found."
            });
        }

        // Check if user is authorized (instructor of the course or admin)
        const course = await Course.findById(lecture.course);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        const isAdmin = req.user.role === "admin";
        const isInstructor = course.instructor.toString() === userId;

        if (!isAdmin && !isInstructor) {
            return res.status(403).json({
                success: false,
                message: "You can only update lectures in your own courses."
            });
        }

        // Check if new order conflicts with existing lectures
        if (order && parseInt(order) !== lecture.order) {
            const conflictingLecture = await Lecture.findOne({
                course: lecture.course,
                order: parseInt(order),
                _id: { $ne: lectureId }
            });

            if (conflictingLecture) {
                return res.status(400).json({
                    success: false,
                    message: "Lecture with this order already exists. Choose a different order."
                });
            }
        }

        // Create update object
        const updateData = {
            ...(lectureTitle && { lectureTitle }),
            ...(description && { description }),
            ...(order && { order: parseInt(order) }),
            ...(duration && { duration: parseInt(duration) }),
            ...(isPreviewFree !== undefined && { isPreviewFree }),
            ...(notes && { notes }),
            ...(zoomMeetingId && { zoomMeetingId }),
            ...(zoomMeetingPassword && { zoomMeetingPassword }),
            ...(isPublished !== undefined && { isPublished })
        };

        // Handle live session update
        if (liveSessionDate && liveSessionDuration) {
            updateData.liveSessionSchedule = {
                date: new Date(liveSessionDate),
                duration: parseInt(liveSessionDuration)
            };
        }

        // Handle video update
        if (videoFile) {
            // Delete old video if exists
            if (lecture.videoFileName && fs.existsSync(path.join(videosDir, lecture.videoFileName))) {
                fs.unlinkSync(path.join(videosDir, lecture.videoFileName));
            }

            // Create a permanent destination for the new video
            const videoFileName = `${Date.now()}-${videoFile.originalname.replace(/\s+/g, '-')}`;
            const videoPath = path.join(videosDir, videoFileName);
            
            // Move file from temp upload location to permanent location
            fs.renameSync(videoFile.path, videoPath);
            
            // Update video info
            updateData.videoUrl = `http://localhost:8000/lecture-videos/${videoFileName}`;
            updateData.videoFileName = videoFileName;
        }

        // Update lecture
        const updatedLecture = await Lecture.findByIdAndUpdate(
            lectureId,
            updateData,
            { new: true }
        );

        // Notify enrolled students if lecture was published
        if (isPublished && !lecture.isPublished) {
            course.enrolledStudents.forEach(studentId => {
                sendCourseNotification(studentId.toString(), {
                    title: "New Lecture Available",
                    message: `A new lecture "${updatedLecture.lectureTitle}" is now available in "${course.title}"`,
                    courseId: course._id,
                    lectureId: lectureId
                });
            });
        }

        // Notify about live session if scheduled
        if (updateData.liveSessionSchedule && (!lecture.liveSessionSchedule || 
            lecture.liveSessionSchedule.date.toString() !== updateData.liveSessionSchedule.date.toString())) {
            course.enrolledStudents.forEach(studentId => {
                sendCourseNotification(studentId.toString(), {
                    title: "Live Session Scheduled",
                    message: `A live session for "${updatedLecture.lectureTitle}" has been scheduled`,
                    courseId: course._id,
                    lectureId: lectureId
                });
            });
        }

        return res.status(200).json({
            success: true,
            lecture: updatedLecture,
            message: "Lecture updated successfully."
        });
    } catch (error) {
        console.log(error);
        // Clean up the uploaded file if there was an error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
            success: false,
            message: "Failed to update lecture."
        });
    }
};

export const deleteLecture = async (req, res) => {
    try {
        const lectureId = req.params.id;
        const userId = req.id;

        // Find lecture
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found."
            });
        }

        // Check if user is authorized (instructor of the course or admin)
        const course = await Course.findById(lecture.course);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        const isAdmin = req.user.role === "admin";
        const isInstructor = course.instructor.toString() === userId;

        if (!isAdmin && !isInstructor) {
            return res.status(403).json({
                success: false,
                message: "You can only delete lectures in your own courses."
            });
        }

        // Delete video file
        if (lecture.videoFileName && fs.existsSync(path.join(videosDir, lecture.videoFileName))) {
            fs.unlinkSync(path.join(videosDir, lecture.videoFileName));
        }

        // Delete attachments
        if (lecture.attachments && lecture.attachments.length > 0) {
            for (const attachment of lecture.attachments) {
                if (attachment.fileName && fs.existsSync(path.join(attachmentsDir, attachment.fileName))) {
                    fs.unlinkSync(path.join(attachmentsDir, attachment.fileName));
                }
            }
        }

        // Remove lecture from course
        await Course.findByIdAndUpdate(
            lecture.course,
            { $pull: { lessons: lectureId } }
        );

        // Delete lecture
        await Lecture.findByIdAndDelete(lectureId);

        return res.status(200).json({
            success: true,
            message: "Lecture deleted successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete lecture."
        });
    }
};

export const addLectureAttachment = async (req, res) => {
    try {
        const { title, fileType } = req.body;
        const lectureId = req.params.id;
        const userId = req.id;
        const file = req.file;

        if (!file || !title) {
            return res.status(400).json({
                success: false,
                message: "File and title are required."
            });
        }

        // Find lecture
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found."
            });
        }

        // Check if user is authorized (instructor of the course or admin)
        const course = await Course.findById(lecture.course);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        const isAdmin = req.user.role === "admin";
        const isInstructor = course.instructor.toString() === userId;

        if (!isAdmin && !isInstructor) {
            return res.status(403).json({
                success: false,
                message: "You can only add attachments to your own lectures."
            });
        }

        // Create a permanent destination for the attachment
        const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
        const filePath = path.join(attachmentsDir, fileName);
        
        // Move file from temp upload location to permanent location
        fs.renameSync(file.path, filePath);

        // Add attachment to lecture
        lecture.attachments.push({
            title,
            fileUrl: `http://localhost:8000/lecture-attachments/${fileName}`,
            fileName: fileName,
            fileType: fileType || file.mimetype
        });

        await lecture.save();

        return res.status(200).json({
            success: true,
            lecture,
            message: "Attachment added successfully."
        });
    } catch (error) {
        console.log(error);
        // Clean up the uploaded file if there was an error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
            success: false,
            message: "Failed to add attachment."
        });
    }
};


export const updateLectureAttachment = async (req, res) => {
    try {
        const { title, fileType } = req.body;
        const lectureId = req.params.id;
        const attachmentId = req.params.attachmentId;
        const userId = req.id;
        const file = req.file;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required."
            });
        }

        // Find lecture
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found."
            });
        }

        // Check if user is authorized (instructor of the course or admin)
        const course = await Course.findById(lecture.course);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        const isAdmin = req.user.role === "admin";
        const isInstructor = course.instructor.toString() === userId;

        if (!isAdmin && !isInstructor) {
            return res.status(403).json({
                success: false,
                message: "You can only update attachments in your own lectures."
            });
        }

        // Find the attachment
        const attachment = lecture.attachments.id(attachmentId);
        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: "Attachment not found."
            });
        }

        // Update attachment title and fileType
        attachment.title = title;
        if (fileType) {
            attachment.fileType = fileType;
        }

        // Handle file update if provided
        if (file) {
            // Delete old file if exists
            if (attachment.fileName && fs.existsSync(path.join(attachmentsDir, attachment.fileName))) {
                fs.unlinkSync(path.join(attachmentsDir, attachment.fileName));
            }

            // Create a permanent destination for the new attachment
            const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
            const filePath = path.join(attachmentsDir, fileName);
            
            // Move file from temp upload location to permanent location
            fs.renameSync(file.path, filePath);
            
            // Update file info
            attachment.fileUrl = `http://localhost:8000/lecture-attachments/${fileName}`;
            attachment.fileName = fileName;
        }

        await lecture.save();

        return res.status(200).json({
            success: true,
            lecture,
            message: "Attachment updated successfully."
        });
    } catch (error) {
        console.log(error);
        // Clean up the uploaded file if there was an error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
            success: false,
            message: "Failed to update attachment."
        });
    }
};
export const removeLectureAttachment = async (req, res) => {
    try {
        const { attachmentId } = req.params;
        const lectureId = req.params.id;
        const userId = req.id;

        // Find lecture
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found."
            });
        }

        // Check if user is authorized (instructor of the course or admin)
        const course = await Course.findById(lecture.course);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        const isAdmin = req.user.role === "admin";
        const isInstructor = course.instructor.toString() === userId;

        if (!isAdmin && !isInstructor) {
            return res.status(403).json({
                success: false,
                message: "You can only remove attachments from your own lectures."
            });
        }

        // Find attachment
        const attachment = lecture.attachments.id(attachmentId);
        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: "Attachment not found."
            });
        }

        // Delete file
        if (attachment.fileName && fs.existsSync(path.join(attachmentsDir, attachment.fileName))) {
            fs.unlinkSync(path.join(attachmentsDir, attachment.fileName));
        }

        // Remove attachment from lecture
        lecture.attachments.pull(attachmentId);
        await lecture.save();

        return res.status(200).json({
            success: true,
            message: "Attachment removed successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove attachment."
        });
    }
};

// Keep the other controller methods (getCourseLectures, getLectureById) as they were
export const getCourseLectures = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        // Check if user is enrolled, is the instructor, or is an admin
        const user = await User.findById(userId);
        const isAdmin = req.user.role === "admin";
        const isInstructor = course.instructor.toString() === userId;
        const isEnrolled = user.enrolledCourses.some(id => id.toString() === courseId);

        if (!isAdmin && !isInstructor && !isEnrolled) {
            // Filter to only include preview lectures for non-enrolled users
            const previewLectures = await Lecture.find({
                course: courseId,
                isPreviewFree: true
            }).sort({ order: 1 });

            return res.status(200).json({
                success: true,
                lectures: previewLectures,
                isPreviewOnly: true
            });
        }

        // Get all lectures for the course
        const lectures = await Lecture.find({ course: courseId })
            .sort({ order: 1 });

        // For each lecture, check if the student has completed it (not applicable for instructors or admins)
        if (!isInstructor && !isAdmin && isEnrolled) {
            const lecturesWithProgress = lectures.map(lecture => {
                const completed = lecture.completedBy.some(
                    completion => completion.user.toString() === userId
                );
                
                return {
                    ...lecture._doc,
                    isCompleted: completed
                };
            });

            return res.status(200).json({
                success: true,
                lectures: lecturesWithProgress,
                isPreviewOnly: false
            });
        }

        return res.status(200).json({
            success: true,
            lectures,
            isPreviewOnly: false
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch lectures."
        });
    }
};

export const getLectureById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.id;

        // Get lecture
        const lecture = await Lecture.findById(id);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found."
            });
        }

        // Check if course exists
        const course = await Course.findById(lecture.course);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        // Check access permissions
        const user = await User.findById(userId);
        const isAdmin = req.user.role === "admin";
        const isInstructor = course.instructor.toString() === userId;
        const isEnrolled = user.enrolledCourses.some(id => id.toString() === lecture.course.toString());
        const isPreviewFree = lecture.isPreviewFree;

        if (!isAdmin && !isInstructor && !isEnrolled && !isPreviewFree) {
            return res.status(403).json({
                success: false,
                message: "You must enroll in this course to access this lecture."
            });
        }

        // Mark lecture as viewed/completed for enrolled students
        if (isEnrolled && !isInstructor && !isAdmin) {
            const completedIndex = lecture.completedBy.findIndex(
                completion => completion.user.toString() === userId
            );

            if (completedIndex === -1) {
                lecture.completedBy.push({
                    user: userId,
                    completedAt: new Date()
                });
                await lecture.save();
            }
        }

        return res.status(200).json({
            success: true,
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch lecture."
        });
    }
};