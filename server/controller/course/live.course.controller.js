import { Course } from "../../models/course.model.js";
import { LiveSession } from "../../models//live.course.model.js";
import { User } from "../../models/user.model.js";
import { sendCourseNotification } from "../../socket/socket.js";

// Create a new batch for a live course
export const createCourseBatch = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { batchName, startDate, endDate, maxStudents } = req.body;

        // Validate required fields
        if (!batchName || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Batch name, start date, and end date are required."
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
                message: "You are not authorized to add batches to this course"
            });
        }

        // Add batch to course
        course.batches.push({
            batchName,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            maxStudents: maxStudents || 30,
            enrollmentOpen: true,
            currentEnrollments: 0
        });

        await course.save();

        return res.status(201).json({
            success: true,
            course,
            message: "Course batch created successfully."
        });
    } catch (error) {
        console.error('Create Batch Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course batch"
        });
    }
};

// Update a course batch
export const updateCourseBatch = async (req, res) => {
    try {
        const { courseId, batchId } = req.params;
        const { batchName, startDate, endDate, maxStudents, enrollmentOpen } = req.body;

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
                message: "You are not authorized to update batches for this course"
            });
        }

        // Find batch
        const batch = course.batches.id(batchId);
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: "Batch not found!"
            });
        }

        // Update batch
        if (batchName) batch.batchName = batchName;
        if (startDate) batch.startDate = new Date(startDate);
        if (endDate) batch.endDate = new Date(endDate);
        if (maxStudents !== undefined) batch.maxStudents = maxStudents;
        if (enrollmentOpen !== undefined) batch.enrollmentOpen = enrollmentOpen;

        await course.save();

        return res.status(200).json({
            success: true,
            course,
            message: "Course batch updated successfully."
        });
    } catch (error) {
        console.error('Update Batch Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to update course batch"
        });
    }
};

// Schedule a live session
export const scheduleLiveSession = async (req, res) => {
    try {
        const {
            courseId,
            batchId,
            title,
            description,
            scheduledTime,
            duration,
            platform,
            meetingLink,
            meetingId,
            meetingPassword,
            materials
        } = req.body;

        // Validate required fields
        if (!title || !scheduledTime || !courseId || !batchId) {
            return res.status(400).json({
                success: false,
                message: "Title, scheduled time, course ID, and batch ID are required."
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

        // Check if batch exists
        const batch = course.batches.id(batchId);
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: "Batch not found!"
            });
        }

        // Authorization check
        if (req.user.role !== "admin" && course.instructor.toString() !== req.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to schedule sessions for this course"
            });
        }
    

        let materialPaths = [];
        if (req.files && req.files.length > 0) {
            materialPaths = req.files.map(file => {
                // Create full URL for the file
                return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            });
        }
        // Create live session
        const liveSession = await LiveSession.create({
            course: courseId,
            title,
            description,
            batch: batch.batchName,
            instructor: req.id,
            scheduledTime: new Date(scheduledTime),
            duration: duration || 60,
            platform: platform || "Zoho",
            meetingLink,
            meetingId,
            meetingPassword,
            materials: materialPaths || [],
            status: "scheduled"
        });

        // Notify enrolled students
        const enrolledStudents = await User.find({
            _id: { $in: course.enrolledStudents }
        });

        enrolledStudents.forEach(student => {
            sendCourseNotification(student._id.toString(), {
                title: "New Live Session Scheduled",
                message: `A new live session "${title}" has been scheduled for your course "${course.title}"`,
                courseId,
                sessionId: liveSession._id
            });
        });

        return res.status(201).json({
            success: true,
            liveSession,
            message: "Live session scheduled successfully."
        });
    } catch (error) {
        console.error('Schedule Live Session Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to schedule live session"
        });
    }
};

