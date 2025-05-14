import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";
import { Search, Eye, Edit, ChevronDown, Download, Plus } from "lucide-react";
import InstructorContext from "../../../../context/instructor/instructorContext";
import { toast } from "react-hot-toast";

const ManageInstructors = () => {
  const navigate = useNavigate();
  // Get instructor context
  const instructorContext = useContext(InstructorContext);
  const {
    instructors,
    totalInstructors,
    loading,
    error,
    getAllInstructors,
    updateInstructorStatus
  } = instructorContext;

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(10);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState("Jan 11–Jan 25");
  const [selectedMonth, setSelectedMonth] = useState(0); // January
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedStartDate, setSelectedStartDate] = useState(11);
  const [selectedEndDate, setSelectedEndDate] = useState(25);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate total pages
  const totalPages = Math.ceil(totalInstructors / coursesPerPage);

  const filterRef = useRef(null);
  const calendarRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Pagination functionality
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Navigate to previous page
  const goToPrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  // Navigate to next page
  const goToNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Dynamic pagination rendering function
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5; // Number of visible page buttons (excluding ellipsis and edge buttons)

    // Always show first page
    buttons.push(
      <button
        key={1}
        className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
          currentPage === 1 ? "bg-blue-600 text-white" : "text-gray-600"
        }`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    // Calculate the range of visible page numbers
    let startPage, endPage;

    if (currentPage <= 3) {
      // Current page is near the beginning
      startPage = 2;
      endPage = Math.min(5, totalPages - 1);

    } else if (currentPage >= totalPages - 2) {
      // Current page is near the end
      startPage = Math.max(totalPages - 4, 2);
      endPage = totalPages - 1;

    } else {
      // Current page is in the middle
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }

    // Add first ellipsis if needed
    if (startPage > 2) {
      buttons.push(<span key="ellipsis1" className="text-center w-6">...</span>);
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
            currentPage === i ? "bg-blue-600 text-white" : "text-gray-600"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Add last ellipsis if needed
    if (endPage < totalPages - 1) {
      buttons.push(<span key="ellipsis2" className="text-center w-6">...</span>);
    }

    // Always show last page if we have more than 1 page
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
            currentPage === totalPages ? "bg-blue-600 text-white" : "text-gray-600"
          }`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  // Calendar functions
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarDays = (month, year) => {
    const days = [];
    const daysInMonth = getDaysInMonth(month, year);

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateSelection = (day) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Start new selection
      setSelectedStartDate(day);
      setSelectedEndDate(null);
    } else {
      // Complete the selection
      if (day < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(day);
      } else {
        setSelectedEndDate(day);
      }
    }
  };

  const applyDateRange = () => {
    if (selectedStartDate && selectedEndDate) {
      setDateRange(
        `${months[selectedMonth]} ${selectedStartDate}–${months[selectedMonth]} ${selectedEndDate}`
      );
      setShowCalendar(false);
    }
  };

  // Toggle filter dropdown
  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
    setShowCalendar(false);
  };

  // Toggle calendar
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    setShowFilterDropdown(false);
  };

  // Change month in calendar
  const changeMonth = (increment) => {
    let newMonth = selectedMonth + increment;
    let newYear = selectedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  // Fetch instructors when component mounts or when page/filter changes
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        await getAllInstructors(currentPage, coursesPerPage, selectedFilter);
      } catch (err) {
        toast.error('Failed to load instructors');
      }
    };

    fetchInstructors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, coursesPerPage, selectedFilter]);

  // Handle instructor status change
  const handleStatusChange = async (instructorId, newStatus) => {
    try {
      await updateInstructorStatus(instructorId, newStatus);
      toast.success(`Instructor status updated to ${newStatus}`);

      // Refresh the instructors list to show updated status
      await getAllInstructors(currentPage, coursesPerPage, selectedFilter);
    } catch (err) {
      toast.error('Failed to update instructor status');
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-blue-500 text-white";
      case "Suspended":
        return "bg-red-500 text-white";
      case "Pending":
        return "bg-yellow-400 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Get filtered instructors
  const filteredInstructors = instructors || [];

  return (
    <div className="flex">
      <AdminSidebar active="Instructors" />

      {/* Main content area */}
      <div className="flex-1 pl-0 overflow-x-auto">
        <div className="p-4 lg:p-6 pt-9">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h1 className="text-2xl font-medium text-gray-600">
                Instructors
              </h1>
              <p className="text-gray-400 text-base">
                Manage instructor accounts and details
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6 lg:mt-0 w-full lg:w-auto">
              <button className="flex items-center justify-center gap-2 border border-blue-500 text-blue-500 py-2 px-4 rounded-md">
                <Download size={20} />
                Export
              </button>

              <button className="flex items-center justify-center gap-2 bg-yellow-400 text-white py-2 px-4 rounded-md">
                <Plus size={20} />
                Add New Instructor
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-50 rounded-3xl p-4 mb-4 lg:mb-6">
            <div className="flex flex-col lg:flex-row gap-5">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-blue-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by ID, Name, or Status..."
                  className="w-full pl-12 pr-4 py-3 border-none rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleSearch}
                  value={searchTerm}
                />
              </div>

              <div className="w-full flex justify-between lg:justify-start lg:w-auto gap-3">
                <div className="relative" ref={filterRef}>
                  <button
                    className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-lg"
                    onClick={toggleFilterDropdown}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600"
                    >
                      <line x1="21" x2="14" y1="4" y2="4"></line>
                      <line x1="10" x2="3" y1="4" y2="4"></line>
                      <line x1="21" x2="12" y1="12" y2="12"></line>
                      <line x1="8" x2="3" y1="12" y2="12"></line>
                      <line x1="21" x2="16" y1="20" y2="20"></line>
                      <line x1="12" x2="3" y1="20" y2="20"></line>
                      <line x1="14" x2="14" y1="2" y2="6"></line>
                      <line x1="8" x2="8" y1="10" y2="14"></line>
                      <line x1="16" x2="16" y1="18" y2="22"></line>
                    </svg>
                    Filter
                  </button>

                  {showFilterDropdown && (
                    <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                      <ul className="py-2">
                        {["All", "Active", "Suspended", "Pending"].map((status) => (
                          <li
                            key={status}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedFilter(status);
                              setShowFilterDropdown(false);
                            }}
                          >
                            {status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="relative" ref={calendarRef}>
                  <button
                    className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-lg"
                    onClick={toggleCalendar}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-calendar text-blue-600"
                    >
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                    {dateRange}
                  </button>

                  {showCalendar && (
                    <div className="absolute z-10 mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-72">
                      <div className="flex justify-between items-center mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6"/>
                          </svg>
                        </button>
                        <span className="font-medium">{months[selectedMonth]} {selectedYear}</span>
                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                          <div key={day} className="text-center text-xs text-gray-500 font-medium">{day}</div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays(selectedMonth, selectedYear).map((day) => {
                          const isSelected =
                            (day >= selectedStartDate && day <= selectedEndDate && selectedEndDate) ||
                            day === selectedStartDate;

                          return (
                            <div
                              key={day}
                              className={`text-center py-1 cursor-pointer text-sm rounded ${
                                isSelected
                                  ? "bg-blue-500 text-white"
                                  : "hover:bg-gray-100"
                              }`}
                              onClick={() => handleDateSelection(day)}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                          onClick={applyDateRange}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Table Container with horizontal scrolling */}
          <div
            className="bg-white rounded-lg p-4 mb-4"
            style={{
              boxShadow: `rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px`,
            }}
          >
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                <span className="ml-3 text-lg text-gray-500">Loading instructors...</span>
              </div>
            ) : filteredInstructors.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-xl">No instructors found</p>
                <p className="mt-2">Try changing your search or filter criteria</p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-gray-500 text-sm">
                      <th className="pb-3 px-4 font-medium text-left">Name</th>
                      <th className="pb-3 px-4 font-medium text-left">Course</th>
                      <th className="pb-3 px-4 font-medium text-left">
                        Join Date
                      </th>
                      <th className="pb-3 px-4 font-medium text-left">Earning</th>
                      <th className="pb-3 px-4 font-medium text-left">Balance</th>
                      <th className="pb-3 px-4 font-medium text-left">Status</th>
                      <th className="pb-3 px-4 font-medium text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInstructors.map((instructor, index) => (
                      <tr
                        key={instructor.id || index}
                        className={index % 2 === 0 ? "bg-white" : "bg-white"}
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img
                                src={instructor.avatar}
                                alt={instructor.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{instructor.name}</p>
                              <p className="text-sm text-gray-500">
                                #{instructor.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {instructor.course}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {instructor.joinDate}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {instructor.earning}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {instructor.balance}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block w-24 text-center px-4 py-1 rounded-md text-sm font-medium cursor-pointer ${getStatusClass(
                              instructor.status
                            )}`}
                            onClick={() => {
                              const newStatus =
                                instructor.status === "Active" ? "Suspended" :
                                instructor.status === "Suspended" ? "Pending" : "Active";
                              handleStatusChange(instructor.id, newStatus);
                            }}
                          >
                            {instructor.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/admin/instructors/${instructor.id}`)}
                              className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => navigate(`/admin/instructors/edit/${instructor.id}`)}
                              className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white"
                            >
                              <Edit size={16} />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
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
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="px-2">
            <div className="flex justify-between items-center text-sm lg:w-[91%] text-gray-600">
              <div className="hidden lg:block text-left pr-2">
                Showing {(currentPage - 1) * coursesPerPage + 1} to {Math.min(currentPage * coursesPerPage, totalInstructors)} of {totalInstructors} results
              </div>
              <div className="w-full lg:w-auto flex items-center justify-center lg:justify-end space-x-1">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 cursor-pointer p-[1px]"
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                </button>

                {renderPaginationButtons()}

                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 cursor-pointer p-[1px]"
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageInstructors;