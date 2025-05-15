import React from "react";
import { LinkIcon } from "lucide-react";

const CourseBasics = ({ courseTitle, setCourseTitle, courseUrl, description }) => {
  return (
    <>
      {/* Course Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
        <input
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="Type here"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Course URL */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Course URL</label>
        <div className="flex items-center text-sm text-gray-600">
          <span>
            www.preplings.com/exam/goethea1/
            {courseTitle ? courseTitle.toLowerCase().replace(/\s+/g, "-") : "algoetheea10123"}
          </span>
          <LinkIcon size={16} className="ml-2 text-blue-500" />
        </div>
      </div>

      {/* Course Description */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">Course Description</label>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Paragraph</span>
            <div className="flex items-center space-x-1 border-l pl-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 7V4h16v3"></path>
                  <path d="M9 20h6"></path>
                  <path d="M12 4v16"></path>
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded font-bold">B</button>
              <button className="p-1 hover:bg-gray-100 rounded italic">I</button>
              <button className="p-1 hover:bg-gray-100 rounded underline">U</button>
            </div>
          </div>
        </div>
        <div className="border border-gray-300 rounded-md">
          <div id="quill-editor" className="min-h-[200px]"></div>
        </div>
      </div>
    </>
  );
};

export default CourseBasics;