// Update a live session
export const updateLiveSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const {
            title,
            description,
            scheduledTime,
            duration,
            platform,
            meetingLink,
            meetingId,
            meetingPassword,
            status
        } = req.body;

        // Check if session exists
        const liveSession = await LiveSession.findById(sessionId);
        if (!liveSession) {
            return res.status(404).json({
                success: false,
                message: "Live session not found!"
            });
        }

        // Check if course exists
        const course = await Course.findById(liveSession.course);
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
                message: "You are not authorized to update this session"
            });
        }

        // Process uploaded files
        let materialPaths = liveSession.materials || [];
        if (req.files && req.files.length > 0) {
            const newMaterialPaths = req.files.map(file => {
                // Create full URL for the file
                return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
            });
            
            // Combine existing materials with new ones
            materialPaths = [...materialPaths, ...newMaterialPaths];
        }

        // Create update object
        const updateData = {
            ...(title && { title }),
            ...(description && { description }),
            ...(scheduledTime && { scheduledTime: new Date(scheduledTime) }),
            ...(duration && { duration }),
            ...(platform && { platform }),
            ...(meetingLink && { meetingLink }),
            ...(meetingId && { meetingId }),
            ...(meetingPassword && { meetingPassword }),
            ...(status && { status }),
            materials: materialPaths
        };

        // Update session
        const updatedSession = await LiveSession.findByIdAndUpdate(
            sessionId,
            updateData,
            { new: true }
        );

        // If the time was changed, notify participants
        if (scheduledTime && liveSession.scheduledTime.toString() !== new Date(scheduledTime).toString()) {
            const enrolledStudents = await User.find({
                _id: { $in: course.enrolledStudents }
            });

            enrolledStudents.forEach(student => {
                sendCourseNotification(student._id.toString(), {
                    title: "Live Session Rescheduled",
                    message: `The live session "${updatedSession.title}" for "${course.title}" has been rescheduled`,
                    courseId: course._id,
                    sessionId: updatedSession._id
                });
            });
        }

        return res.status(200).json({
            success: true,
            liveSession: updatedSession,
            message: "Live session updated successfully."
        });
    } catch (error) {
        console.error('Update Live Session Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to update live session"
        });
    }
};
// Cancel a live session
export const cancelLiveSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { cancellationReason } = req.body;

        // Check if session exists
        const liveSession = await LiveSession.findById(sessionId);
        if (!liveSession) {
            return res.status(404).json({
                success: false,
                message: "Live session not found!"
            });
        }

        // Check if course exists
        const course = await Course.findById(liveSession.course);
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
                message: "You are not authorized to cancel this session"
            });
        }

        // Update session status to cancelled
        liveSession.status = "cancelled";
        liveSession.cancellationReason = cancellationReason;
        await liveSession.save();

        // Notify enrolled students
        const enrolledStudents = await User.find({
            _id: { $in: course.enrolledStudents }
        });

        enrolledStudents.forEach(student => {
            sendCourseNotification(student._id.toString(), {
                title: "Live Session Cancelled",
                message: `The live session "${liveSession.title}" for "${course.title}" has been cancelled${cancellationReason ? `: ${cancellationReason}` : ''}`,
                courseId: course._id,
                sessionId: liveSession._id
            });
        });

        return res.status(200).json({
            success: true,
            message: "Live session cancelled successfully."
        });
    } catch (error) {
        console.error('Cancel Live Session Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel live session"
        });
    }
};

// Get upcoming live sessions for a course
export const getUpcomingLiveSessions = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { batchId } = req.query;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        // Build query
        const query = {
            course: courseId,
            scheduledTime: { $gte: new Date() },
            status: "scheduled"
        };

        // If batch is specified, filter by batch
        if (batchId) {
            const batch = course.batches.id(batchId);
            if (!batch) {
                return res.status(404).json({
                    success: false,
                    message: "Batch not found!"
                });
            }
            query.batch = batch.batchName;
        }

        // Get upcoming sessions
        const upcomingSessions = await LiveSession.find(query)
            .populate("instructor", "name photoUrl")
            .sort({ scheduledTime: 1 });

        return res.status(200).json({
            success: true,
            sessions: upcomingSessions
        });
    } catch (error) {
        console.error('Get Upcoming Sessions Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to get upcoming live sessions"
        });
    }
};

// Get past live sessions for a course
export const getPastLiveSessions = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { batchId } = req.query;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        // Build query for past sessions
        const query = {
            course: courseId,
            $or: [
                { scheduledTime: { $lt: new Date() }, status: { $ne: "cancelled" } },
                { status: "completed" }
            ]
        };

        // If batch is specified, filter by batch
        if (batchId) {
            const batch = course.batches.id(batchId);
            if (!batch) {
                return res.status(404).json({
                    success: false,
                    message: "Batch not found!"
                });
            }
            query.batch = batch.batchName;
        }

        // Get past sessions
        const pastSessions = await LiveSession.find(query)
            .populate("instructor", "name photoUrl")
            .sort({ scheduledTime: -1 });

        return res.status(200).json({
            success: true,
            sessions: pastSessions
        });
    } catch (error) {
        console.error('Get Past Sessions Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to get past live sessions"
        });
    }
};

