import React, { useState, useRef, useEffect } from 'react';
import AdminSidebar from '../AdminSidebar';
import { Search, Eye, Edit, Trash2, Download, PlusCircle, Filter, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const Assignment = () => {
  const [currentPage, setCurrentPage] = useState(2);
  const [totalPages] = useState(21);
  const [dateRange, setDateRange] = useState("Jan 11- Jan 25");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  
  const filterRef = useRef(null);
  const calendarRef = useRef(null);
  
  // Sample assignment data
  const assignments = [
    {
      id: "#plgoethea10123",
      name: "Goethe A1 German",
      instructor: "Annette Black",
      type: "Reading",
      language: "German",
      pattern: "Goethe",
      level: "B1",
      attempts: "345",
      status: "Published"
    },
    {
      id: "#plgoethea1w0123",
      name: "Advanced German",
      instructor: "Annette Black",
      type: "",
      language: "",
      pattern: "",
      level: "",
      attempts: "",
      status: "In Progress"
    },
    {
      id: "#plgoethea1g0123",
      name: "Advanced German",
      instructor: "Annette Black",
      type: "",
      language: "",
      pattern: "",
      level: "",
      attempts: "",
      status: "Completed"
    }
  ];

  // Filter options
  const filterOptions = {
    type: ["Reading", "Writing", "Listening", "Speaking", "All"],
    language: ["German", "English", "French", "Spanish", "All"],
    pattern: ["Goethe", "Cambridge", "TOEFL", "IELTS", "All"],
    level: ["A1", "A2", "B1", "B2", "C1", "C2", "All"],
    status: ["Published", "In Progress", "Completed", "All"]
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

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

  const goToPrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

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

  const getStatusClass = (status) => {
    switch (status) {
      case "Published":
        return "bg-blue-500 text-white";
      case "In Progress":
        return "bg-[#FFB71C] text-white";
      case "Completed":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Calendar helpers
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  const handleDateClick = (day) => {
    const clickedDate = new Date(selectedYear, selectedMonth, day);
    
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(clickedDate);
      setSelectedEndDate(null);
    } else {
      if (clickedDate < selectedStartDate) {
        setSelectedStartDate(clickedDate);
        setSelectedEndDate(null);
      } else {
        setSelectedEndDate(clickedDate);
        
        // Format and set the date range string
        const startDateStr = `${months[selectedStartDate.getMonth()].substring(0, 3)} ${selectedStartDate.getDate()}`;
        const endDateStr = `${months[clickedDate.getMonth()].substring(0, 3)} ${clickedDate.getDate()}`;
        setDateRange(`${startDateStr}- ${endDateStr}`);
        setShowCalendar(false);
      }
    }
  };
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const calendarDays = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    
    // Cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const isStartDate = selectedStartDate && date.getDate() === selectedStartDate.getDate() && 
                          date.getMonth() === selectedStartDate.getMonth() && 
                          date.getFullYear() === selectedStartDate.getFullYear();
      const isEndDate = selectedEndDate && date.getDate() === selectedEndDate.getDate() && 
                        date.getMonth() === selectedEndDate.getMonth() && 
                        date.getFullYear() === selectedEndDate.getFullYear();
      const isInRange = selectedStartDate && selectedEndDate && 
                        date >= selectedStartDate && date <= selectedEndDate;
      
      calendarDays.push(
        <div 
          key={`day-${day}`} 
          onClick={() => handleDateClick(day)}
          className={`h-8 w-8 flex items-center justify-center rounded-full cursor-pointer text-sm
                    ${isStartDate || isEndDate ? 'bg-blue-500 text-white' : ''} 
                    ${isInRange && !isStartDate && !isEndDate ? 'bg-blue-100' : ''}`}
        >
          {day}
        </div>
      );
    }
    
    return calendarDays;
  };

  return (
    <div className="flex">
      <AdminSidebar active="Assignments" />

      {/* Main content area */}
      <div className="flex-1 pl-0 overflow-x-auto">
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h1 className="text-2xl font-medium text-gray-600">Assignments</h1>
              <p className="text-gray-400 text-base">
                Create, track, and review assignments
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6 lg:mt-0 w-full lg:w-auto">
              <button className="flex items-center justify-center gap-2 border border-blue-500 text-blue-500 py-2 px-4 rounded-md">
                <Download size={20} />
                Export
              </button>

              <button className="flex items-center justify-center gap-2 bg-[#FFB71C] text-white py-2 px-4 rounded-md">
                <PlusCircle size={20} />
                Add New Assignment
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-50 rounded-3xl p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-5">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-blue-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by ID, Product, or others..."
                  className="w-full pl-12 pr-4 py-3 border-none rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-full flex justify-between lg:justify-start lg:w-auto gap-3">
                {/* Filter Button with Dropdown */}
                <div className="relative" ref={filterRef}>
                  <button 
                    className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-lg"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
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
                      <line x1="21" x2="14" y1="4" y2="4" />
                      <line x1="10" x2="3" y1="4" y2="4" />
                      <line x1="21" x2="12" y1="12" y2="12" />
                      <line x1="8" x2="3" y1="12" y2="12" />
                      <line x1="21" x2="16" y1="20" y2="20" />
                      <line x1="12" x2="3" y1="20" y2="20" />
                      <line x1="14" x2="14" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="10" y2="14" />
                      <line x1="16" x2="16" y1="18" y2="22" />
                    </svg>
                    Filter
                  </button>
                  
                  {/* Filter Dropdown Menu (hidden by default) */}
                  {showFilterDropdown && (
                    <div className="absolute left-0 md:right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 px-4 pt-0 max-h-96 overflow-y-auto">
                      <h3 className="font-medium text-gray-700 mb-2 sticky top-0  py-4 bg-white">Filter by</h3>
                      
                      {/* Type Filter */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-600 mb-1">Type</p>
                        <div className="flex flex-wrap gap-2">
                          {filterOptions.type.map((option) => (
                            <span key={option} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 cursor-pointer hover:bg-blue-100">
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Language Filter */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-600 mb-1">Language</p>
                        <div className="flex flex-wrap gap-2">
                          {filterOptions.language.map((option) => (
                            <span key={option} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 cursor-pointer hover:bg-blue-100">
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Pattern Filter */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-600 mb-1">Pattern</p>
                        <div className="flex flex-wrap gap-2">
                          {filterOptions.pattern.map((option) => (
                            <span key={option} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 cursor-pointer hover:bg-blue-100">
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Level Filter */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-600 mb-1">Level</p>
                        <div className="flex flex-wrap gap-2">
                          {filterOptions.level.map((option) => (
                            <span key={option} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 cursor-pointer hover:bg-blue-100">
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Status Filter */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
                        <div className="flex flex-wrap gap-2">
                          {filterOptions.status.map((option) => (
                            <span key={option} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 cursor-pointer hover:bg-blue-100">
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-3 sticky bottom-0 bg-white pb-1 pt-2 border-t border-gray-100">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">Apply Filters</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date Range Button with Calendar */}
                <div className="relative" ref={calendarRef}>
                  <button 
                    className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 rounded-lg"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <Calendar size={18} className="text-blue-600" />
                    {dateRange}
                  </button>
                  
                  {/* Calendar Dropdown */}
                  {showCalendar && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-4">
                      <div className="flex justify-between items-center mb-4">
                        <button 
                          onClick={() => {
                            if (selectedMonth === 0) {
                              setSelectedMonth(11);
                              setSelectedYear(selectedYear - 1);
                            } else {
                              setSelectedMonth(selectedMonth - 1);
                            }
                          }}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        
                        <span className="font-medium">
                          {months[selectedMonth]} {selectedYear}
                        </span>
                        
                        <button 
                          onClick={() => {
                            if (selectedMonth === 11) {
                              setSelectedMonth(0);
                              setSelectedYear(selectedYear + 1);
                            } else {
                              setSelectedMonth(selectedMonth + 1);
                            }
                          }}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      
                      {/* Days of the week */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {days.map(day => (
                          <div key={day} className="h-8 w-8 flex items-center justify-center text-xs text-gray-500">{day}</div>
                        ))}
                      </div>
                      
                      {/* Calendar grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {renderCalendarDays()}
                      </div>
                      
                      {/* Selected date range info */}
                      <div className="mt-3 text-sm text-gray-600">
                        {selectedStartDate && !selectedEndDate && (
                          <p>Select end date</p>
                        )}
                        {selectedStartDate && selectedEndDate && (
                          <p>
                            <span className="font-medium">Selected range: </span>
                            {months[selectedStartDate.getMonth()].substring(0, 3)} {selectedStartDate.getDate()} - {months[selectedEndDate.getMonth()].substring(0, 3)} {selectedEndDate.getDate()}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex justify-end mt-3 gap-2">
                        <button 
                          onClick={() => {
                            setSelectedStartDate(null);
                            setSelectedEndDate(null);
                          }}
                          className="px-3 py-1 border border-gray-300 text-gray-600 rounded-md text-sm"
                        >
                          Reset
                        </button>
                        <button 
                          onClick={() => setShowCalendar(false)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
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

          {/* Table */}
          <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-black text-sm">
                    <th className="pb-3 px-4 font-medium text-left">ID</th>
                    <th className="pb-3 px-4 font-medium text-left">Assignment Name</th>
                    <th className="pb-3 px-4 font-medium text-left">Instructor</th>
                    <th className="pb-3 px-4 font-medium text-left">Type</th>
                    <th className="pb-3 px-4 font-medium text-left">Language</th>
                    <th className="pb-3 px-4 font-medium text-left">Pattern</th>
                    <th className="pb-3 px-4 font-medium text-left">Level</th>
                    <th className="pb-3 px-4 font-medium text-left">Attempts</th>
                    <th className="pb-3 px-4 font-medium text-left">Status</th>
                    <th className="pb-3 px-4 font-medium text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-white"}
                    >
                      <td className="py-3 px-4 whitespace-nowrap text-blue-500 font-medium">
                        {assignment.id}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-medium">
                        {assignment.name}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-500">
                        {assignment.instructor}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-500">
                        {assignment.type}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-500">
                        {assignment.language}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-500">
                        {assignment.pattern}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-500">
                        {assignment.level}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-500">
                        {assignment.attempts}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block w-24 text-center px-4 py-1 rounded-md text-sm cursor-pointer font-medium ${getStatusClass(assignment.status)}`}
                        >
                          {assignment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <Eye size={16} />
                          </button>
                          <button className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                            <Edit size={16} />
                          </button>
                          {assignment.status === "Published" && (
                            <button className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="px-2">
            <div className="flex justify-between items-center text-sm lg:w-[95%] text-gray-600">
              <div className="hidden lg:block text-left pr-2">
                Showing 1 to 10 of 97 results
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

export default Assignment;