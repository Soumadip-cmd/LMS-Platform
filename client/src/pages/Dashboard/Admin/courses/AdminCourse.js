import React, { useState, useRef, useEffect, useContext } from "react";
import AdminSidebar from "../AdminSidebar";
import { Search, Calendar, Eye, Edit, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import CourseContext from "../../../../context/course/courseContext";
import AdminContext from "../../../../context/admin/adminContext";

const AdminCourse = () => {
  // Get course context
  const courseContext = useContext(CourseContext);
  const adminContext = useContext(AdminContext);

  // State for courses and pagination
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [statusFilter, setStatusFilter] = useState("");

  // UI state
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState("Jan 11–Jan 25");
  const [selectedMonth, setSelectedMonth] = useState(0); // January
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedStartDate, setSelectedStartDate] = useState(11);
  const [selectedEndDate, setSelectedEndDate] = useState(25);
  const [coursesPerPage, setCoursesPerPage] = useState(10);

  const filterRef = useRef(null);
  const calendarRef = useRef(null);
  const statusDropdownRefs = useRef({});

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close filter dropdown
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }

      // Close calendar dropdown
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }

      // Close status dropdowns
      const statusDropdowns = document.querySelectorAll('[id^="status-dropdown-"]');
      statusDropdowns.forEach(dropdown => {
        // Check if the click was outside this dropdown
        if (!dropdown.contains(event.target) &&
            !event.target.closest('button')?.getAttribute('data-status-toggle') === dropdown.id) {
          dropdown.classList.add('hidden');
        }
      });
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

  // Function to fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', coursesPerPage);

      if (statusFilter) params.append('status', statusFilter);
      if (sortBy) params.append('sortBy', sortBy);

      // Make API call
      const response = await axios.get(`/courses/admin/all-courses?${params.toString()}`);

      if (response.data.success) {
        // Format courses data
        const formattedCourses = response.data.courses.map(course => ({
          id: course._id,
          name: course.title,
          instructor: course.instructor ? course.instructor.name : 'Unknown',
          sale: course.enrolledStudents ? course.enrolledStudents.length : 0,
          price: `$${course.price}`,
          lesson: course.lessons ? course.lessons.length : 0,
          totalTime: `${course.totalDuration || 0}Hours`,
          status: course.status.charAt(0).toUpperCase() + course.status.slice(1), // Capitalize status
        }));

        setCourses(formattedCourses);
        setTotalCourses(response.data.total || formattedCourses.length);
        setTotalPages(Math.ceil((response.data.total || formattedCourses.length) / coursesPerPage));
      } else {
        toast.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (newSortBy) => {
    setSortBy(newSortBy);
    setShowFilterDropdown(false);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  // Update course status
  const updateCourseStatus = async (courseId, newStatus) => {
    try {
      setLoading(true);
      // Use PUT method instead of PATCH to avoid CORS issues
      const response = await axios.put(`/courses/${courseId}/update`, { status: newStatus });

      if (response.data.success) {
        toast.success(response.data.message || 'Course status updated successfully');

        // Update the course status in the local state
        setCourses(courses.map(course =>
          course.id === courseId
            ? { ...course, status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) }
            : course
        ));
      } else {
        toast.error('Failed to update course status');
      }
    } catch (error) {
      console.error('Error updating course status:', error);
      toast.error(error.response?.data?.message || 'Failed to update course status');
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses when component mounts or when filters/pagination change
  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, coursesPerPage, sortBy, statusFilter]);

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

              <Link className="flex items-center justify-center gap-2 bg-yellow-400 text-white py-2 px-4 rounded-md" to='/dashboard/admin/courses/add-course'>
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
              </Link>
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
                  value={searchTerm}
                  onChange={handleSearch}
                  onKeyDown={(e) => e.key === 'Enter' && fetchCourses()}
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
                        <button
                          className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center"
                          onClick={() => handleFilterChange('title')}
                        >
                          <span className={`w-5 h-5 mr-2 flex items-center justify-center border rounded-full ${sortBy === 'title' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                            {sortBy === 'title' && <span className="w-2 h-2 bg-white rounded-full"></span>}
                          </span>
                          Course Name (A-Z)
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center"
                          onClick={() => handleFilterChange('title-desc')}
                        >
                          <span className={`w-5 h-5 mr-2 flex items-center justify-center border rounded-full ${sortBy === 'title-desc' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                            {sortBy === 'title-desc' && <span className="w-2 h-2 bg-white rounded-full"></span>}
                          </span>
                          Course Name (Z-A)
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center"
                          onClick={() => handleFilterChange('instructor')}
                        >
                          <span className={`w-5 h-5 mr-2 flex items-center justify-center border rounded-full ${sortBy === 'instructor' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                            {sortBy === 'instructor' && <span className="w-2 h-2 bg-white rounded-full"></span>}
                          </span>
                          Instructor (A-Z)
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center"
                          onClick={() => handleFilterChange('price-asc')}
                        >
                          <span className={`w-5 h-5 mr-2 flex items-center justify-center border rounded-full ${sortBy === 'price-asc' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                            {sortBy === 'price-asc' && <span className="w-2 h-2 bg-white rounded-full"></span>}
                          </span>
                          Price (Low to High)
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center"
                          onClick={() => handleFilterChange('price-desc')}
                        >
                          <span className={`w-5 h-5 mr-2 flex items-center justify-center border rounded-full ${sortBy === 'price-desc' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                            {sortBy === 'price-desc' && <span className="w-2 h-2 bg-white rounded-full"></span>}
                          </span>
                          Price (High to Low)
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center"
                          onClick={() => handleFilterChange('recent')}
                        >
                          <span className={`w-5 h-5 mr-2 flex items-center justify-center border rounded-full ${sortBy === 'recent' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                            {sortBy === 'recent' && <span className="w-2 h-2 bg-white rounded-full"></span>}
                          </span>
                          Most Recent
                        </button>
                      </div>
                      <div className="p-3 border-t border-b border-gray-200">
                        <h3 className="font-medium text-gray-700">Filter by Status</h3>
                      </div>
                      <div className="p-2">
                        <button
                          className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center"
                          onClick={() => handleStatusFilterChange('')}
                        >
                          <span className={`w-5 h-5 mr-2 flex items-center justify-center border rounded-full ${statusFilter === '' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                            {statusFilter === '' && <span className="w-2 h-2 bg-white rounded-full"></span>}
                          </span>
                          All Statuses
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center"
                          onClick={() => handleStatusFilterChange('published')}
                        >
                          <span className={`w-5 h-5 mr-2 flex items-center justify-center border rounded-full ${statusFilter === 'published' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                            {statusFilter === 'published' && <span className="w-2 h-2 bg-white rounded-full"></span>}
                          </span>
                          Published
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center"
                          onClick={() => handleStatusFilterChange('draft')}
                        >
                          <span className={`w-5 h-5 mr-2 flex items-center justify-center border rounded-full ${statusFilter === 'draft' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                            {statusFilter === 'draft' && <span className="w-2 h-2 bg-white rounded-full"></span>}
                          </span>
                          Draft
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center"
                          onClick={() => handleStatusFilterChange('archived')}
                        >
                          <span className={`w-5 h-5 mr-2 flex items-center justify-center border rounded-full ${statusFilter === 'archived' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                            {statusFilter === 'archived' && <span className="w-2 h-2 bg-white rounded-full"></span>}
                          </span>
                          Archived
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-gray-700 flex items-center"
                          onClick={() => handleStatusFilterChange('underReview')}
                        >
                          <span className={`w-5 h-5 mr-2 flex items-center justify-center border rounded-full ${statusFilter === 'underReview' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                            {statusFilter === 'underReview' && <span className="w-2 h-2 bg-white rounded-full"></span>}
                          </span>
                          Under Review
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
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No courses found. Try adjusting your filters or add a new course.
                </div>
              ) : (
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
                        key={course.id || index}
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
                        <td className="py-4 px-4 whitespace-nowrap text-center relative">
                          <div className="relative inline-block">
                            <button
                              onClick={() => {
                                // Show dropdown menu for status change
                                const dropdown = document.getElementById(`status-dropdown-${course.id}`);
                                if (dropdown) {
                                  dropdown.classList.toggle('hidden');
                                }
                              }}
                              className={`inline-block w-24 text-center px-3 py-1 rounded-md text-sm font-medium ${
                                course.status === "Published"
                                  ? "bg-blue-600 text-white cursor-pointer"
                                  : course.status === "Draft"
                                  ? "bg-yellow-400 text-white cursor-pointer"
                                  : course.status === "Archived"
                                  ? "bg-red-600 text-white cursor-pointer"
                                  : "bg-gray-500 text-white cursor-pointer"
                              }`}
                            >
                              {course.status}
                            </button>

                            {/* Status dropdown menu */}
                            <div
                              id={`status-dropdown-${course.id}`}
                              className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    updateCourseStatus(course.id, 'published');
                                    document.getElementById(`status-dropdown-${course.id}`).classList.add('hidden');
                                  }}
                                  className={`block w-full text-left px-4 py-2 text-sm ${course.status === 'Published' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-blue-50'}`}
                                >
                                  Published
                                </button>
                                <button
                                  onClick={() => {
                                    updateCourseStatus(course.id, 'draft');
                                    document.getElementById(`status-dropdown-${course.id}`).classList.add('hidden');
                                  }}
                                  className={`block w-full text-left px-4 py-2 text-sm ${course.status === 'Draft' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-blue-50'}`}
                                >
                                  Draft
                                </button>
                                <button
                                  onClick={() => {
                                    updateCourseStatus(course.id, 'archived');
                                    document.getElementById(`status-dropdown-${course.id}`).classList.add('hidden');
                                  }}
                                  className={`block w-full text-left px-4 py-2 text-sm ${course.status === 'Archived' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-blue-50'}`}
                                >
                                  Archived
                                </button>
                                <button
                                  onClick={() => {
                                    updateCourseStatus(course.id, 'underReview');
                                    document.getElementById(`status-dropdown-${course.id}`).classList.add('hidden');
                                  }}
                                  className={`block w-full text-left px-4 py-2 text-sm ${course.status === 'UnderReview' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-blue-50'}`}
                                >
                                  Under Review
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-center">
                          <div className="flex space-x-2 justify-center">
                            <button
                              className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
                              title="View Course"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white"
                              title="Edit Course"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white"
                              title="Delete Course"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this course?')) {
                                  // Handle delete course
                                  toast.success('This feature will be implemented soon');
                                }
                              }}
                            >
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
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="px-2">
            <div className="flex justify-between items-center text-sm lg:w-[91%] text-gray-600">
              <div className="hidden lg:block text-left">
                {totalCourses > 0 ? (
                  `Showing ${(currentPage - 1) * coursesPerPage + 1} to ${Math.min(currentPage * coursesPerPage, totalCourses)} of ${totalCourses} results`
                ) : (
                  "No results found"
                )}
              </div>
              {totalPages > 0 && (
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

                  {/* Generate pagination buttons dynamically */}
                  {(() => {
                    const pageButtons = [];
                    const maxVisiblePages = 5;

                    if (totalPages <= maxVisiblePages) {
                      // Show all pages if there are 5 or fewer
                      for (let i = 1; i <= totalPages; i++) {
                        pageButtons.push(
                          <button
                            key={i}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              currentPage === i
                                ? "bg-blue-600 text-white"
                                : "text-gray-600"
                            }`}
                            onClick={() => handlePageChange(i)}
                          >
                            {i}
                          </button>
                        );
                      }
                    } else {
                      // Always show first page
                      pageButtons.push(
                        <button
                          key={1}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            currentPage === 1
                              ? "bg-blue-600 text-white"
                              : "text-gray-600"
                          }`}
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </button>
                      );

                      // Calculate middle pages
                      let startPage = Math.max(2, currentPage - 1);
                      let endPage = Math.min(totalPages - 1, currentPage + 1);

                      // Add ellipsis if needed
                      if (startPage > 2) {
                        pageButtons.push(<span key="ellipsis1" className="px-1">...</span>);
                      }

                      // Add middle pages
                      for (let i = startPage; i <= endPage; i++) {
                        pageButtons.push(
                          <button
                            key={i}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              currentPage === i
                                ? "bg-blue-600 text-white"
                                : "text-gray-600"
                            }`}
                            onClick={() => handlePageChange(i)}
                          >
                            {i}
                          </button>
                        );
                      }

                      // Add ellipsis if needed
                      if (endPage < totalPages - 1) {
                        pageButtons.push(<span key="ellipsis2" className="px-1">...</span>);
                      }

                      // Always show last page
                      if (totalPages > 1) {
                        pageButtons.push(
                          <button
                            key={totalPages}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              currentPage === totalPages
                                ? "bg-blue-600 text-white"
                                : "text-gray-600"
                            }`}
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </button>
                        );
                      }
                    }

                    return pageButtons;
                  })()}

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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourse;