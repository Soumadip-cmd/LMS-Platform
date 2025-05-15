import React, { useEffect, useRef } from "react";
import { LinkIcon, ChevronDown } from "lucide-react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const CourseBasics = ({
  courseTitle,
  setCourseTitle,
  description,
  setDescription,
  difficulty,
  setDifficulty,
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
  setLiveCourseSettings
}) => {
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
  }, [description, setDescription]);

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
        <div className="flex items-center text-sm text-blue-600">
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
          <div className="flex items-center">
            <button className="flex items-center px-2 py-1 border border-gray-300 rounded-l-md text-sm text-gray-700">
              <span>Paragraph</span>
              <ChevronDown size={16} className="ml-1" />
            </button>
            <div className="flex border-l border-gray-300">
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