// Join a live session (for students)
export const joinLiveSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.id;

        // Check if session exists
        const liveSession = await LiveSession.findById(sessionId);
        if (!liveSession) {
            return res.status(404).json({
                success: false,
                message: "Live session not found!"
            });
        }

        // Check if course exists
        const course = await Course.findById(liveSession.course);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        // Check if user is enrolled in the course
        const isEnrolled = course.enrolledStudents.some(studentId => 
            studentId.toString() === userId
        );

        if (!isEnrolled && req.user.role !== "admin" && course.instructor.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course"
            });
        }

        // Check if session is scheduled or ongoing
        if (liveSession.status !== "scheduled" && liveSession.status !== "ongoing") {
            return res.status(400).json({
                success: false,
                message: `This session is ${liveSession.status}. You cannot join it.`
            });
        }

        // Record participant joining
        const participantIndex = liveSession.participants.findIndex(
            p => p.user.toString() === userId
        );

        if (participantIndex === -1) {
            // Add new participant
            liveSession.participants.push({
                user: userId,
                attended: true,
                joinTime: new Date()
            });
        } else {
            // Update existing participant
            liveSession.participants[participantIndex].attended = true;
            liveSession.participants[participantIndex].joinTime = new Date();
        }

        // If this is the first join and the instructor is joining, update status to ongoing
        if (course.instructor.toString() === userId && liveSession.status === "scheduled") {
            liveSession.status = "ongoing";
        }

        await liveSession.save();

        return res.status(200).json({
            success: true,
            meetingDetails: {
                platform: liveSession.platform,
                meetingLink: liveSession.meetingLink,
                meetingId: liveSession.meetingId,
                meetingPassword: liveSession.meetingPassword
            },
            message: "Joined live session successfully."
        });
    } catch (error) {
        console.error('Join Live Session Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to join live session"
        });
    }
};

// Leave a live session (for students)
export const leaveLiveSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.id;

        // Check if session exists
        const liveSession = await LiveSession.findById(sessionId);
        if (!liveSession) {
            return res.status(404).json({
                success: false,
                message: "Live session not found!"
            });
        }

        // Find participant
        const participantIndex = liveSession.participants.findIndex(
            p => p.user.toString() === userId
        );

        if (participantIndex === -1) {
            return res.status(400).json({
                success: false,
                message: "You have not joined this session"
            });
        }

        // Update leave time
        liveSession.participants[participantIndex].leaveTime = new Date();

        // If this is the instructor leaving and the session is ongoing, check if we should end it
        const course = await Course.findById(liveSession.course);
        if (course.instructor.toString() === userId && liveSession.status === "ongoing") {
            // Check if all participants have left
            const allLeft = liveSession.participants.every(p => p.leaveTime);
            if (allLeft) {
                liveSession.status = "completed";
            }
        }

        await liveSession.save();

        return res.status(200).json({
            success: true,
            message: "Left live session successfully."
        });
    } catch (error) {
        console.error('Leave Live Session Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to record leaving live session"
        });
    }
};

// Enroll in a course batch
export const enrollInCourseBatch = async (req, res) => {
    try {
        const { courseId, batchId } = req.params;
        const userId = req.id;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        // Check if batch exists
        const batch = course.batches.id(batchId);
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: "Batch not found!"
            });
        }

        // Check if enrollment is open
        if (!batch.enrollmentOpen) {
            return res.status(400).json({
                success: false,
                message: "Enrollment for this batch is closed"
            });
        }

        // Check if batch is full
        if (batch.currentEnrollments >= batch.maxStudents) {
            return res.status(400).json({
                success: false,
                message: "This batch is full"
            });
        }

        // Check if user is already enrolled in the course
        const alreadyEnrolled = course.enrolledStudents.some(studentId => 
            studentId.toString() === userId
        );

        if (alreadyEnrolled) {
            return res.status(400).json({
                success: false,
                message: "You are already enrolled in this course"
            });
        }

        // Add user to enrolled students
        course.enrolledStudents.push(userId);

        // Increment batch enrollment count
        batch.currentEnrollments += 1;

        await course.save();

        // Update user's enrolled courses
        await User.findByIdAndUpdate(
            userId,
            { $push: { enrolledCourses: courseId } }
        );

        return res.status(200).json({
            success: true,
            message: "Enrolled in course batch successfully."
        });
    } catch (error) {
        console.error('Enroll In Course Batch Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to enroll in course batch"
        });
    }
};

