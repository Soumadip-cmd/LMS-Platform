import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import toast from "react-hot-toast";
import AdminSidebar from "../../../AdminSidebar";
import AdminNavbar from "../../../../../../components/Header/AdminNavbar";

const AddLesson = ({ sectionName, onSave, onCancel }) => {
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPlaybackHours, setVideoPlaybackHours] = useState(0);
  const [videoPlaybackMinutes, setVideoPlaybackMinutes] = useState(0);
  const [videoPlaybackSeconds, setVideoPlaybackSeconds] = useState(0);
  const [exerciseFiles, setExerciseFiles] = useState([]);

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      toast.success("Featured image selected");
    }
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      toast.success("Video file selected");
    }
  };

  const handleExerciseFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setExerciseFiles([...exerciseFiles, ...files]);
      toast.success(`${files.length} exercise file(s) selected`);
    }
  };

  const handleSave = () => {
    if (!lessonTitle.trim()) {
      toast.error("Lesson title is required");
      return;
    }

    onSave({
      title: lessonTitle,
      content: lessonContent,
      featuredImage,
      video: {
        file: videoFile,
        url: videoUrl,
        playbackTime: {
          hours: videoPlaybackHours,
          minutes: videoPlaybackMinutes,
          seconds: videoPlaybackSeconds,
        },
      },
      exerciseFiles,
    });

    // Show success toast
    toast.success("Lesson added successfully");
  };

  return (
    <div className="flex-1 bg-white">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={onCancel}
                  className="mr-4 text-blue-500"
                >
                  <ChevronLeft size={20} />
                </button>
                <h1 className="text-xl font-medium text-gray-700">Add Lesson</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-yellow-400 rounded-md text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </header>

        {/* Main content scrollable area */}
        <main className="overflow-y-auto p-4">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-medium">COURSE BUILDER</h3>
            <div className="flex items-center ml-6">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-medium">
                  1
                </div>
                <span className="ml-2 text-gray-700">Basics</span>
              </div>
              <div className="w-8 mx-2 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-medium">
                  2
                </div>
                <span className="ml-2 text-gray-700">Course Material</span>
              </div>
              <div className="w-8 mx-2 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                  3
                </div>
                <span className="ml-2 text-gray-500">Additional</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <span className="text-gray-700">Section Name : </span>
            <span className="text-blue-500 ml-1">&lt; {sectionName || "Section 1"} &gt;</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-gray-50 p-6 rounded-md mb-6">
              <h3 className="text-lg font-medium mb-4">Lesson Title and Content</h3>
              <div className="mb-4">
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="Add a Title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6 border border-gray-300 rounded-md">
                <div className="bg-gray-100 p-2 border-b border-gray-300">
                  <div className="flex items-center space-x-2">
                    <select className="bg-white border border-gray-300 rounded px-2 py-1 text-sm">
                      <option>Paragraph</option>
                    </select>
                    <div className="flex items-center space-x-1">
                      <button className="p-1 hover:bg-gray-200 rounded font-bold">B</button>
                      <button className="p-1 hover:bg-gray-200 rounded italic">I</button>
                      <button className="p-1 hover:bg-gray-200 rounded underline">U</button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 7h16M4 12h16M4 17h8" />
                        </svg>
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 7h16M4 12h16M12 17h8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <textarea
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  placeholder="Add Content"
                  className="w-full px-4 py-2 border-none focus:outline-none min-h-[200px]"
                ></textarea>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-md">
              <h3 className="text-lg font-medium mb-4">Video Playback Time</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    value={videoPlaybackHours}
                    onChange={(e) => setVideoPlaybackHours(parseInt(e.target.value) || 0)}
                    className="w-16 px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-center"
                  />
                  <span className="ml-2">hour</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={videoPlaybackMinutes}
                    onChange={(e) => setVideoPlaybackMinutes(parseInt(e.target.value) || 0)}
                    className="w-16 px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-center"
                  />
                  <span className="ml-2">min</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={videoPlaybackSeconds}
                    onChange={(e) => setVideoPlaybackSeconds(parseInt(e.target.value) || 0)}
                    className="w-16 px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-center"
                  />
                  <span className="ml-2">sec</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-md mt-6">
              <h3 className="text-lg font-medium mb-4">Exercise Files</h3>
              <div className="bg-yellow-50 p-4 rounded-md flex items-center justify-center">
                <input
                  id="exerciseFilesInput"
                  type="file"
                  multiple
                  onChange={handleExerciseFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => document.getElementById("exerciseFilesInput").click()}
                  className="flex items-center text-blue-500"
                >
                  <Upload size={18} className="mr-2" />
                  Upload Attachment
                </button>
              </div>
              {exerciseFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{exerciseFiles.length} file(s) selected</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-gray-50 p-6 rounded-md mb-6">
              <h3 className="text-lg font-medium mb-4">Featured Image</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <div className="mb-4 flex items-center justify-center">
                  {featuredImage ? (
                    <div className="text-sm text-gray-600">Image selected: {featuredImage.name}</div>
                  ) : (
                    <div className="text-sm text-gray-500">JPEG, PNG, GIF, and WebP formats, up to 512 MB</div>
                  )}
                </div>
                <input
                  id="featuredImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageChange}
                  className="hidden"
                />
                <button
                  onClick={() => document.getElementById("featuredImageInput").click()}
                  className="inline-flex items-center justify-center w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  <Upload size={18} className="mr-2" />
                  Upload Thumbnail
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-md">
              <h3 className="text-lg font-medium mb-4">Video</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <div className="mb-4 flex items-center justify-center">
                  <div className="text-sm text-gray-500">MP4, and WebM formats, up to 512 MB</div>
                </div>
                <input
                  id="videoFileInput"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => document.getElementById("videoFileInput").click()}
                  className="inline-flex items-center justify-center w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 mb-2"
                >
                  <Upload size={18} className="mr-2" />
                  Upload Video
                </button>
                <p className="text-center text-gray-500 text-sm mb-2">Or</p>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Type URL here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        </main>
    </div>
  );
};

export default AddLesson;
