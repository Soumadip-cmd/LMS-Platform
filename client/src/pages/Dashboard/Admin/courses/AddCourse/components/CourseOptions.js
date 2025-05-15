import React from "react";

const CourseOptions = ({
  activeOption,
  setActiveOption,
  language,
  setLanguage,
  examLevel,
  setExamLevel,
  examPattern,
  setExamPattern,
  isPublicCourse,
  setIsPublicCourse,
  isQnA,
  setIsQnA,
  isSequential,
  setIsSequential,
  isLiveCourse,
  setIsLiveCourse,
  liveCourseSettings,
  setLiveCourseSettings,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Options navigation */}
      <div className="border-b">
        <div className="flex flex-col">
          <button
            className={`flex items-center p-4 text-left ${
              activeOption === "General" ? "bg-yellow-50 border-l-4 border-yellow-400" : "hover:bg-gray-50"
            }`}
            onClick={() => setActiveOption("General")}
          >
            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>General</span>
          </button>

          <button
            className={`flex items-center p-4 text-left ${
              activeOption === "ContentDrip" ? "bg-yellow-50 border-l-4 border-yellow-400" : "hover:bg-gray-50"
            }`}
            onClick={() => setActiveOption("ContentDrip")}
          >
            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Content Drip</span>
          </button>

          <button
            className={`flex items-center p-4 text-left ${
              activeOption === "FinalTest" ? "bg-yellow-50 border-l-4 border-yellow-400" : "hover:bg-gray-50"
            }`}
            onClick={() => setActiveOption("FinalTest")}
          >
            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <span>Final Test</span>
          </button>

          <button
            className={`flex items-center p-4 text-left ${
              activeOption === "LiveCourse" ? "bg-yellow-50 border-l-4 border-yellow-400" : "hover:bg-gray-50"
            }`}
            onClick={() => setActiveOption("LiveCourse")}
          >
            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              ></path>
            </svg>
            <span>Live Course?</span>
          </button>
        </div>
      </div>

      {/* Option content */}
      <div className="p-4">
        {activeOption === "General" && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select your Language</label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                >
                  <option value="">Select here</option>
                  <option value="english">English</option>
                  <option value="german">German</option>
                  <option value="french">French</option>
                  <option value="spanish">Spanish</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Level</label>
              <div className="relative">
                <select
                  value={examLevel}
                  onChange={(e) => setExamLevel(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                >
                  <option value="">Select here</option>
                  <option value="a1">A1</option>
                  <option value="a2">A2</option>
                  <option value="b1">B1</option>
                  <option value="b2">B2</option>
                  <option value="c1">C1</option>
                  <option value="c2">C2</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Pattern</label>
              <div className="relative">
                <select
                  value={examPattern}
                  onChange={(e) => setExamPattern(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none pr-8"
                >
                  <option value="">Select here</option>
                  <option value="goethe">Goethe</option>
                  <option value="telc">TELC</option>
                  <option value="dsh">DSH</option>
                  <option value="testdaf">TestDaF</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Public Course</span>
              <div className="relative">
                <div
                  className={`w-12 h-6 flex items-center ${
                    isPublicCourse ? "bg-yellow-400" : "bg-gray-200"
                  } rounded-full p-1 cursor-pointer transition-colors duration-300`}
                  onClick={() => setIsPublicCourse(!isPublicCourse)}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      isPublicCourse ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Q&A</span>
              <div className="relative">
                <div
                  className={`w-12 h-6 flex items-center ${
                    isQnA ? "bg-yellow-400" : "bg-gray-200"
                  } rounded-full p-1 cursor-pointer transition-colors duration-300`}
                  onClick={() => setIsQnA(!isQnA)}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      isQnA ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeOption === "ContentDrip" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Course content available sequentially</span>
              <div className="relative">
                <div
                  className={`w-12 h-6 flex items-center ${
                    isSequential ? "bg-yellow-400" : "bg-gray-200"
                  } rounded-full p-1 cursor-pointer transition-colors duration-300`}
                  onClick={() => setIsSequential(!isSequential)}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      isSequential ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeOption === "LiveCourse" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Live Course</span>
              <div className="relative">
                <div
                  className={`w-12 h-6 flex items-center ${
                    isLiveCourse ? "bg-yellow-400" : "bg-gray-200"
                  } rounded-full p-1 cursor-pointer transition-colors duration-300`}
                  onClick={() => setIsLiveCourse(!isLiveCourse)}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      isLiveCourse ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {isLiveCourse && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <select
                    value={liveCourseSettings.platform}
                    onChange={(e) => setLiveCourseSettings({ ...liveCourseSettings, platform: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Zoom">Zoom</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sessions Per Week</label>
                  <input
                    type="number"
                    min="1"
                    value={liveCourseSettings.sessionsPerWeek}
                    onChange={(e) =>
                      setLiveCourseSettings({ ...liveCourseSettings, sessionsPerWeek: parseInt(e.target.value) })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseOptions;
