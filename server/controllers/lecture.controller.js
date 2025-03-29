import { Lecture } from "../models/lecture.model.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { uploadMedia, deleteMediaFromCloudinary } from "../utils/cloudinary.js";
import { sendCourseNotification } from "../utils/socket.js";

/**
 * Create a new lecture
 * @route POST /api/lectures
 * @access Instructor only
 */
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
        const instructorId = req.id;

        // Validate required fields
        if (!lectureTitle || !courseId || !order) {
            return res.status(400).json({
                success: false,
                message: "Title, course ID, and order are required."
            });
        }

        // Check if course exists and instructor is authorized
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        if (course.instructor.toString() !== instructorId) {
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

        // Upload video if provided
        if (videoFile) {
            const cloudResponse = await uploadMedia(videoFile.path);
            lectureData.videoUrl = cloudResponse.secure_url;
            lectureData.publicId = cloudResponse.public_id;
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
        return res.status(500).json({
            success: false,
            message: "Failed to create lecture."
        });
    }
};

/**
 * Get all lectures for a course
 * @route GET /api/lectures/course/:courseId
 * @access Private (Enrolled students and instructor)
 */
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

        // Check if user is enrolled or is the instructor
        const user = await User.findById(userId);
        const isInstructor = course.instructor.toString() === userId;
        const isEnrolled = user.enrolledCourses.some(id => id.toString() === courseId);

        if (!isInstructor && !isEnrolled) {
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

        // For each lecture, check if the student has completed it
        if (!isInstructor) {
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

/**
 * Get lecture by ID
 * @route GET /api/lectures/:id
 * @access Private (Enrolled students and instructor)
 */
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
        const isInstructor = course.instructor.toString() === userId;
        const isEnrolled = user.enrolledCourses.some(id => id.toString() === lecture.course.toString());
        const isPreviewFree = lecture.isPreviewFree;

        if (!isInstructor && !isEnrolled && !isPreviewFree) {
            return res.status(403).json({
                success: false,
                message: "You must enroll in this course to access this lecture."
            });
        }

        // Mark lecture as viewed/completed for enrolled students
        if (isEnrolled && !isInstructor) {
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

/**
 * Update lecture
 * @route PUT /api/lectures/:id
 * @access Instructor only
 */
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
        const instructorId = req.id;
        const lectureId = req.params.id;

        // Find lecture
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found."
            });
        }

        // Check if instructor is authorized
        const course = await Course.findById(lecture.course);
        if (!course || course.instructor.toString() !== instructorId) {
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
            if (lecture.videoUrl && lecture.publicId) {
                deleteMediaFromCloudinary(lecture.publicId);
            }

            // Upload new video
            const cloudResponse = await uploadMedia(videoFile.path);
            updateData.videoUrl = cloudResponse.secure_url;
            updateData.publicId = cloudResponse.public_id;
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
        return res.status(500).json({
            success: false,
            message: "Failed to update lecture."
        });
    }
};

/**
 * Delete lecture
 * @route DELETE /api/lectures/:id
 * @access Instructor only
 */
export const deleteLecture = async (req, res) => {
    try {
        const lectureId = req.params.id;
        const instructorId = req.id;

        // Find lecture
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found."
            });
        }

        // Check if instructor is authorized
        const course = await Course.findById(lecture.course);
        if (!course || course.instructor.toString() !== instructorId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete lectures in your own courses."
            });
        }

        // Delete video from cloudinary
        if (lecture.videoUrl && lecture.publicId) {
            deleteMediaFromCloudinary(lecture.publicId);
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

/**
 * Add attachment to lecture
 * @route POST /api/lectures/:id/attachments
 * @access Instructor only
 */
export const addLectureAttachment = async (req, res) => {
    try {
        const { title, fileType } = req.body;
        const lectureId = req.params.id;
        const instructorId = req.id;
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

        // Check if instructor is authorized
        const course = await Course.findById(lecture.course);
        if (!course || course.instructor.toString() !== instructorId) {
            return res.status(403).json({
                success: false,
                message: "You can only add attachments to your own lectures."
            });
        }

        // Upload file to cloudinary
        const cloudResponse = await uploadMedia(file.path);

        // Add attachment to lecture
        lecture.attachments.push({
            title,
            fileUrl: cloudResponse.secure_url,
            publicId: cloudResponse.public_id,
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
        return res.status(500).json({
            success: false,
            message: "Failed to add attachment."
        });
    }
};

/**
 * Remove attachment from lecture
 * @route DELETE /api/lectures/:id/attachments/:attachmentId
 * @access Instructor only
 */
export const removeLectureAttachment = async (req, res) => {
    try {
        const { attachmentId } = req.params;
        const lectureId = req.params.id;
        const instructorId = req.id;

        // Find lecture
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                success: false,
                message: "Lecture not found."
            });
        }

        // Check if instructor is authorized
        const course = await Course.findById(lecture.course);
        if (!course || course.instructor.toString() !== instructorId) {
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

        // Delete file from cloudinary
        if (attachment.publicId) {
            deleteMediaFromCloudinary(attachment.publicId);
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