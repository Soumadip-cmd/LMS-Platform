import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import toast from "react-hot-toast";

const AddAssignment = ({ sectionName, onSave, onCancel }) => {
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentContent, setAssignmentContent] = useState("");
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeLimitUnit, setTimeLimitUnit] = useState("Weeks");
  const [dueReminder, setDueReminder] = useState("1 Day Before");
  const [overDueReminder, setOverDueReminder] = useState("30 Min later");
  const [attachments, setAttachments] = useState([]);

  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // In a real implementation, you would upload these files to a server
      // For now, we'll just add them to the state
      setAttachments([...attachments, ...files]);
      toast.success(`${files.length} file(s) selected`);
    }
  };

  const handleSave = () => {
    if (!assignmentTitle.trim()) {
      toast.error("Assignment title is required");
      return;
    }

    onSave({
      title: assignmentTitle,
      content: assignmentContent,
      timeLimit: {
        value: timeLimit,
        unit: timeLimitUnit,
      },
      reminders: {
        due: dueReminder,
        overdue: overDueReminder,
      },
      attachments,
    });

    // Show success toast
    toast.success("Assignment added successfully");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar is already in the parent component */}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onCancel}
                className="mr-4 text-blue-500"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-2xl font-medium text-gray-700">Add Assignment</h1>
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Course Builder Header */}
          <div className="mb-8 border-b pb-4">
            <div className="flex items-center">
              <h3 className="text-sm font-medium uppercase text-gray-500 mr-6">COURSE BUILDER</h3>
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
          <h3 className="text-lg font-medium mb-4">Assignment Title and Content</h3>
          <div className="mb-4">
            <input
              type="text"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
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
                <div className="flex items-center space-x-1">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9h12M6 15h12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <textarea
              value={assignmentContent}
              onChange={(e) => setAssignmentContent(e.target.value)}
              placeholder="Add Content"
              className="w-full px-4 py-2 border-none focus:outline-none min-h-[200px]"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Add Attachments</h4>
              <div className="bg-yellow-50 p-4 rounded-md flex items-center justify-center">
                <input
                  id="attachmentInput"
                  type="file"
                  multiple
                  onChange={handleAttachmentUpload}
                  className="hidden"
                />
                <button
                  onClick={() => document.getElementById("attachmentInput").click()}
                  className="flex items-center text-blue-500"
                >
                  <Upload size={18} className="mr-2" />
                  Upload Attachment
                </button>
              </div>
              {attachments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{attachments.length} file(s) selected</p>
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-3">Time Limit</h4>
              <div className="flex">
                <input
                  type="number"
                  min="0"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
                />
                <select
                  value={timeLimitUnit}
                  onChange={(e) => setTimeLimitUnit(e.target.value)}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none"
                >
                  <option value="Weeks">Weeks</option>
                  <option value="Days">Days</option>
                  <option value="Hours">Hours</option>
                </select>
              </div>

              <h4 className="font-medium mt-4 mb-3">Due Reminder (email Notification)</h4>
              <select
                value={dueReminder}
                onChange={(e) => setDueReminder(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              >
                <option value="1 Day Before">1 Day Before</option>
                <option value="2 Days Before">2 Days Before</option>
                <option value="1 Week Before">1 Week Before</option>
              </select>

              <h4 className="font-medium mt-4 mb-3">OverDue Reminder (email Notification)</h4>
              <select
                value={overDueReminder}
                onChange={(e) => setOverDueReminder(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              >
                <option value="30 Min later">30 Min later</option>
                <option value="1 Hour later">1 Hour later</option>
                <option value="1 Day later">1 Day later</option>
              </select>
            </div>
          </div>
        </div>

        </main>
      </div>
    </div>
  );
};

export default AddAssignment;
