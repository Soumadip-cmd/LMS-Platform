import React, { useState, useRef, useEffect } from "react";
import AdminSidebar from "../AdminSidebar";
import { Search, Eye, Edit, ChevronDown, Download, Plus } from "lucide-react";

const Messages = () => {
  const [currentPage, setCurrentPage] = useState(2);
  const [totalPages] = useState(21);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState("Jan 11–Jan 25");
  const [selectedMonth, setSelectedMonth] = useState(0); // January
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedStartDate, setSelectedStartDate] = useState(11);
  const [selectedEndDate, setSelectedEndDate] = useState(25);
  const [selectedFilter, setSelectedFilter] = useState("All");

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

  // Function to determine status class
  const getStatusClass = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-500 text-white";
      case "Replied":
        return "bg-yellow-400 text-white";
      case "Closed":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Sample messages data
  const messages = [
    {
      id: "msg001",
      subject: "Unable to login in System...",
      type: "Support",
      from: "Annette Black",
      to: "Mehedi Hasan",
      receiptDate: "2 Apr 2025",
      lastResponse: "7 Apr 2025",
      closedOn: "10 Apr 2025",
      status: "New"
    },
    {
      id: "msg002",
      subject: "Question about exam schedule",
      type: "Inquiry",
      from: "John Smith",
      to: "Sarah Johnson",
      receiptDate: "1 Apr 2025",
      lastResponse: "3 Apr 2025",
      closedOn: "-",
      status: "Replied"
    },
    {
      id: "msg003",
      subject: "Certificate request for B2 German",
      type: "Request",
      from: "Emily Chen",
      to: "Thomas Weber",
      receiptDate: "29 Mar 2025",
      lastResponse: "30 Mar 2025",
      closedOn: "5 Apr 2025",
      status: "Closed"
    }
  ];

  return (
    <div className="flex">
      <AdminSidebar active="Messages" />

      {/* Main content area */}
      <div className="flex-1 pl-0 overflow-x-auto">
        <div className="p-4 lg:p-6 pt-9">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
              <h1 className="text-2xl font-medium text-gray-600">
              Messages
              </h1>
              <p className="text-gray-400 text-base">
                Communicate with students and instructors
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6 lg:mt-0 w-full lg:w-auto">
              <button className="flex items-center justify-center gap-2 border border-blue-500 text-blue-500 py-2 px-4 rounded-md">
                <Download size={20} />
                Export
              </button>

              <button className="flex items-center justify-center gap-2 bg-yellow-400 text-white py-2 px-4 rounded-md">
                <Plus size={20} />
                Add New Message
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
                  placeholder="Search by message subject, sender, or recipient..."
                  className="w-full pl-12 pr-4 py-3 border-none rounded-full bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        {["All", "New", "Replied", "Closed"].map((status) => (
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
            <div className="w-full overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-gray-500 text-sm">
                    <th className="pb-3 px-4 font-medium text-left">Message Subject</th>
                    <th className="pb-3 px-4 font-medium text-left">Type</th>
                    <th className="pb-3 px-4 font-medium text-left">From</th>
                    <th className="pb-3 px-4 font-medium text-left">To</th>
                    <th className="pb-3 px-4 font-medium text-left">Receipt Date</th>
                    <th className="pb-3 px-4 font-medium text-left">Last Response</th>
                    <th className="pb-3 px-4 font-medium text-left">Closed On</th>
                    <th className="pb-3 px-4 font-medium text-left">Status</th>
                    <th className="pb-3 px-4 font-medium text-left">Action</th>
                  </tr>
                </thead>
                <tr>
                  <td colSpan="10">
                    <hr className="border-gray-200 my-1" />
                  </td>
                </tr>
                <tbody>
                  {messages.map((message, index) => (
                    <React.Fragment key={message.id}>
                      <tr
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="py-3 px-4 whitespace-nowrap text-blue-500">
                          {message.subject}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {message.type}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {message.from}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {message.to}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {message.receiptDate}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {message.lastResponse}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {message.closedOn}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block text-center px-4 py-1 rounded-md text-sm font-medium cursor-pointer w-24 ${getStatusClass(
                              message.status
                            )}`}
                          >
                            {message.status}
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
                      {index < messages.length - 1 && (
                        <tr>
                          <td colSpan="10">
                            <hr className="border-gray-200 my-1" />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="px-2">
            <div className="flex justify-between items-center text-sm lg:w-[98%] text-gray-600">
              <div className="hidden lg:block text-left pr-2">
                Showing 1 to 3 of 97 results
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

export default Messages;