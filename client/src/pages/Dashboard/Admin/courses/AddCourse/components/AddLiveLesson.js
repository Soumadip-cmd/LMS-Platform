import React, { useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import toast from "react-hot-toast";
import AdminSidebar from "../../../AdminSidebar";
import AdminNavbar from "../../../../../../components/Header/AdminNavbar";

const AddLiveLesson = ({ sectionName, onSave, onCancel, isNewSection = false }) => {
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [reminderTime, setReminderTime] = useState("30 Minutes Before");

  const handleSave = () => {
    if (!lessonTitle.trim()) {
      toast.error("Lesson title is required");
      return;
    }

    if (!startDate || !startTime || !endDate || !endTime) {
      toast.error("Schedule details are required");
      return;
    }

    const lessonData = {
      title: lessonTitle,
      content: lessonContent,
      schedule: {
        startDate,
        startTime,
        endDate,
        endTime,
        timeZone,
      },
      reminder: reminderTime,
    };

    if (isNewSection) {
      // If this is a new section, create a section with this live lesson
      onSave({
        title: lessonTitle,
        summary: lessonContent,
        isLiveSection: true,
        items: [
          {
            type: "liveLesson",
            ...lessonData
          }
        ]
      });
    } else {
      // Otherwise just add the live lesson to the existing section
      onSave(lessonData);
    }

    // Show success toast
    toast.success(isNewSection
      ? "Live lesson section added successfully"
      : "Live lesson added successfully");
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
                <h1 className="text-xl font-medium text-gray-700">
                  {isNewSection ? "Add Live Lesson (as New Section)" : "Add Live Lesson"}
                </h1>
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
          {/* Course Builder Header */}
          <div className="mb-6 border-b pb-4">
            <div className="flex items-center">
              <span className="text-sm font-medium uppercase text-gray-500 mr-4">COURSE BUILDER</span>
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs">
                    1
                  </div>
                  <span className="ml-2 text-sm text-gray-700">Basics</span>
                </div>
                <div className="w-8 mx-2 h-px bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs">
                    2
                  </div>
                  <span className="ml-2 text-sm text-gray-700">Course Material</span>
                </div>
                <div className="w-8 mx-2 h-px bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                    3
                  </div>
                  <span className="ml-2 text-sm text-gray-500">Additional</span>
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

        <div className="bg-gray-50 p-6 rounded-md">
          <h3 className="text-lg font-medium mb-4">Live Lesson Title and Summary</h3>
          <div className="mb-4">
            <input
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="Add a Title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <textarea
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
              placeholder="Add Content"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Schedule</h4>
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-600 uppercase">START DATE, TIME</span>
                </div>
                <div className="flex">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
                    placeholder="Select Date"
                  />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none"
                    placeholder="hh:mm AM"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-600 uppercase">END DATE, TIME</span>
                </div>
                <div className="flex">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
                    placeholder="Select Date"
                  />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none"
                    placeholder="hh:mm AM"
                  />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Time Zone</h4>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              >
                <option value="">Select Time Zone</option>
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="CST">CST</option>
                <option value="PST">PST</option>
                <option value="IST">IST</option>
              </select>

              <h4 className="font-medium mt-4 mb-3">Set Reminder (email Notification)</h4>
              <select
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              >
                <option value="30 Minutes Before">30 Minutes Before</option>
                <option value="1 Hour Before">1 Hour Before</option>
                <option value="2 Hours Before">2 Hours Before</option>
                <option value="1 Day Before">1 Day Before</option>
              </select>
            </div>
          </div>
        </div>

        </main>
    </div>
  );
};

export default AddLiveLesson;
