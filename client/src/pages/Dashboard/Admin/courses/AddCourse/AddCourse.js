import React, { useState, useEffect, useContext } from "react";
import AdminSidebar from "../../AdminSidebar";
import { useNavigate } from "react-router-dom";
import courseContext from "../../../../../context/course/courseContext";
import { Upload, Calendar, Clock, ChevronDown, FileText } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import CourseOptions from "./components/CourseOptions";
import CourseMaterial from "./components/CourseMaterial";
import CourseBasics from "./components/CourseBasics";

const AddCourse = () => {
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ["Basics", "Course Material", "Additional"];

  // Basic course information
  const [courseTitle, setCourseTitle] = useState("");
  const [courseUrl, setCourseUrl] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");

  // Additional course information
  const [whatWillLearn, setWhatWillLearn] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [courseDurationHours, setCourseDurationHours] = useState(0);
  const [courseDurationMinutes, setCourseDurationMinutes] = useState(0);
  const [materialsIncluded, setMaterialsIncluded] = useState("");
  const [requirements, setRequirements] = useState("");

  // Course settings
  const [visibility, setVisibility] = useState("Public");
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
  const [pricingModel, setPricingModel] = useState("Free");
  const [regularPrice, setRegularPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [currency, setCurrency] = useState("€");
  const [thumbnail, setThumbnail] = useState(null);

  // Schedule settings
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Media
  const [featuredImage, setFeaturedImage] = useState(null);
  const [introVideo, setIntroVideo] = useState(null);
  const [introVideoUrl, setIntroVideoUrl] = useState("");

  // Options
  const [activeOption, setActiveOption] = useState("General");
  const [language, setLanguage] = useState("");
  const [examLevel, setExamLevel] = useState("");
  const [examPattern, setExamPattern] = useState("");
  const [isPublicCourse, setIsPublicCourse] = useState(true);
  const [isQnA, setIsQnA] = useState(true);
  const [isSequential, setIsSequential] = useState(true);
  const [tags, setTags] = useState("");

  // Live course settings
  const [isLiveCourse, setIsLiveCourse] = useState(false);
  const [liveCourseSettings, setLiveCourseSettings] = useState({
    platform: "Zoom",
    sessionsPerWeek: 2,
    sessionDuration: 60,
    maxStudentsPerSession: 20,
    timeZone: "UTC",
  });

  const navigate = useNavigate();

  const CourseContext = useContext(courseContext);
  const { createCourse, updateLiveCourseSettings, error, clearErrors } = CourseContext;

  useEffect(() => {
    if (error) {
      console.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);

  // Generate course URL from title
  useEffect(() => {
    if (courseTitle) {
      const formattedTitle = courseTitle.toLowerCase().replace(/\s+/g, '-');
      setCourseUrl(`www.preplings.com/exam/goethea1/${formattedTitle}${Math.floor(Math.random() * 10000)}`);
    }
  }, [courseTitle]);

  // Handle featured image upload
  const handleFeaturedImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFeaturedImage(e.target.files[0]);
    }
  };

  // Handle intro video upload
  const handleIntroVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIntroVideo(e.target.files[0]);
    }
  };

  //handleSubmit function
  const handleSubmit = async (status = "draft") => {
    // Show loading toast
    const loadingToast = toast.loading(status === "draft" ? "Saving draft..." : "Publishing course...");

    // Create form data for file uploads
    const formData = new FormData();

    // Add main course details
    formData.append("title", courseTitle);
    formData.append("description", description);
    formData.append("level", difficulty);
    formData.append("language", language || "en");
    formData.append("whatWillLearn", whatWillLearn);
    formData.append("targetAudience", targetAudience);
    formData.append("materialsIncluded", materialsIncluded);
    formData.append("requirements", requirements);

    // Calculate total duration in minutes
    const totalDurationMinutes = (courseDurationHours * 60) + courseDurationMinutes;
    formData.append("duration[minutes]", totalDurationMinutes);
    formData.append("duration[hours]", courseDurationHours);
    formData.append("duration[weeks]", 4); // Default value
    formData.append("status", status);

    // Set price based on pricing model
    if (pricingModel === "Free") {
      formData.append("price", 0);
      formData.append("discountPrice", 0);
    } else {
      formData.append("price", regularPrice || 49.99);
      formData.append("discountPrice", discountedPrice || 0);
    }

    // Append files if they exist
    if (featuredImage) {
      formData.append("thumbnail", featuredImage);
    }

    try {
      // First create the course
      const course = await createCourse(formData);

      if (!course) {
        toast.error("Failed to create course");
        toast.dismiss(loadingToast);
        throw new Error("Failed to create course");
      }

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

      // Show success toast
      toast.dismiss(loadingToast);
      toast.success(status === "draft" ? "Course draft saved successfully!" : "Course published successfully!");

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
      toast.dismiss(loadingToast);
      toast.error("Error creating course: " + (error.message || "Please try again"));
    }
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar active="Courses" />
      <Toaster position="top-center" />

      <div className="flex-1">
        <div className="p-6">
          <h1 className="text-2xl font-medium text-gray-700 mb-6">Add Course</h1>

          {/* Course Builder Nav */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <h3 className="text-sm font-medium uppercase text-gray-500 mr-6">COURSE BUILDER</h3>
              <div className="flex items-center">
                {steps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                          currentStep >= index + 1 ? 'bg-yellow-400' : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`ml-2 text-sm ${
                          currentStep >= index + 1 ? 'text-gray-700' : 'text-gray-500'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-8 mx-2 h-px bg-gray-300"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleSubmit("draft")}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white"
              >
                Cancel
              </button>
              <div className="relative inline-block">
                <button
                  onClick={() => handleSubmit("published")}
                  className="flex items-center px-4 py-2 bg-yellow-400 rounded-md text-sm font-medium text-white"
                >
                  <FileText size={16} className="mr-2" />
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left side - Course details */}
            <div className="md:col-span-2">
              {currentStep === 1 && (
                <>
                  <CourseBasics
                    courseTitle={courseTitle}
                    setCourseTitle={setCourseTitle}
                    description={description}
                    setDescription={setDescription}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    activeOption={activeOption}
                    setActiveOption={setActiveOption}
                    language={language}
                    setLanguage={setLanguage}
                    examLevel={examLevel}
                    setExamLevel={setExamLevel}
                    examPattern={examPattern}
                    setExamPattern={setExamPattern}
                    isPublicCourse={isPublicCourse}
                    setIsPublicCourse={setIsPublicCourse}
                    isQnA={isQnA}
                    setIsQnA={setIsQnA}
                    isSequential={isSequential}
                    setIsSequential={setIsSequential}
                    isLiveCourse={isLiveCourse}
                    setIsLiveCourse={setIsLiveCourse}
                    liveCourseSettings={liveCourseSettings}
                    setLiveCourseSettings={setLiveCourseSettings}
                  />

                  {/* Course Options */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Options</h3>
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                      <CourseOptions
                        activeOption={activeOption}
                        setActiveOption={setActiveOption}
                        language={language}
                        setLanguage={setLanguage}
                        examLevel={examLevel}
                        setExamLevel={setExamLevel}
                        examPattern={examPattern}
                        setExamPattern={setExamPattern}
                        isPublicCourse={isPublicCourse}
                        setIsPublicCourse={setIsPublicCourse}
                        isQnA={isQnA}
                        setIsQnA={setIsQnA}
                        isSequential={isSequential}
                        setIsSequential={setIsSequential}
                        isLiveCourse={isLiveCourse}
                        setIsLiveCourse={setIsLiveCourse}
                        liveCourseSettings={liveCourseSettings}
                        setLiveCourseSettings={setLiveCourseSettings}
                      />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <CourseMaterial />
              )}

              {currentStep === 3 && (
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-gray-700 mb-6">Additional Information</h3>

                  {/* Course Name */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Name : <span className="text-blue-500">&lt; {courseTitle} &gt;</span></label>
                  </div>

                  {/* Overview */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                    <p className="text-sm text-gray-500 mb-2">Provide essential course information to attract and inform potential students.</p>
                  </div>

                  {/* What Will I Learn? */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">What Will I Learn?</label>
                    <textarea
                      value={whatWillLearn}
                      onChange={(e) => setWhatWillLearn(e.target.value)}
                      placeholder="Key takeaways and learning outcomes students can expect."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                  </div>

                  {/* Target Audience */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                    <textarea
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="The intended audience for your course."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                  </div>

                  {/* Total Course Duration */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Course Duration</label>
                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <input
                          type="number"
                          min="0"
                          value={courseDurationHours}
                          onChange={(e) => setCourseDurationHours(parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-500 mt-1 block text-center">Hours</span>
                      </div>
                      <div className="w-1/2">
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={courseDurationMinutes}
                          onChange={(e) => setCourseDurationMinutes(parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-500 mt-1 block text-center">Min</span>
                      </div>
                    </div>
                  </div>

                  {/* Materials Included */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Materials Included</label>
                    <textarea
                      value={materialsIncluded}
                      onChange={(e) => setMaterialsIncluded(e.target.value)}
                      placeholder="A list of resources or materials provided to students"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                  </div>

                  {/* Requirements/Instructions */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements/Instructions</label>
                    <textarea
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder="Any prerequisites or special instructions for the course."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-2 border border-gray-300 rounded-md ${
                    currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                {currentStep === steps.length ? (
                  <button
                    onClick={() => handleSubmit("published")}
                    className="px-6 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                  >
                    Finish
                  </button>
                ) : (
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>

            {/* Right side - Options */}
            <div className="md:col-span-1">
              <div>
                <h3 className="text-sm font-medium mb-2">Visibility</h3>
                <div className="relative mb-1">
                  <div className="relative">
                    <select
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                    >
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                      <option value="Password">Password Protected</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Last updated on {lastUpdated}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Pricing Model</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricing"
                      checked={pricingModel === "Free"}
                      onChange={() => setPricingModel("Free")}
                      className="mr-2" />
                    <span className="text-sm">Free</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="pricing"
                      checked={pricingModel === "Paid"}
                      onChange={() => setPricingModel("Paid")}
                      className="mr-2" />
                    <span className="text-sm">Paid</span>
                  </label>
                </div>

                {pricingModel === "Paid" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price</label>
                      <div className="flex">
                        <div className="relative">
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="h-full rounded-l-md border border-r-0 border-gray-300 bg-white py-2 px-3 appearance-none"
                          >
                            <option value="€">€</option>
                            <option value="$">$</option>
                            <option value="£">£</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                            <ChevronDown size={14} className="text-gray-400" />
                          </div>
                        </div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={regularPrice}
                          onChange={(e) => setRegularPrice(e.target.value)}
                          className="flex-1 rounded-r-md border border-gray-300 py-2 px-3"
                          placeholder="49.99" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price</label>
                      <div className="flex">
                        <div className="relative">
                          <select
                            value={currency}
                            className="h-full rounded-l-md border border-r-0 border-gray-300 bg-white py-2 px-3 appearance-none"
                            disabled
                          >
                            <option value="€">€</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                            <ChevronDown size={14} className="text-gray-400" />
                          </div>
                        </div>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={discountedPrice}
                          onChange={(e) => setDiscountedPrice(e.target.value)}
                          className="flex-1 rounded-r-md border border-gray-300 py-2 px-3"
                          placeholder="0" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Featured Image</h3>
                <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <button
                      onClick={() => document.getElementById('featuredImageInput').click()}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload size={16} className="mr-2" />
                      Upload Thumbnail
                    </button>
                    <input
                      id="featuredImageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleFeaturedImageChange}
                      className="hidden" />
                    <p className="text-xs text-gray-500 mt-2">
                      JPEG, PNG, GIF, and WebP formats, up to 512 MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Intro Video</h3>
                <div className="border border-dashed border-gray-300 rounded-md p-4">
                  <p className="text-xs text-gray-500 mb-2">MP4, and WebM formats, up to 512 MB</p>
                  <div className="flex flex-col items-center justify-center">
                    <button
                      onClick={() => document.getElementById('introVideoInput').click()}
                      className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-2"
                    >
                      <Upload size={16} className="mr-2" />
                      Upload Video
                    </button>
                    <input
                      id="introVideoInput"
                      type="file"
                      accept="video/*"
                      onChange={handleIntroVideoChange}
                      className="hidden" />
                    <p className="text-center text-gray-500 text-sm mb-2">Or</p>
                    <input
                      type="text"
                      placeholder="Type URL here.."
                      value={introVideoUrl}
                      onChange={(e) => setIntroVideoUrl(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md" />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Schedule</h3>
                  <div className="relative">
                    <div
                      className={`w-12 h-6 flex items-center ${isScheduled ? 'bg-yellow-400' : 'bg-gray-200'} rounded-full p-1 cursor-pointer`}
                      onClick={() => setIsScheduled(!isScheduled)}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform ${isScheduled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                </div>

                {isScheduled && (
                  <div className="mt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <div className="flex items-center border border-gray-300 rounded-md p-2">
                          <Calendar size={18} className="text-gray-400 mr-2" />
                          <input
                            type="text"
                            placeholder="Select Date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className="w-full border-none focus:outline-none" />
                        </div>
                      </div>
                      <div className="relative">
                        <div className="flex items-center border border-gray-300 rounded-md p-2">
                          <Clock size={18} className="text-gray-400 mr-2" />
                          <input
                            type="text"
                            placeholder="hh:mm AM"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="w-full border-none focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center">
                      <input
                        type="checkbox"
                        id="showComingSoon"
                        checked={showComingSoon}
                        onChange={() => setShowComingSoon(!showComingSoon)}
                        className="mr-2" />
                      <label htmlFor="showComingSoon" className="text-sm text-gray-600">
                        Show "Coming Soon" Tag on the content poster
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <input
                  type="text"
                  placeholder="Type here"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
