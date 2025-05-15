import React, { useState } from "react";
import { Plus, FileText, Video, Calendar, Edit, Trash2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import AddSection from "./AddSection";
import AddLesson from "./AddLesson";
import AddLiveLesson from "./AddLiveLesson";
import AddAssignment from "./AddAssignment";
import AddQuiz from "./AddQuiz";

const CourseMaterial = () => {
  const [sections, setSections] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Handle adding a new section
  const handleAddSection = () => {
    setActiveModal("section");
  };

  // Handle saving a new section
  const handleSaveSection = (sectionData) => {
    setSections([...sections, { ...sectionData, items: [] }]);
    setActiveModal(null);
    
    // Show auto-save toast
    if (autoSaveEnabled) {
      toast.success("Section auto-saved", {
        icon: <CheckCircle size={18} className="text-green-500" />,
        style: {
          background: "#10B981",
          color: "#FFFFFF",
        },
      });
    }
  };

  // Handle adding a new item to a section
  const handleAddItem = (sectionIndex, itemType) => {
    setActiveSectionIndex(sectionIndex);
    setActiveModal(itemType);
  };

  // Handle saving a new item
  const handleSaveItem = (itemData) => {
    const updatedSections = [...sections];
    const itemType = activeModal;
    
    updatedSections[activeSectionIndex].items.push({
      type: itemType,
      ...itemData,
    });
    
    setSections(updatedSections);
    setActiveModal(null);
    setActiveSectionIndex(null);
    
    // Show auto-save toast
    if (autoSaveEnabled) {
      toast.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} auto-saved`, {
        icon: <CheckCircle size={18} className="text-green-500" />,
        style: {
          background: "#10B981",
          color: "#FFFFFF",
        },
      });
    }
  };

  // Handle deleting a section
  const handleDeleteSection = (sectionIndex) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      const updatedSections = [...sections];
      updatedSections.splice(sectionIndex, 1);
      setSections(updatedSections);
      toast.success("Section deleted");
    }
  };

  // Handle deleting an item
  const handleDeleteItem = (sectionIndex, itemIndex) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedSections = [...sections];
      updatedSections[sectionIndex].items.splice(itemIndex, 1);
      setSections(updatedSections);
      toast.success("Item deleted");
    }
  };

  // Handle editing a section
  const handleEditSection = (sectionIndex) => {
    // In a real implementation, you would open the edit modal with the section data
    toast.info("Edit section functionality not implemented yet");
  };

  // Handle editing an item
  const handleEditItem = (sectionIndex, itemIndex) => {
    // In a real implementation, you would open the edit modal with the item data
    toast.info("Edit item functionality not implemented yet");
  };

  // Toggle auto-save
  const toggleAutoSave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
    toast.success(`Auto-save ${!autoSaveEnabled ? "enabled" : "disabled"}`);
  };

  // Render the appropriate modal based on activeModal state
  const renderModal = () => {
    switch (activeModal) {
      case "section":
        return (
          <AddSection
            onSave={handleSaveSection}
            onCancel={() => setActiveModal(null)}
          />
        );
      case "lesson":
        return (
          <AddLesson
            sectionName={sections[activeSectionIndex]?.title}
            onSave={handleSaveItem}
            onCancel={() => {
              setActiveModal(null);
              setActiveSectionIndex(null);
            }}
          />
        );
      case "liveLesson":
        return (
          <AddLiveLesson
            sectionName={sections[activeSectionIndex]?.title}
            onSave={handleSaveItem}
            onCancel={() => {
              setActiveModal(null);
              setActiveSectionIndex(null);
            }}
          />
        );
      case "assignment":
        return (
          <AddAssignment
            sectionName={sections[activeSectionIndex]?.title}
            onSave={handleSaveItem}
            onCancel={() => {
              setActiveModal(null);
              setActiveSectionIndex(null);
            }}
          />
        );
      case "quiz":
        return (
          <AddQuiz
            sectionName={sections[activeSectionIndex]?.title}
            onSave={handleSaveItem}
            onCancel={() => {
              setActiveModal(null);
              setActiveSectionIndex(null);
            }}
          />
        );
      default:
        return null;
    }
  };

  // Get icon for item type
  const getItemIcon = (type) => {
    switch (type) {
      case "lesson":
        return <Video size={16} className="mr-2" />;
      case "liveLesson":
        return <Calendar size={16} className="mr-2" />;
      case "assignment":
        return <FileText size={16} className="mr-2" />;
      case "quiz":
        return <FileText size={16} className="mr-2" />;
      default:
        return null;
    }
  };

  // Get display name for item type
  const getItemDisplayName = (type) => {
    switch (type) {
      case "lesson":
        return "Lesson";
      case "liveLesson":
        return "Live Lesson";
      case "assignment":
        return "Assignment";
      case "quiz":
        return "Quiz";
      default:
        return type;
    }
  };

  return (
    <div className="relative">
      {/* Auto-save indicator */}
      {autoSaveEnabled && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white py-2 px-4 flex items-center justify-center z-50">
          <CheckCircle size={18} className="mr-2" />
          <span>Auto Save ON</span>
        </div>
      )}

      {/* Course Material Content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-700">Course Material</h2>
          <button
            onClick={toggleAutoSave}
            className={`px-4 py-2 rounded-md ${
              autoSaveEnabled ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Auto Save {autoSaveEnabled ? "ON" : "OFF"}
          </button>
        </div>

        {/* Add Section Button */}
        <div className="mb-6">
          <button
            onClick={handleAddSection}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            <Plus size={18} className="mr-2" />
            Add Section
          </button>
        </div>

        {/* Sections List */}
        {sections.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Sections Yet</h3>
            <p className="text-gray-500">
              Start by adding a section to your course.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border border-gray-200 rounded-md">
                {/* Section Header */}
                <div className="bg-gray-100 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{section.title}</h3>
                    {section.summary && (
                      <p className="text-sm text-gray-600 mt-1">{section.summary}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleEditSection(sectionIndex)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(sectionIndex)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Section Items */}
                <div className="p-4">
                  {section.items.length === 0 ? (
                    <p className="text-gray-500 text-sm">No items in this section yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                        >
                          <div className="flex items-center">
                            {getItemIcon(item.type)}
                            <span>{item.title}</span>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() => handleEditItem(sectionIndex, itemIndex)}
                              className="p-1 text-blue-500 hover:bg-blue-50 rounded-full mr-1"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(sectionIndex, itemIndex)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Item Buttons */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleAddItem(sectionIndex, "lesson")}
                      className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                    >
                      <Plus size={14} className="mr-1" />
                      Lesson
                    </button>
                    <button
                      onClick={() => handleAddItem(sectionIndex, "liveLesson")}
                      className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                    >
                      <Plus size={14} className="mr-1" />
                      Live Lesson
                    </button>
                    <button
                      onClick={() => handleAddItem(sectionIndex, "assignment")}
                      className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                    >
                      <Plus size={14} className="mr-1" />
                      Assignment
                    </button>
                    <button
                      onClick={() => handleAddItem(sectionIndex, "quiz")}
                      className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                    >
                      <Plus size={14} className="mr-1" />
                      Quiz
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {renderModal()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseMaterial;
