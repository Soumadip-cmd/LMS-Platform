import React, { useState } from "react";
import { Plus, FileText, Video, Calendar, Edit, Trash2, CheckCircle, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../AdminSidebar";
import AdminNavbar from "../../../../../../components/Header/AdminNavbar";
import AddSection from "./AddSection";
import AddLesson from "./AddLesson";
import AddLiveLesson from "./AddLiveLesson";
import AddAssignment from "./AddAssignment";
import AddQuiz from "./AddQuiz";

const CourseMaterial = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionSummary, setSectionSummary] = useState("");

  // Handle adding a new section
  const handleAddSection = () => {
    // Open the section modal instead of navigating
    setActiveModal("section");
  };

  // Handle saving a new section
  const handleSaveSection = () => {
    if (!sectionTitle.trim()) {
      toast.error("Section title is required");
      return;
    }

    setSections([...sections, {
      title: sectionTitle,
      summary: sectionSummary,
      items: []
    }]);

    // Clear the form
    setSectionTitle("");
    setSectionSummary("");

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
    // Open the modal for the item type instead of navigating
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
    const modalContent = () => {
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
              sectionName={activeSectionIndex !== null ? sections[activeSectionIndex]?.title : "New Section"}
              onSave={activeSectionIndex !== null ? handleSaveItem : handleSaveSection}
              onCancel={() => {
                setActiveModal(null);
                setActiveSectionIndex(null);
              }}
              isNewSection={activeSectionIndex === null}
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

    return modalContent();
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

        {/* Default Section Title and Summary */}
        <div className="bg-gray-50 p-8 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-4">Section Title and Summary</h3>
          <div className="mb-4">
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Add a Title"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400"
            />
          </div>
          <div className="mb-4">
            <textarea
              value={sectionSummary}
              onChange={(e) => setSectionSummary(e.target.value)}
              placeholder="Add a Summary"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-400 min-h-[150px]"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveSection}
              className="px-6 py-2 bg-yellow-400 rounded-md text-white hover:bg-yellow-500"
            >
              OK
            </button>
          </div>
        </div>

        {/* Sections List */}
        {sections.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Sections Yet</h3>
            <p className="text-gray-500">
              Start by adding a section to your course using the form above.
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

      {/* Bottom Action Buttons */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => {
              if (sections.length > 0) {
                handleAddItem(0, "lesson");
              } else {
                toast.error("Please add a section first");
                handleAddSection();
              }
            }}
            className="flex items-center justify-center px-4 py-2 border border-yellow-400 text-gray-700 rounded-md hover:bg-yellow-50"
          >
            <Plus size={18} className="mr-2" />
            Lesson
          </button>
          <button
            onClick={() => {
              if (sections.length > 0) {
                handleAddItem(0, "quiz");
              } else {
                toast.error("Please add a section first");
                handleAddSection();
              }
            }}
            className="flex items-center justify-center px-4 py-2 border border-yellow-400 text-gray-700 rounded-md hover:bg-yellow-50"
          >
            <Plus size={18} className="mr-2" />
            Quiz
          </button>
          <button
            onClick={() => {
              if (sections.length > 0) {
                handleAddItem(0, "liveLesson");
              } else {
                toast.error("Please add a section first");
                handleAddSection();
              }
            }}
            className="flex items-center justify-center px-4 py-2 border border-yellow-400 text-gray-700 rounded-md hover:bg-yellow-50"
          >
            <Plus size={18} className="mr-2" />
            Add Live Lesson
          </button>
          <button
            onClick={() => {
              if (sections.length > 0) {
                handleAddItem(0, "assignment");
              } else {
                toast.error("Please add a section first");
                handleAddSection();
              }
            }}
            className="flex items-center justify-center px-4 py-2 border border-yellow-400 text-gray-700 rounded-md hover:bg-yellow-50"
          >
            <Plus size={18} className="mr-2" />
            Assignment
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleAddSection}
            className="flex items-center justify-center px-4 py-3 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
          >
            <Plus size={18} className="mr-2" />
            Add New Section
          </button>
          <button
            onClick={() => {
              setActiveModal("liveLesson");
              setActiveSectionIndex(null);
            }}
            className="flex items-center justify-center px-4 py-3 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
          >
            <Plus size={18} className="mr-2" />
            Add Live Lesson (as New Section)
          </button>
        </div>
      </div>

      {/* Full Page Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-white">
          {renderModal()}
        </div>
      )}
    </div>
  );
};

export default CourseMaterial;
