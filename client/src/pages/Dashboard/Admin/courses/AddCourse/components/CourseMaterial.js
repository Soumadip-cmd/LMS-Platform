import React, { useState, useContext, useEffect, forwardRef, useImperativeHandle } from "react";
import { Plus, FileText, Video, Calendar, Edit, Trash2, CheckCircle, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import AdminSidebar from "../../../AdminSidebar";
import AdminNavbar from "../../../../../../components/Header/AdminNavbar";
import AddSection from "./AddSection";
import AddLesson from "./AddLesson";
import AddLiveLesson from "./AddLiveLesson";
import AddAssignment from "./AddAssignment";
import AddQuiz from "./AddQuiz";
import CourseContext from "../../../../../../context/course/courseContext";

const CourseMaterial = forwardRef(({ courseId }, ref) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Get courseId from props, params, or location state
  const currentCourseId = courseId || params.courseId || (location.state && location.state.courseId);

  const [sections, setSections] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionSummary, setSectionSummary] = useState("");

  // Get course context
  const courseContext = useContext(CourseContext);
  const {
    createCourseSection,
    getCourseSections,
    addLessonToSection,
    addQuizToSection,
    addAssignmentToSection,
    addLiveLessonToSection,
    courseSections,
    error,
    clearErrors
  } = courseContext;

  // Load sections when component mounts
  useEffect(() => {
    if (currentCourseId) {
      getCourseSections(currentCourseId);
    }
  }, [currentCourseId]);

  // Update local sections state when courseSections changes
  useEffect(() => {
    if (courseSections && courseSections.length > 0) {
      setSections(courseSections);
    }
  }, [courseSections]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    // Method to save all local sections to the backend
    saveLocalSections: async (newCourseId) => {
      if (!newCourseId) return;

      const localSections = sections.filter(section => section.isLocal);
      if (localSections.length === 0) return;

      const savedSections = [];

      // Show loading toast
      const loadingToast = toast.loading("Saving course materials...");

      try {
        // Save each local section
        for (const section of localSections) {
          const sectionData = {
            title: section.title,
            summary: section.summary,
            order: sections.indexOf(section) + 1
          };

          const savedSection = await createCourseSection(newCourseId, sectionData);

          if (savedSection && section.items && section.items.length > 0) {
            // Save each item in the section
            for (const item of section.items) {
              switch (item.type) {
                case "lesson":
                  await addLessonToSection(newCourseId, savedSection._id, item);
                  break;
                case "quiz":
                  await addQuizToSection(newCourseId, savedSection._id, item);
                  break;
                case "assignment":
                  await addAssignmentToSection(newCourseId, savedSection._id, item);
                  break;
                case "liveLesson":
                  await addLiveLessonToSection(newCourseId, savedSection._id, item);
                  break;
              }
            }
          }

          savedSections.push(savedSection);
        }

        // Update sections state to replace local sections with saved ones
        const updatedSections = sections.map(section => {
          if (section.isLocal) {
            const savedSection = savedSections.shift();
            return savedSection || section;
          }
          return section;
        });

        setSections(updatedSections);

        toast.dismiss(loadingToast);
        toast.success("Course materials saved successfully");

        return true;
      } catch (err) {
        console.error("Error saving local sections:", err);
        toast.dismiss(loadingToast);
        toast.error("Error saving course materials: " + (err.message || "Please try again"));
        return false;
      }
    }
  }));

  // Handle adding a new section
  const handleAddSection = () => {
    // Open the section modal instead of navigating
    setActiveModal("section");
  };

  // Handle saving a new section
  const handleSaveSection = async () => {
    if (!sectionTitle.trim()) {
      toast.error("Section title is required");
      return;
    }

    if (!currentCourseId) {
      // Instead of showing error, store section in local state only
      // This will be saved to the backend when the course is saved
      const newSection = {
        title: sectionTitle,
        summary: sectionSummary,
        items: [],
        isLocal: true // Flag to indicate this is stored locally only
      };

      setSections([...sections, newSection]);

      // Clear the form
      setSectionTitle("");
      setSectionSummary("");

      // Show auto-save toast
      toast.success("Section saved locally. It will be uploaded when the course is saved.", {
        icon: <CheckCircle size={18} className="text-green-500" />,
        style: {
          background: "#10B981",
          color: "#FFFFFF",
        },
      });

      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Saving section...");

    try {
      // Create section data
      const sectionData = {
        title: sectionTitle,
        summary: sectionSummary,
        order: sections.length + 1
      };

      // Call API to create section
      const newSection = await createCourseSection(currentCourseId, sectionData);

      if (newSection) {
        // Add to local state if not already added by the reducer
        if (!sections.find(section => section._id === newSection._id)) {
          setSections([...sections, {
            ...newSection,
            items: []
          }]);
        }

        // Clear the form
        setSectionTitle("");
        setSectionSummary("");

        // Show success toast
        toast.dismiss(loadingToast);
        toast.success("Section saved successfully", {
          icon: <CheckCircle size={18} className="text-green-500" />,
          style: {
            background: "#10B981",
            color: "#FFFFFF",
          },
        });
      } else {
        toast.dismiss(loadingToast);
        toast.error("Failed to save section");
      }
    } catch (err) {
      console.error("Error saving section:", err);
      toast.dismiss(loadingToast);
      toast.error("Error saving section: " + (err.message || "Please try again"));
    }
  };

  // Handle adding a new item to a section
  const handleAddItem = (sectionIndex, itemType) => {
    // Open the modal for the item type instead of navigating
    setActiveSectionIndex(sectionIndex);
    setActiveModal(itemType);
  };

  // Handle saving a new item
  const handleSaveItem = async (itemData) => {
    if (!currentCourseId) {
      // If no course ID, store the item in local state only
      const updatedSections = [...sections];
      const itemType = activeModal;

      if (!updatedSections[activeSectionIndex].items) {
        updatedSections[activeSectionIndex].items = [];
      }

      updatedSections[activeSectionIndex].items.push({
        type: itemType,
        ...itemData,
        isLocal: true // Flag to indicate this is stored locally only
      });

      setSections(updatedSections);
      setActiveModal(null);
      setActiveSectionIndex(null);

      // Show success toast
      toast.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} saved locally. It will be uploaded when the course is saved.`, {
        icon: <CheckCircle size={18} className="text-green-500" />,
        style: {
          background: "#10B981",
          color: "#FFFFFF",
        },
      });

      return;
    }

    const itemType = activeModal;
    // If we have a courseId, we need a sectionId from the backend
    if (currentCourseId) {
      const sectionId = sections[activeSectionIndex]._id;
      if (!sectionId) {
        toast.error("Section ID is required. Please save the section first.");
        return;
      }
    }

    // Show loading toast
    const loadingToast = toast.loading(`Saving ${itemType}...`);

    try {
      let savedItem;

      // If we have a courseId, call the API
      if (currentCourseId) {
        const sectionId = sections[activeSectionIndex]._id;

        // Call the appropriate API based on item type
        switch (itemType) {
          case "lesson":
            savedItem = await addLessonToSection(currentCourseId, sectionId, itemData);
            break;
          case "quiz":
            savedItem = await addQuizToSection(currentCourseId, sectionId, itemData);
            break;
          case "assignment":
            savedItem = await addAssignmentToSection(currentCourseId, sectionId, itemData);
            break;
          case "liveLesson":
            savedItem = await addLiveLessonToSection(currentCourseId, sectionId, itemData);
            break;
          default:
            toast.dismiss(loadingToast);
            toast.error(`Unknown item type: ${itemType}`);
            return;
        }
      } else {
        // If no courseId, we're just storing locally, so create a placeholder item
        savedItem = {
          ...itemData,
          _id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        };
      }

      if (savedItem) {
        // Update local state
        const updatedSections = [...sections];

        if (!updatedSections[activeSectionIndex].items) {
          updatedSections[activeSectionIndex].items = [];
        }

        updatedSections[activeSectionIndex].items.push({
          type: itemType,
          ...savedItem,
        });

        setSections(updatedSections);

        // Close modal and reset state
        setActiveModal(null);
        setActiveSectionIndex(null);

        // Show success toast
        toast.dismiss(loadingToast);
        toast.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} saved successfully`, {
          icon: <CheckCircle size={18} className="text-green-500" />,
          style: {
            background: "#10B981",
            color: "#FFFFFF",
          },
        });
      } else {
        toast.dismiss(loadingToast);
        toast.error(`Failed to save ${itemType}`);
      }
    } catch (err) {
      console.error(`Error saving ${itemType}:`, err);
      toast.dismiss(loadingToast);
      toast.error(`Error saving ${itemType}: ` + (err.message || "Please try again"));
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

      {/* Course ID warning - only show if no courseId and there are no sections yet */}
      {!currentCourseId && sections.length === 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You can add course materials now, but they will be saved locally until the course is saved.
              </p>
            </div>
          </div>
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
});

export default CourseMaterial;
