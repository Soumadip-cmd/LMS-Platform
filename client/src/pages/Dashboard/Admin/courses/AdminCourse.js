import React, { useState, useRef, useEffect } from "react";
import AdminSidebar from "../AdminSidebar";
import { Search, Calendar, Eye, Edit, ChevronDown } from "lucide-react";

const AdminCourse = () => {
  const [currentPage, setCurrentPage] = useState(2);
  const [totalPages] = useState(21);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState("Jan 11–Jan 25");
  const [selectedMonth, setSelectedMonth] = useState(0); // January
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedStartDate, setSelectedStartDate] = useState(11);
  const [selectedEndDate, setSelectedEndDate] = useState(25);
  
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

  // Calendar functions
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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
      setDateRange(`${months[selectedMonth]} ${selectedStartDate}–${months[selectedMonth]} ${selectedEndDate}`);
      setShowCalendar(false);
    }
  };

  // Sample course data
  const courses = [
    {
      id: "86785765",
      name: "Advanced German",
      instructor: "Annette Black",
      sale: 324,
      price: "$324",
      lesson: 43,
      totalTime: "456Hours",
      status: "Published",
    },
    {
      id: "86785765",
      name: "Advanced German",
      instructor: "Annette Black",
      sale: 324,
      price: "$324",
      lesson: 43,
      totalTime: "136Hours",
      status: "Draft",
    },
    {
      id: "86785765",
      name: "Advanced German",
      instructor: "Annette Black",
      sale: 324,
      price: "$324",
      lesson: 43,
      totalTime: "436Hours",
      status: "Cancelled",
    },
    {
      id: "86785765",
      name: "Advanced German",
      instructor: "Annette Black",
      sale: 324,
      price: "$324",
      lesson: 43,
      totalTime: "236Hours",
      status: "Published",
    },
    {
      id: "86785765",
      name: "Advanced German",
      instructor: "Annette Black",
      sale: 324,
      price: "$324",
      lesson: 43,
      totalTime: "236Hours",
      status: "Published",
    },
    {
      id: "86785765",
      name: "Advanced German",
      instructor: "Annette Black",
      sale: 324,
      price: "$324",
      lesson: 43,
      totalTime: "236Hours",
      status: "Published",
    },
    {
      id: "86785765",
      name: "Advanced German",
      instructor: "Annette Black",
      sale: 324,
      price: "$324",
      lesson: 43,
      totalTime: "236Hours",
      status: "Published",
    },
    {
      id: "86785765",
      name: "Advanced German",
      instructor: "Annette Black",
      sale: 324,
      price: "$324",
      lesson: 43,
      totalTime: "236Hours",
      status: "Published",
    },
  ];

  return (
    <div className="flex">
      <AdminSidebar active="Courses" />

      {/* Main content area */}
      <div className="flex-1 pl-0 overflow-x-auto">
        <div className="p-4 lg:p-6 pt-9">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h1 className="text-2xl font-medium text-gray-600">Courses</h1>
              <p className="text-gray-400 text-base">
                Manage and track all available courses
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6 lg:mt-0 w-full lg:w-auto">
              <button className="flex items-center justify-center gap-2 border border-blue-500 text-blue-500 py-2 px-4 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-download-icon lucide-download"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Export
              </button>

              <button className="flex items-center justify-center gap-2 bg-yellow-400 text-white py-2 px-4 rounded-md">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 4.16667V15.8333M4.16667 10H15.8333"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add New Course
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
                  placeholder="Search by ID, Product, or others..."
                  className="w-full pl-12 pr-4 py-3 border-none rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-full flex justify-between lg:justify-start lg:w-auto gap-3">
                {/* Filter Button with Dropdown */}
                <div className="relative" ref={filterRef}>
                  <button 
                    className="flex items-center gap-2 border border-gray-500 bg-white px-4 py-2 rounded-lg"
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
                      className="text-blue-600 lucide lucide-sliders-horizontal-icon lucide-sliders-horizontal"
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
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>
                  
                  {/* Filter Dropdown Menu */}
                  {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="font-medium text-gray-700">Sort Courses By</h3>
                      </div>
                      <div className="p-2">
                        <button className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center">
                          <span className="w-5 h-5 mr-2 inline-block border border-blue-500 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="w-2 h-2 bg-white rounded-full"></span>
                          </span>
                          Course Name (A-Z)
                        </button>
                        <button className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center">
                          <span className="w-5 h-5 mr-2 inline-block border border-gray-300 rounded-full"></span>
                          Course Name (Z-A)
                        </button>
                        <button className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center">
                          <span className="w-5 h-5 mr-2 inline-block border border-gray-300 rounded-full"></span>
                          Instructor (A-Z)
                        </button>
                        <button className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center">
                          <span className="w-5 h-5 mr-2 inline-block border border-gray-300 rounded-full"></span>
                          Price (Low to High)
                        </button>
                        <button className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center">
                          <span className="w-5 h-5 mr-2 inline-block border border-gray-300 rounded-full"></span>
                          Price (High to Low)
                        </button>
                        <button className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center">
                          <span className="w-5 h-5 mr-2 inline-block border border-gray-300 rounded-full"></span>
                          Status
                        </button>
                      </div>
                      <div className="p-3 border-t border-gray-200 flex justify-end">
                        <button 
                          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                          onClick={() => setShowFilterDropdown(false)}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date Button with Calendar */}
                <div className="relative" ref={calendarRef}>
                  <button 
                    className="flex items-center gap-2 border border-gray-500 bg-white px-4 py-2 rounded-lg"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <Calendar size={18} className="text-blue-600" />
                    {dateRange}
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>
                  
                  {/* Calendar Dropdown */}
                  {showCalendar && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="p-3 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <button 
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => {
                              if (selectedMonth === 0) {
                                setSelectedMonth(11);
                                setSelectedYear(selectedYear - 1);
                              } else {
                                setSelectedMonth(selectedMonth - 1);
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m15 18-6-6 6-6"/>
                            </svg>
                          </button>
                          <h3 className="font-medium text-gray-700">
                            {months[selectedMonth]} {selectedYear}
                          </h3>
                          <button 
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => {
                              if (selectedMonth === 11) {
                                setSelectedMonth(0);
                                setSelectedYear(selectedYear + 1);
                              } else {
                                setSelectedMonth(selectedMonth + 1);
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9 18 6-6-6-6"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-2">
                        {/* Day names */}
                        <div className="grid grid-cols-7 gap-1 mb-1">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                            <div key={day} className="text-center text-xs text-gray-500 p-1">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-1">
                          {/* Calculate the first day of the month to add proper offset */}
                          {Array(new Date(selectedYear, selectedMonth, 1).getDay()).fill(null).map((_, index) => (
                            <div key={`empty-${index}`} className="p-1"></div>
                          ))}
                          
                          {generateCalendarDays(selectedMonth, selectedYear).map((day) => (
                            <button
                              key={day}
                              className={`text-center rounded-full w-8 h-8 mx-auto flex items-center justify-center text-sm
                                ${day === selectedStartDate || day === selectedEndDate ? 'bg-blue-500 text-white' : ''}
                                ${day !== selectedStartDate && day !== selectedEndDate && selectedStartDate && selectedEndDate && 
                                  day > Math.min(selectedStartDate, selectedEndDate) && 
                                  day < Math.max(selectedStartDate, selectedEndDate) ? 'bg-blue-100' : ''}
                                hover:bg-blue-200`}
                              onClick={() => handleDateSelection(day)}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 border-t border-gray-200 flex justify-between">
                        <div className="text-sm text-gray-600">
                          {selectedStartDate && selectedEndDate ? (
                            <span>
                              {months[selectedMonth]} {Math.min(selectedStartDate, selectedEndDate)} - {months[selectedMonth]} {Math.max(selectedStartDate, selectedEndDate)}
                            </span>
                          ) : selectedStartDate ? (
                            <span>Select end date</span>
                          ) : (
                            <span>Select date range</span>
                          )}
                        </div>
                        <button 
                          className={`px-4 py-1 rounded-md text-sm ${selectedStartDate && selectedEndDate ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                          onClick={applyDateRange}
                          disabled={!selectedStartDate || !selectedEndDate}
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
            <div className="w-full overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-center text-gray-500 text-sm">
                    <th className="pb-3 px-4 font-medium whitespace-nowrap text-center">
                      Course Name
                    </th>
                    <th className="pb-3 px-4 font-medium whitespace-nowrap text-center">
                      Instructor
                    </th>
                    <th className="pb-3 px-4 font-medium whitespace-nowrap text-center">
                      Sale
                    </th>
                    <th className="pb-3 px-4 font-medium whitespace-nowrap text-center">
                      Price
                    </th>
                    <th className="pb-3 px-4 font-medium whitespace-nowrap text-center">
                      Lesson
                    </th>
                    <th className="pb-3 px-4 font-medium whitespace-nowrap text-center">
                      Total Time
                    </th>
                    <th className="pb-3 px-4 font-medium whitespace-nowrap text-center">
                      Status
                    </th>
                    <th className="pb-3 px-4 font-medium whitespace-nowrap text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center">
                          <p className="font-medium">{course.name}</p>
                          <p className="text-sm text-gray-500">#{course.id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        {course.instructor}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        {course.sale}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        {course.price}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        {course.lesson}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        {course.totalTime}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-block w-24 text-center px-3 py-1 rounded-md text-sm font-medium ${
                            course.status === "Published"
                              ? "bg-blue-600 text-white cursor-pointer"
                              : course.status === "Draft"
                              ? "bg-yellow-400 text-white cursor-pointer"
                              : "bg-red-600 text-white cursor-pointer"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <div className="flex space-x-2 justify-center">
                          <button className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <Eye size={16} />
                          </button>
                          <button className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
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
                              className="lucide lucide-trash"
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
          </div>

          {/* Pagination */}
          <div className="px-2">
            <div className="flex justify-between items-center text-sm lg:w-[91%] text-gray-600">
              <div className="hidden lg:block text-left">
                Showing 1 to 10 of 97 results
              </div>
              <div className="w-full lg:w-auto flex items-center justify-center lg:justify-end space-x-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 cursor-pointer p-[1px] mr-1"
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
                    className="lucide lucide-arrow-left"
                  >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                </button>

                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-600"
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <span className="px-2">...</span>

                {[20, 21].map((page) => (
                  <button
                    key={page}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-600"
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 cursor-pointer p-[1px] mr-1"
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
                    className="lucide lucide-arrow-right"
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

export default AdminCourse;