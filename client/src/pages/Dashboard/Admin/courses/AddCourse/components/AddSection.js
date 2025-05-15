import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="bg-white">
      <div className="border-b py-4 px-6">
        <h2 className="text-2xl font-medium text-gray-700">Add Section</h2>
      </div>

      <div className="p-6">
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

        <div className="bg-gray-50 p-6 rounded-md">
          <h3 className="text-lg font-medium mb-4">Section Title and Summary</h3>
          <div className="mb-4">
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Add a Title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <textarea
              value={sectionSummary}
              onChange={(e) => setSectionSummary(e.target.value)}
              placeholder="Add a Summary"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <div className="flex">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2"
            >
              Cancel
            </button>
          </div>
          <div className="flex">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-yellow-400 rounded-md text-white"
            >
              OK
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white mr-2">
            <ChevronLeft size={18} />
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSection;
