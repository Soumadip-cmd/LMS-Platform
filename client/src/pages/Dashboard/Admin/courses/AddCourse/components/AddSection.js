import React, { useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import toast from "react-hot-toast";

const AddSection = ({ onSave, onCancel }) => {
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionSummary, setSectionSummary] = useState("");

  const handleSave = () => {
    if (!sectionTitle.trim()) {
      toast.error("Section title is required");
      return;
    }

    onSave({
      title: sectionTitle,
      summary: sectionSummary,
    });

    // Show success toast
    toast.success("Section added successfully");
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
              <h1 className="text-2xl font-medium text-gray-700">Add Section</h1>
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

        {/* Section Content */}
        <div className="bg-gray-50 p-8 rounded-md mb-8">
          <h3 className="text-lg font-medium mb-6">Section Title and Summary</h3>
          <div className="mb-6">
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Add a Title"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400"
            />
          </div>
          <div>
            <textarea
              value={sectionSummary}
              onChange={(e) => setSectionSummary(e.target.value)}
              placeholder="Add a Summary"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400 min-h-[300px]"
            ></textarea>
          </div>
        </div>

        </main>
      </div>
    </div>
  );
};

export default AddSection;