// Get course analytics for an instructor
export const getLiveSessionAnalytics = async (req, res) => {
    try {
        const { courseId } = req.params;
        const instructorId = req.id;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        // Authorization check
        if (req.user.role !== "admin" && course.instructor.toString() !== instructorId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view analytics for this course"
            });
        }

        // Get all live sessions for the course
        const liveSessions = await LiveSession.find({ course: courseId });

        // Calculate analytics
        const analytics = {
            totalSessions: liveSessions.length,
            completedSessions: liveSessions.filter(s => s.status === "completed").length,
            cancelledSessions: liveSessions.filter(s => s.status === "cancelled").length,
            upcomingSessions: liveSessions.filter(s => 
                s.status === "scheduled" && new Date(s.scheduledTime) > new Date()
            ).length,
            averageAttendance: 0,
            totalUniqueParticipants: 0,
            participationByBatch: {},
            sessionsByWeekday: {
                "Sunday": 0,
                "Monday": 0,
                "Tuesday": 0,
                "Wednesday": 0,
                "Thursday": 0,
                "Friday": 0,
                "Saturday": 0
            }
        };

        // Process each session
        const allParticipants = new Set();
        const batchParticipants = {};

        liveSessions.forEach(session => {
            // Calculate weekday distribution
            const weekday = new Date(session.scheduledTime).toLocaleString('en-us', { weekday: 'long' });
            analytics.sessionsByWeekday[weekday]++;

            // Calculate attendance
            session.participants.forEach(participant => {
                allParticipants.add(participant.user.toString());
                
                // Track participants by batch
                if (!batchParticipants[session.batch]) {
                    batchParticipants[session.batch] = new Set();
                }
                batchParticipants[session.batch].add(participant.user.toString());
            });
        });

        // Calculate average attendance and unique participants
        analytics.totalUniqueParticipants = allParticipants.size;
        
        // Calculate average attendance per session (for completed sessions)
        const completedSessions = liveSessions.filter(s => s.status === "completed");
        const totalAttendance = completedSessions.reduce((sum, session) => 
            sum + session.participants.filter(p => p.attended).length, 0);
            
        analytics.averageAttendance = completedSessions.length > 0 
            ? totalAttendance / completedSessions.length 
            : 0;
            
        // Format participation by batch
        Object.keys(batchParticipants).forEach(batch => {
            analytics.participationByBatch[batch] = batchParticipants[batch].size;
        });

        return res.status(200).json({
            success: true,
            analytics
        });
    } catch (error) {
        console.error('Live Session Analytics Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to get live session analytics"
        });
    }
};

// Add session recording
export const addSessionRecording = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { recordingUrl } = req.body;

        if (!recordingUrl) {
            return res.status(400).json({
                success: false,
                message: "Recording URL is required"
            });
        }

        // Check if session exists
        const liveSession = await LiveSession.findById(sessionId);
        if (!liveSession) {
            return res.status(404).json({
                success: false,
                message: "Live session not found!"
            });
        }

        // Check if course exists
        const course = await Course.findById(liveSession.course);
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
                message: "You are not authorized to add recordings to this session"
            });
        }

        // Add recording URL
        liveSession.recordingUrl = recordingUrl;
        
        // If session is not already completed, mark it as completed
        if (liveSession.status !== "completed") {
            liveSession.status = "completed";
        }
        
        await liveSession.save();

        // Notify enrolled students
        const enrolledStudents = await User.find({
            _id: { $in: course.enrolledStudents }
        });

        enrolledStudents.forEach(student => {
            sendCourseNotification(student._id.toString(), {
                title: "Session Recording Available",
                message: `The recording for "${liveSession.title}" is now available`,
                courseId: course._id,
                sessionId: liveSession._id
            });
        });

        return res.status(200).json({
            success: true,
            message: "Session recording added successfully."
        });
    } catch (error) {
        console.error('Add Session Recording Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to add session recording"
        });
    }
};

// Update live course settings
export const updateLiveCourseSettings = async (req, res) => {
    try {
        const { courseId } = req.params;
        const {
            isLive,
            platform,
            sessionsPerWeek,
            sessionDuration,
            maxStudentsPerSession,
            timeZone
        } = req.body;

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

        // Update live course settings
        course.isLive = isLive !== undefined ? isLive : course.isLive;
        
        // Update live session details if provided
        if (isLive) {
            course.liveSessionDetails = {
                platform: platform || course.liveSessionDetails?.platform || "Zoom",
                sessionsPerWeek: sessionsPerWeek !== undefined ? sessionsPerWeek : (course.liveSessionDetails?.sessionsPerWeek || 2),
                sessionDuration: sessionDuration !== undefined ? sessionDuration : (course.liveSessionDetails?.sessionDuration || 60),
                maxStudentsPerSession: maxStudentsPerSession !== undefined ? maxStudentsPerSession : (course.liveSessionDetails?.maxStudentsPerSession || 20),
                timeZone: timeZone || course.liveSessionDetails?.timeZone || "UTC"
            };
        }

        await course.save();

        return res.status(200).json({
            success: true,
            course,
            message: "Live course settings updated successfully."
        });
    } catch (error) {
        console.error('Update Live Course Settings Error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to update live course settings"
        });
    }
};