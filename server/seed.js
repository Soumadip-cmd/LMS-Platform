// seed.js - Run this script to populate your database with dummy data
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Course } from "./models/course.model.js";
import { Language } from "./models/language.model.js";
import { Lecture } from "./models/lecture.model.js";
import { CourseProgress } from "./models/courseprogress.model.js";
import { User } from "./models/user.model.js";
import { UserAchievement, Achievement } from "./models/achievement.model.js";

// Load environment variables
dotenv.config();

// Connect to database
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB for seeding"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Sample user ID - we'll need this to associate course progress
let userId;

// Create sample data
const seedDatabase = async () => {
    try {
        console.log("Clearing existing data...");
        // Clear existing data
        await Course.deleteMany({});
        await Language.deleteMany({});
        await Lecture.deleteMany({});
        await CourseProgress.deleteMany({});
        await UserAchievement.deleteMany({});

        console.log("Getting user...");
        // Get a user from the database to associate with the courses
        // If you're testing with a specific user, set the email here
        const user = await User.findOne({ email: "sd901656@gmail.com" });

        if (!user) {
            console.log("No user found! Creating a test user...");
            const newUser = await User.create({
                name: "Test Student",
                email: "student@example.com",
                password: "password123",
                role: "student",
            });
            userId = newUser._id;
        } else {
            userId = user._id;
            console.log("Using existing user:", user.name);
        }

        console.log("Creating languages...");
        // Create languages
        const languages = await Language.create([
            {
                name: "German",
                code: "de",
                icon: "https://placehold.co/100x100?text=DE",
            },
            {
                name: "French",
                code: "fr",
                icon: "https://placehold.co/100x100?text=FR",
            },
            {
                name: "Spanish",
                code: "es",
                icon: "https://placehold.co/100x100?text=ES",
            },
            {
                name: "Italian",
                code: "it",
                icon: "https://placehold.co/100x100?text=IT",
            },
            {
                name: "Portuguese",
                code: "pt",
                icon: "https://placehold.co/100x100?text=PT",
            },
        ]);

        console.log("Creating courses...");
        // Array of course definitions with appropriate color classes for the UI
        const courseDefinitions = [
            {
                title: "German B2 Course",
                language: languages[0]._id,
                level: "Intermediate",
                progress: 75,
                status: "Ongoing",
                color: "bg-yellow-400",
            },
            {
                title: "German Advanced",
                language: languages[0]._id,
                level: "Advanced",
                progress: 100,
                status: "Completed",
                color: "bg-green-500",
            },
            {
                title: "French Beginner",
                language: languages[1]._id,
                level: "Beginner",
                progress: 40,
                status: "Ongoing",
                color: "bg-purple-500",
            },
            {
                title: "Spanish Intermediate",
                language: languages[2]._id,
                level: "Intermediate",
                progress: 25,
                status: "Ongoing",
                color: "bg-yellow-400",
            },
            {
                title: "Italian Basics",
                language: languages[3]._id,
                level: "Beginner",
                progress: 60,
                status: "Ongoing",
                color: "bg-purple-500",
            },
            {
                title: "French Communication",
                language: languages[1]._id,
                level: "Beginner",
                progress: 15,
                status: "Ongoing",
                color: "bg-blue-500",
            },
            {
                title: "Spanish Conversation",
                language: languages[2]._id,
                level: "Intermediate",
                progress: 50,
                status: "Ongoing",
                color: "bg-red-500",
            },
            {
                title: "Italian Culture",
                language: languages[3]._id,
                level: "Beginner",
                progress: 80,
                status: "Ongoing",
                color: "bg-green-500",
            },
            {
                title: "Portuguese Basics",
                language: languages[4]._id,
                level: "Beginner",
                progress: 30,
                status: "Ongoing",
                color: "bg-yellow-400",
            },
        ];

        // Create courses and their lectures
        const courses = [];
        const lectures = [];
        const progressRecords = [];

        for (const courseDef of courseDefinitions) {
            // Create course
            const course = await Course.create({
                title: courseDef.title,
                language: courseDef.language,
                level: courseDef.level,
                description: `Learn ${courseDef.title} with our comprehensive course`,
                duration: { weeks: 12 },
                price: 149.99,
                discountPrice: 99.99,
                status: "published",
                thumbnailUrl: `https://placehold.co/400x200?text=${encodeURIComponent(
                    courseDef.title.replace(/\s+/g, "+")
                )}`,
                instructor: userId, // Use the current user as instructor for simplicity
            });

            courses.push(course);

            console.log(`Created course: ${course.title}`);

            // Create 20 lectures for each course
            const courseLectures = [];
            for (let i = 1; i <= 20; i++) {
                const lecture = await Lecture.create({
                    course: course._id,
                    lectureTitle: `Lecture ${i}: ${course.title}`,
                    description: `Learn about topic ${i} in ${course.title}`,
                    duration: 45, // Minutes
                    order: i,
                    videoUrl: `https://example.com/videos/lecture-${i}.mp4`,
                    isPublished: true,
                });

                courseLectures.push(lecture);
                lectures.push(lecture);
            }

            // Update course with lectures
            course.lessons = courseLectures.map((lecture) => lecture._id);
            await course.save();

            // Create course progress
            const totalLectures = courseLectures.length;
            const completedLectures = Math.round(
                (courseDef.progress / 100) * totalLectures
            );

            const lectureProgress = [];
            for (let i = 0; i < totalLectures; i++) {
                if (i < completedLectures) {
                    lectureProgress.push({
                        lectureId: courseLectures[i]._id,
                        viewed: true,
                        completedAt: new Date(
                            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
                        ), // Random date in the last 30 days
                    });
                }
            }

            const progress = await CourseProgress.create({
                userId,
                courseId: course._id,
                completed: courseDef.status === "Completed",
                lectureProgress,
                lastAccessedAt: new Date(),
                studyTime: Math.round(Math.random() * 10000), // Random study time in seconds
            });

            progressRecords.push(progress);
        }

        console.log("Creating achievements...");
        // Create achievements
        const achievements = [];
        const achievementDefinitions = [
            {
                title: "First Course Started",
                description: "You started your first course!",
                criteria: "FIRST_COURSE",
                threshold: 1,
            },
            {
                title: "First Lecture Completed",
                description: "You completed your first lecture!",
                criteria: "FIRST_COURSE",
                threshold: 1,
            },
            {
                title: "First Course Completed",
                description: "You completed your first course!",
                criteria: "COURSE_COMPLETION",
                threshold: 1,
            },
            {
                title: "Study Streak: 3 Days",
                description: "You studied for 3 days in a row!",
                criteria: "STREAK",
                threshold: 3,
            },
            {
                title: "Study Streak: 7 Days",
                description: "You studied for 7 days in a row!",
                criteria: "STREAK",
                threshold: 7,
            },
            {
                title: "Study Streak: 30 Days",
                description: "You studied for 30 days in a row!",
                criteria: "STREAK",
                threshold: 30,
            },
            {
                title: "Language Explorer",
                description: "You enrolled in courses for 3 different languages!",
                criteria: "MULTIPLE_COURSES",
                threshold: 3,
            },
            {
                title: "Vocab Master",
                description: "You scored 100% on a vocabulary quiz!",
                criteria: "QUIZ_PERFECT",
                threshold: 1,
            },
            {
                title: "Grammar Champion",
                description: "You scored 100% on 5 grammar quizzes!",
                criteria: "QUIZ_PERFECT",
                threshold: 5,
            },
            {
                title: "Study Enthusiast",
                description: "You studied for more than 10 hours!",
                criteria: "STUDY_TIME",
                threshold: 10,
            },
            {
                title: "Dedicated Learner",
                description: "You studied for more than 50 hours!",
                criteria: "STUDY_TIME",
                threshold: 50,
            },
            {
                title: "Language Master",
                description: "You completed 5 courses!",
                criteria: "MULTIPLE_COURSES",
                threshold: 5,
            },
        ];

        // First create Achievement records
        const achievementRecords = [];
        for (const achievementDef of achievementDefinitions) {
            const achievement = await Achievement.create({
                title: achievementDef.title,
                description: achievementDef.description,
                criteria: achievementDef.criteria,
                threshold: achievementDef.threshold,
                icon: "https://placehold.co/100x100?text=Achievement",
            });
            achievementRecords.push(achievement);
        }

        const userAchievements = [];
        for (const achievementRecord of achievementRecords) {
            const userAchievement = await UserAchievement.create({
                userId,
                achievementId: achievementRecord._id,
                earnedAt: new Date(
                    Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
                ), // Random date in the last 60 days
            });

            userAchievements.push(userAchievement);
        }

        achievements.push(...achievementRecords);

        console.log("Database seeding completed successfully!");
        console.log(
            `Created: ${languages.length} languages, ${courses.length} courses, ${lectures.length} lectures, ${progressRecords.length} progress records, ${achievements.length} achievements`
        );

        return {
            languages,
            courses,
            lectures,
            progressRecords,
            achievements,
        };
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        // Close the database connection when done
        mongoose.connection.close();
    }
};

seedDatabase();
