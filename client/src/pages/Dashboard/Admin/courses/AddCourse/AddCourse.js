import React, { useState } from "react";
import AdminSidebar from "../../AdminSidebar";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import courseContext from "../../../../../context/course/courseContext";
import "quill/dist/quill.snow.css";
import Quill from "quill";
const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("New Course");
  const [courseUrl, setCourseUrl] = useState(
    "https://www.freementor.in/courses/new-course"
  );
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [isPublic, setIsPublic] = useState(false);
  const [isQnA, setIsQnA] = useState(false);
  const [pricingModel, setPricingModel] = useState("Free");
  const [visibility, setVisibility] = useState("Public");
  const [isScheduled, setIsScheduled] = useState(false);
  const [activeTab, setActiveTab] = useState("Visual");
  const [activeOption, setActiveOption] = useState("General");
  const [isLiveCourse, setIsLiveCourse] = useState(false);
  const [liveCourseSettings, setLiveCourseSettings] = useState({
    platform: "Zoom",
    sessionsPerWeek: 2,
    sessionDuration: 60,
    maxStudentsPerSession: 20,
    timeZone: "UTC",
  });
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState(null);
  const [introVideo, setIntroVideo] = useState(null);

  const CourseContext = useContext(courseContext);
  const { createCourse, updateLiveCourseSettings, error, clearErrors } =
    CourseContext;
  const quillRef = useRef(null);

  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = new Quill("#quill-editor", {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image"],
          ],
        },
        placeholder: "Enter course description...",
        theme: "snow",
      });

      // Set initial content if any
      if (description) {
        quillRef.current.root.innerHTML = description;
      }

      // Handle content changes
      quillRef.current.on("text-change", function () {
        setDescription(quillRef.current.root.innerHTML);
      });
    }
  }, []);
  useEffect(() => {
    if (error) {
      console.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);

  // handle file uploads
  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIntroVideo(e.target.files[0]);
    }
  };

  //handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data for file uploads
    const formData = new FormData();

    // Add main course details
    formData.append("title", courseTitle);
    formData.append("description", description);
    formData.append("level", difficulty);
    formData.append("language", "en");
    formData.append("duration[weeks]", 4);

    // Set price based on pricing model
    if (pricingModel === "Free") {
      formData.append("price", 0);
      formData.append("discountPrice", 0);
    } else {
      formData.append("price", 49.99);
      formData.append("discountPrice", 0);
    }

    // Append files if they exist
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      // First create the course
      const course = await createCourse(formData);

      // If it's a live course, update the live settings
      if (isLiveCourse && course && course._id) {
        await updateLiveCourseSettings(course._id, {
          isLive: true,
          platform: liveCourseSettings.platform,
          sessionsPerWeek: liveCourseSettings.sessionsPerWeek,
          sessionDuration: liveCourseSettings.sessionDuration,
          maxStudentsPerSession: liveCourseSettings.maxStudentsPerSession,
          timeZone: liveCourseSettings.timeZone,
        });
      }

      // Generate shareable URL
      const courseShareableUrl = `${window.location.origin}/courses/${
        course._id
      }/${encodeURIComponent(courseTitle.replace(/\s+/g, "-").toLowerCase())}`;

      // Navigate to course management or curriculum editor
      navigate(`/admin/courses/${course._id}/curriculum`, {
        state: {
          courseId: course._id,
          courseTitle,
          shareableUrl: courseShareableUrl,
        },
      });
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <AdminSidebar active="Courses" />

      <div className="flex-1 p-4 md:p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 md:p-6">
            <h1 className="text-2xl font-medium text-gray-700">Add Course</h1>
            <p className="text-sm text-gray-500">
              Manage and track all available courses
            </p>

            <div className="mt-6">
              {/* Course Builder Nav */}
              <div className="flex items-center border-b pb-4">
                <div className="flex space-x-2 md:space-x-6">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm mr-2">
                      1
                    </div>
                    <span className="font-medium">Basics</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm mr-2">
                      2
                    </div>
                    <span>Curriculum</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm mr-2">
                      3
                    </div>
                    <span>Additional</span>
                  </div>
                </div>

                <button className="ml-auto flex items-center text-sm text-pink-500">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Generate with AI
                </button>
              </div>

              <div className="mt-4 flex flex-col md:flex-row">
                {/* Left Form Section */}
                <div className="w-full md:w-2/3 md:pr-8">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Generated Course Link:{" "}
                      <span className="text-blue-600">
                        www.preplings.com/Course/goethee1/pipeethee1o123
                      </span>
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <span className="text-pink-500 ml-1">*</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button className="absolute right-2 top-2 text-gray-400 hover:text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Course URL
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Course URL :{" "}
                      <span className="text-blue-600">
                        www.preplings.com/exam/goethea1/
                        {courseTitle.toLowerCase().replace(/\s+/g, "")}
                        {Math.floor(Math.random() * 10000)}
                      </span>
                      <svg
                        className="w-4 h-4 inline-block ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <span className="text-pink-500 ml-1">*</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-700 mr-2">
                          Edit with:
                        </span>
                        <button className="bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                          B
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-300 rounded-md overflow-hidden">
                      <div id="quill-editor" className="min-h-40"></div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Options</h3>

                    <div className="flex">
                      <div className="w-1/3 border-r border-gray-200">
                        <div
                          className={`flex items-center p-3 cursor-pointer ${
                            activeOption === "General"
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setActiveOption("General")}
                        >
                          <svg
                            className={`w-5 h-5 mr-2 ${
                              activeOption === "General"
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span
                            className={`${
                              activeOption === "General"
                                ? "text-blue-700"
                                : "text-gray-500"
                            }`}
                          >
                            General
                          </span>
                        </div>

                        <div
                          className={`flex items-center p-3 cursor-pointer ${
                            activeOption === "ContentDrip"
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setActiveOption("ContentDrip")}
                        >
                          <svg
                            className={`w-5 h-5 mr-2 ${
                              activeOption === "ContentDrip"
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span
                            className={`${
                              activeOption === "ContentDrip"
                                ? "text-blue-700"
                                : "text-gray-500"
                            }`}
                          >
                            Content Drip
                          </span>
                        </div>

                        <div
                          className={`flex items-center p-3 cursor-pointer ${
                            activeOption === "Enrollment"
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setActiveOption("Enrollment")}
                        >
                          <svg
                            className={`w-5 h-5 mr-2 ${
                              activeOption === "Enrollment"
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                          </svg>
                          <span
                            className={`${
                              activeOption === "Enrollment"
                                ? "text-blue-700"
                                : "text-gray-500"
                            }`}
                          >
                            Enrollment
                          </span>
                        </div>

                        <div
                          className={`flex items-center p-3 cursor-pointer ${
                            activeOption === "LiveSettings"
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setActiveOption("LiveSettings")}
                        >
                          <svg
                            className={`w-5 h-5 mr-2 ${
                              activeOption === "LiveSettings"
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span
                            className={`${
                              activeOption === "LiveSettings"
                                ? "text-blue-700"
                                : "text-gray-500"
                            }`}
                          >
                            Live Course
                          </span>
                        </div>
                      </div>

                      <div className="w-2/3 p-4">
                        {activeOption === "General" && (
                          <>
                            <div className="mb-4">
                              <div className="flex items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Difficulty Level
                                </label>
                                <button className="ml-1 text-gray-400">
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </button>
                              </div>
                              <div className="relative">
                                <select
                                  value={difficulty}
                                  onChange={(e) =>
                                    setDifficulty(e.target.value)
                                  }
                                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                >
                                  <option>Beginner</option>
                                  <option>Intermediate</option>
                                  <option>Advanced</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <label className="block text-sm font-medium text-gray-700">
                                  Public Course
                                </label>
                                <button className="ml-1 text-gray-400">
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </button>
                              </div>
                              <div className="relative">
                                <div
                                  className={`w-12 h-6 flex items-center ${
                                    isPublic ? "bg-blue-500" : "bg-gray-200"
                                  } rounded-full p-1 cursor-pointer`}
                                  onClick={() => setIsPublic(!isPublic)}
                                >
                                  <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                                      isPublic
                                        ? "translate-x-6"
                                        : "translate-x-0"
                                    }`}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <label className="block text-sm font-medium text-gray-700">
                                  Q&A
                                </label>
                                <button className="ml-1 text-gray-400">
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </button>
                              </div>
                              <div className="relative">
                                <div
                                  className={`w-12 h-6 flex items-center ${
                                    isQnA ? "bg-blue-500" : "bg-gray-200"
                                  } rounded-full p-1 cursor-pointer`}
                                  onClick={() => setIsQnA(!isQnA)}
                                >
                                  <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                                      isQnA ? "translate-x-6" : "translate-x-0"
                                    }`}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        {activeOption === "LiveSettings" && (
                          <>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <label className="block text-sm font-medium text-gray-700">
                                  Live Course
                                </label>
                                <button className="ml-1 text-gray-400">
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </button>
                              </div>
                              <div className="relative">
                                <div
                                  className={`w-12 h-6 flex items-center ${
                                    isLiveCourse ? "bg-blue-500" : "bg-gray-200"
                                  } rounded-full p-1 cursor-pointer`}
                                  onClick={() => setIsLiveCourse(!isLiveCourse)}
                                >
                                  <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                                      isLiveCourse
                                        ? "translate-x-6"
                                        : "translate-x-0"
                                    }`}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            {isLiveCourse && (
                              <>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Platform
                                  </label>
                                  <select
                                    value={liveCourseSettings.platform}
                                    onChange={(e) =>
                                      setLiveCourseSettings({
                                        ...liveCourseSettings,
                                        platform: e.target.value,
                                      })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="Zoom">Zoom</option>
                                    <option value="Google Meet">
                                      Google Meet
                                    </option>
                                    <option value="Microsoft Teams">
                                      Microsoft Teams
                                    </option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>

                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sessions Per Week
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={liveCourseSettings.sessionsPerWeek}
                                    onChange={(e) =>
                                      setLiveCourseSettings({
                                        ...liveCourseSettings,
                                        sessionsPerWeek: parseInt(
                                          e.target.value
                                        ),
                                      })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>

                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Session Duration (minutes)
                                  </label>
                                  <input
                                    type="number"
                                    min="15"
                                    step="15"
                                    value={liveCourseSettings.sessionDuration}
                                    onChange={(e) =>
                                      setLiveCourseSettings({
                                        ...liveCourseSettings,
                                        sessionDuration: parseInt(
                                          e.target.value
                                        ),
                                      })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>

                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Students Per Session
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={
                                      liveCourseSettings.maxStudentsPerSession
                                    }
                                    onChange={(e) =>
                                      setLiveCourseSettings({
                                        ...liveCourseSettings,
                                        maxStudentsPerSession: parseInt(
                                          e.target.value
                                        ),
                                      })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Form Section */}
                <div className="w-full md:w-1/3 mt-6 md:mt-0">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => handleSubmit("draft")}
                        className="text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
                      >
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        Save as Draft
                      </button>

                      <div className="relative inline-block">
                        <button
                          onClick={() => handleSubmit("published")}
                          className="text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                          Publish
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-md mt-4">
                      <div className="p-4">
                        <h3 className="font-medium mb-2">Visibility</h3>
                        <div className="flex items-center mb-1">
                          <div className="relative w-full">
                            <select
                              value={visibility}
                              onChange={(e) => setVisibility(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                            >
                              <option>Public</option>
                              <option>Private</option>
                              <option>Password Protected</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Last updated on 27th March, 2025
                        </p>
                      </div>

                      <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Schedule</h3>
                          <div className="relative">
                            <div
                              className={`w-12 h-6 flex items-center ${
                                isScheduled ? "bg-blue-500" : "bg-gray-200"
                              } rounded-full p-1 cursor-pointer`}
                              onClick={() => setIsScheduled(!isScheduled)}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                                  isScheduled
                                    ? "translate-x-6"
                                    : "translate-x-0"
                                }`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium">Featured Image</h3>
                          <span className="text-pink-500 ml-1">*</span>
                        </div>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <svg
                              className="w-10 h-10 text-gray-400 mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <button
                              onClick={() =>
                                document
                                  .getElementById("thumbnailInput")
                                  .click()
                              }
                              className="text-blue-600 font-medium text-sm"
                            >
                              Upload Thumbnail
                            </button>
                            <input
                              id="thumbnailInput"
                              type="file"
                              accept="image/*"
                              onChange={handleThumbnailChange}
                              className="hidden"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              JPEG, PNG, GIF and WEBP formats, up to 512 MB
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 p-4">
                        <h3 className="font-medium mb-4">Intro Video</h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <button className="bg-blue-50 text-blue-600 p-2 rounded-md flex items-center justify-center mb-2">
                              <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() =>
                                document.getElementById("videoInput").click()
                              }
                              className="text-blue-600 font-medium text-sm"
                            >
                              Upload Video
                            </button>
                            <input
                              id="videoInput"
                              type="file"
                              accept="video/*"
                              onChange={handleVideoChange}
                              className="hidden"
                            />
                            <button className="text-blue-600 text-sm mt-1">
                              Add from URL
                            </button>
                            <p className="text-xs text-gray-500 mt-2">
                              MP4 and WebM formats, up to 512 MB
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 p-4">
                        <h3 className="font-medium mb-4">Pricing Model</h3>
                        <div className="mb-4">
                          <div className="flex space-x-8">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="free"
                                name="pricing"
                                checked={pricingModel === "Free"}
                                onChange={() => setPricingModel("Free")}
                                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <label
                                htmlFor="free"
                                className="ml-2 text-sm text-gray-700"
                              >
                                Free
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="paid"
                                name="pricing"
                                checked={pricingModel === "Paid"}
                                onChange={() => setPricingModel("Paid")}
                                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <label
                                htmlFor="paid"
                                className="ml-2 text-sm text-gray-700"
                              >
                                Paid
                              </label>
                            </div>
                          </div>
                        </div>

                        {pricingModel === "Paid" && (
                          <div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Regular Price
                              </label>
                              <div className="flex">
                                <div className="relative">
                                  <select className="appearance-none h-full rounded-l-md border border-r-0 bg-white border-gray-300 text-gray-700 py-2 px-3 pr-8">
                                    <option>€</option>
                                    <option>$</option>
                                    <option>£</option>
                                  </select>
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg
                                      className="w-4 h-4 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="flex-1 rounded-r-md border border-gray-300 py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="49.99"
                                />
                              </div>
                            </div>

                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Discounted Price
                              </label>
                              <div className="flex">
                                <div className="relative">
                                  <select className="appearance-none h-full rounded-l-md border border-r-0 bg-white border-gray-300 text-gray-700 py-2 px-3 pr-8">
                                    <option>€</option>
                                    <option>$</option>
                                    <option>£</option>
                                  </select>
                                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg
                                      className="w-4 h-4 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="flex-1 rounded-r-md border border-gray-300 py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="border-t border-gray-200 p-4">
                        <h3 className="font-medium mb-2">Categories</h3>
                        <div className="border border-gray-300 rounded-md p-3">
                          <p className="text-sm text-gray-500">
                            No categories found.
                          </p>
                          <button className="text-blue-600 font-medium text-sm mt-2 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            Add
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 p-4">
                        <h3 className="font-medium mb-2">Tags</h3>
                        <input
                          type="text"
                          placeholder="Add tags"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="border-t border-gray-200 p-4">
                        <h3 className="font-medium mb-2">Author</h3>
                        <div className="relative">
                          <div className="flex items-center p-2 border border-gray-300 rounded-md">
                            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-2">
                              <img
                                src="/api/placeholder/32/32"
                                alt="Admin Avatar"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">admin</p>
                              <p className="text-xs text-gray-500">
                                admin@freementor.in
                              </p>
                            </div>
                            <div className="text-gray-400">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
