import React, { useState, useEffect, useContext } from "react";
import {
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  BookOpen,
  FileText,
  Activity,
  MessageSquare,
  Clock,
  DollarSign,
  Award,
  Menu,
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import AdminContext from "../../../context/admin/adminContext";
import AuthContext from "../../../context/auth/authContext";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
  // Get admin context
  const adminContext = useContext(AdminContext);
  const {
    dashboardStats,
    studentStats,
    courseAnalytics,
    supportInsights,
    topCourses,
    totalCourses,
    loading,
    getDashboardStats,
    getStudentStats,
    getCourseAnalytics,
    getSupportInsights,
    getTopCourses
  } = adminContext;

  // Get auth context for user information
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  // Local state
  const [courses, setCourses] = useState(topCourses || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursesPerPage] = useState(10);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Calculate total pages
  const totalPages = Math.ceil(totalCourses / coursesPerPage);

  // Update courses when topCourses changes
  useEffect(() => {
    if (topCourses && topCourses.length > 0) {
      setCourses(topCourses);
    }
  }, [topCourses]);

  // Current date for display
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all dashboard data from context
        await getDashboardStats();
        await getStudentStats();
        await getCourseAnalytics();
        await getSupportInsights();

        // Fetch top courses
        const topCoursesData = await getTopCourses(coursesPerPage, 1);
        if (topCoursesData && topCoursesData.courses) {
          setCourses(topCoursesData.courses);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      }
    };

    fetchDashboardData();
  }, [coursesPerPage]);

  // Fetch top courses when page changes
  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
        setLoadingCourses(true);
        const topCoursesData = await getTopCourses(coursesPerPage, currentPage);
        if (topCoursesData && topCoursesData.courses) {
          setCourses(topCoursesData.courses);
        }
        setLoadingCourses(false);
      } catch (error) {
        console.error('Error fetching top courses:', error);
        toast.error('Failed to load course data');
        setLoadingCourses(false);
      }
    };

    // Always fetch data when page changes
    fetchTopCourses();
  }, [currentPage, coursesPerPage]);

  // Date display component
  const DateDisplay = () => {
    return (
      <div
        className="inline-flex items-center rounded-full px-4 py-1 text-sm"
        style={{
          background: "white",
          border: "1px solid transparent",
          borderRadius: "9999px",
          backgroundImage:
            "linear-gradient(white, white), linear-gradient(to right, #60A5FA, #FFB838)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <span className="text-orange-400">{formattedDate}</span>{" "}
        <span className="text-blue-500 pl-1">{formattedTime}</span>
      </div>
    );
  };

  // Stat card component
  const StatCard = ({
    icon,
    title,
    value,
    trend,
    trendText,
    trendDown = false,
  }) => {
    // Render trend with SVG icons
    const renderTrendText = () => {
      if (trendDown) {
        return (
          <div className="flex items-center text-red-500 text-sm">
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
              className="mr-1"
            >
              <path d="M19 3H5" />
              <path d="M12 21V7" />
              <path d="m6 15 6 6 6-6" />
            </svg>
            <span>
              {trend}% vs {trendText}
            </span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center text-green-500 text-sm">
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
              className="mr-1"
            >
              <path d="m18 9-6-6-6 6" />
              <path d="M12 3v14" />
              <path d="M5 21h14" />
            </svg>
            <span>
              {trend}% vs {trendText}
            </span>
          </div>
        );
      }
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-[0_0px_10px_rgba(0,0,0,0.1)]">
        <div className="text-gray-400 mb-2 text-lg">
          {title}
        </div>
        <div className="flex items-center justify-between">
          <div className="bg-amber-50 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
            {icon}
          </div>
          <div>
            <div className="text-xl sm:text-3xl font-bold text-right mb-1">
              {value}
            </div>
            {renderTrendText()}
          </div>
        </div>
      </div>
    );
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Only visible on desktop */}
      <AdminSidebar active="Dashboard" />

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full md:ml-0">
        <div className="max-w-7xl mx-auto p-2 sm:p-4">
          {/* Header Section */}
          <div className=" rounded-lg pt-10 md:pt-6 px-2 md:px-0 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <div className="w-full">
                <div className="flex flex-col xl:flex-row xl:justify-between">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#1976D2]">
                    Welcome Back, Admin!
                  </h1>
                  <div className="mt-4 xl:mt-0">
                    <DateDisplay />
                  </div>
                </div>
                <p className="text-gray-600 text-base md:text-lg mt-4">
                  Your learning platform is showing exceptional growth! Get
                  comprehensive insights into your courses, student engagement,
                  and revenue metrics.
                </p>
              </div>
            </div>

            {/* First row of Stats Cards */}
            <div className="grid grid-cols-1  md:grid-cols-2 2xl:grid-cols-4 gap-3 sm:gap-6 mt-6">
              <StatCard
                icon={
                  <DollarSign
                    size={24}
                    className="sm:size-32"
                    color="#FFC107"
                  />
                }
                title="Total Revenue"
                value={`$${dashboardStats.revenue.total.toLocaleString()}`}
                trend={dashboardStats.revenue.trend}
                trendText="last month"
                trendDown={dashboardStats.revenue.trend < 0}
              />
              <StatCard
                icon={
                  <Users size={24} className="sm:size-32" color="#FFC107" />
                }
                title="Daily Active Users"
                value={dashboardStats.users.dailyActiveUsers.toLocaleString()}
                trend={dashboardStats.users.dailyUsersTrend}
                trendText="Yesterday"
                trendDown={dashboardStats.users.dailyUsersTrend < 0}
              />
              <StatCard
                icon={
                  <Award size={24} className="sm:size-32" color="#FFC107" />
                }
                title="Course Completion"
                value={`${dashboardStats.courses.completionRate}%`}
                trend={4}
                trendText="last month"
              />
              <StatCard
                icon={
                  <Users size={24} className="sm:size-32" color="#FFC107" />
                }
                title="Active Students"
                value={dashboardStats.users.active.toLocaleString()}
                trend={dashboardStats.users.userGrowthTrend}
                trendText="last month"
                trendDown={dashboardStats.users.userGrowthTrend < 0}
              />
            </div>

            {/* Second row of Stats Cards */}
            <div className="grid grid-cols-1  md:grid-cols-2 2xl:grid-cols-4 gap-3 sm:gap-6 mt-6">
              <StatCard
                icon={
                  <BookOpen size={24} className="sm:size-32" color="#FFC107" />
                }
                title="Active Courses"
                value={dashboardStats.courses.active.toLocaleString()}
                trend={12}
                trendText="last month"
              />
              <StatCard
                icon={
                  <Users size={24} className="sm:size-32" color="#FFC107" />
                }
                title="Active Instructors"
                value={dashboardStats.users.instructors.toLocaleString()}
                trend={12}
                trendText="last month"
              />
              <StatCard
                icon={
                  <Clock size={24} className="sm:size-32" color="#FFC107" />
                }
                title="Average Session"
                value={`${dashboardStats.courses.averageSessionTime} min`}
                trend={dashboardStats.courses.sessionTimeTrend}
                trendText="last month"
                trendDown={dashboardStats.courses.sessionTimeTrend < 0}
              />
              <StatCard
                icon={
                  <MessageSquare size={24} className="sm:size-32" color="#FFC107" />
                }
                title="Support Tickets"
                value={dashboardStats.support.totalTickets.toLocaleString()}
                trend={10}
                trendText="last month"
              />
            </div>
          </div>
          {/* Blue Bar */}
          <div className="w-[95%] p-2 rounded-t-lg mx-auto h-2 bg-[#1976D2]"></div>
          {/* Main dashboard container with blue border */}
          <div className="bg-white rounded-lg shadow border overflow-hidden mb-6">
            {/* Analytics Section */}
            {/* Analytics Section with improved responsiveness */}
            <div className="p-2 sm:p-3 lg:p-4 px-2 sm:px-4 lg:px-6">
              {/* First row: Student Stats and Course Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 xl:gap-4 mb-2 lg:mb-3 xl:mb-4">
                {/* Student Stats */}
                <div className="bg-[#FFEFCB] rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer">
                  <div className="p-2 pb-0 bg-[#FFEFCB] text-center">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-500">
                      Student Stats
                    </h3>
                  </div>
                  <div className="p-2 flex flex-col space-y-4 pb-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-1 bg-white rounded-md px-2 pt-4 sm:pt-6 flex flex-col justify-between">
                        <div className="text-2xl sm:text-4xl font-bold text-center">
                          <span className="numbers">{studentStats.totalStudents.toLocaleString()}</span>
                        </div>
                        <div className="text-sm sm:text-base text-gray-500 text-center mt-1 px-2 sm:px-4 py-2 pb-3 sm:pb-5">
                          Total Students
                        </div>
                      </div>
                      <div className="col-span-1 bg-white rounded-md px-2 pt-4 sm:pt-6 flex flex-col justify-between">
                        <div className="text-2xl sm:text-4xl font-bold text-center">
                          <span className="numbers">{studentStats.activeStudentsPerDay.toLocaleString()}</span>
                        </div>
                        <div className="text-sm sm:text-base text-gray-500 text-center mt-1 px-2 sm:px-4 py-2">
                          Active Students per Day
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 px-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm sm:text-md text-gray-600">
                          Average Rating
                        </div>
                        <div className="text-amber-500 font-bold text-lg sm:text-xl">
                          <span className="numbers">{studentStats.averageRating.toFixed(1)}</span>
                          <span className="text-gray-500 text-xs sm:text-sm">
                            /<span className="numbers">5.0</span>
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-white rounded-full h-2">
                        <div
                          className="bg-amber-400 h-2 rounded-full"
                          style={{ width: `${(studentStats.averageRating / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Analytics */}
                <div className="bg-[#BADDFF] rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer">
                  <div className="p-2 pb-0 bg-[#BADDFF] text-center">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-500">
                      Course Analytics
                    </h3>
                  </div>
                  <div className="p-2 flex flex-col space-y-4 pb-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-1 bg-white rounded-md px-2 pt-4 sm:pt-6 flex flex-col justify-between">
                        <div className="text-2xl sm:text-4xl font-bold text-center">
                          <span className="numbers">{courseAnalytics.totalCourses.toLocaleString()}</span>
                        </div>
                        <div className="text-sm sm:text-base text-gray-500 text-center mt-1 px-2 sm:px-4 py-2 pb-3 sm:pb-5">
                          Total Courses
                        </div>
                      </div>
                      <div className="col-span-1 bg-white rounded-md px-2 pt-4 sm:pt-6 flex flex-col justify-between">
                        <div className="text-2xl sm:text-4xl font-bold text-center">
                          <span className="numbers">{courseAnalytics.activeCoursesPerDay.toLocaleString()}</span>
                        </div>
                        <div className="text-sm sm:text-base text-gray-500 text-center mt-1 px-2 sm:px-4 py-2">
                          Active Courses per Day
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 px-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm sm:text-md text-gray-600">
                          Average Rating
                        </div>
                        <div className="text-blue-500 font-bold text-lg sm:text-xl">
                          <span className="numbers">{courseAnalytics.averageRating.toFixed(1)}</span>
                          <span className="text-gray-500 text-xs sm:text-sm">
                            /<span className="numbers">5.0</span>
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-white rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(courseAnalytics.averageRating / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Support Insights - Displays in the first row for lg and above, full width in md */}
                <div className="bg-[#FFEFCB] rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer hidden lg:block">
                  <div className="p-2 bg-[#FFEFCB] text-center">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-500">
                      Support Insights
                    </h3>
                  </div>
                  <div className="p-2 space-y-2 pb-4">
                    <div className="flex items-center justify-between bg-white rounded-sm p-2 px-4 sm:px-8">
                      <span className="text-sm sm:text-md text-gray-600">
                        Total Tickets
                      </span>
                      <span className="text-2xl sm:text-4xl font-bold">
                        <span className="numbers">{supportInsights.totalTickets}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-sm p-2 px-4 sm:px-8">
                      <span className="text-sm sm:text-md text-gray-600">
                        Open Tickets
                      </span>
                      <span className="text-2xl sm:text-4xl font-bold text-green-500">
                        <span className="numbers">{supportInsights.openTickets}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-sm p-2 px-4 sm:px-8">
                      <span className="text-sm sm:text-md text-gray-600">
                        Resolved Tickets
                      </span>
                      <span className="text-2xl sm:text-4xl font-bold text-red-500">
                        <span className="numbers">{supportInsights.resolvedTickets}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second row: Support Insights for md screens only */}
              <div className="md:grid md:grid-cols-1 lg:hidden gap-2">
                {/* Support Insights - Full width for md to lg */}
                <div className="bg-[#FFEFCB] rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer">
                  <div className="p-2 bg-[#FFEFCB] text-center">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-500">
                      Support Insights
                    </h3>
                  </div>
                  <div className="p-2 space-y-2 pb-4">
                    <div className="flex items-center justify-between bg-white rounded-sm p-2 px-4 sm:px-8">
                      <span className="text-sm sm:text-md text-gray-600">
                        Total Tickets
                      </span>
                      <span className="text-2xl sm:text-4xl font-bold">
                        <span className="numbers">{supportInsights.totalTickets}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-sm p-2 px-4 sm:px-8">
                      <span className="text-sm sm:text-md text-gray-600">
                        Open Tickets
                      </span>
                      <span className="text-2xl sm:text-4xl font-bold text-green-500">
                        <span className="numbers">{supportInsights.openTickets}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-sm p-2 px-4 sm:px-8">
                      <span className="text-sm sm:text-md text-gray-600">
                        Resolved Tickets
                      </span>
                      <span className="text-2xl sm:text-4xl font-bold text-red-500">
                        <span className="numbers">{supportInsights.resolvedTickets}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Running Courses */}
            <div className="px-6 md:px-10 pb-4">
              <div className="flex justify-between items-center mb-4 mt-2">
                <div className="flex items-center">
                  <h3 className="text-lg sm:text-xl font-medium text-gray-500">
                    Top Running Courses
                  </h3>
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/dashboard/fireicon.png`}
                    alt=""
                    className="ml-2 w-5 h-5 sm:w-auto sm:h-auto"
                  />
                </div>
                <button
                  onClick={() => {
                    // Set a larger page size to view more courses
                    setCoursesPerPage(50);
                    // Reset to first page
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-[#FFBE33] text-gray-500 rounded-md text-sm sm:text-base font-medium hover:bg-yellow-600 hover:bg-opacity-15 flex items-center"
                >
                  View All <ChevronRight size={12} className="ml-1" />
                </button>
              </div>

              <div className="overflow-x-auto">
                {loadingCourses ? (
                  <div className="py-8 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-500">Loading courses...</span>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No courses found
                  </div>
                ) : (
                  <table className="min-w-full">
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course.id} className="border-b">
                          <td className="py-3">
                            <div className="font-normal text-sm sm:text-base">
                              {course.title}
                            </div>
                            <div className="text-sm sm:text-base text-gray-500">
                              {course.enrolled}
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <div className="text-blue-500 font-medium text-sm sm:text-base">
                              <span className="numbers">
                                {course.revenue.replace("$", "")}
                              </span>
                              $
                            </div>
                            <div className="text-sm sm:text-base text-[#00562E]">
                              Revenue
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Modify this section in your AdminDashboard component */}

              {/* Improved Pagination Component */}

              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                {/* Hide on mobile and md with the hidden class, show on lg screens and up */}
                <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0 hidden lg:block">
                  Showing{" "}
                  <span className="numbers">
                    {(currentPage - 1) * coursesPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="numbers">
                    {Math.min(currentPage * coursesPerPage, totalCourses)}
                  </span>{" "}
                  of <span className="numbers">{totalCourses}</span> results
                </div>

                {/* The pagination controls - with fixed width container to prevent shifting */}
                <div className="pagination-container flex justify-center sm:justify-end w-full lg:w-auto">
                  <div className="inline-flex items-center">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage <= 1}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 cursor-pointer p-[1px] mr-1"
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

                    {/* Dynamic page buttons */}
                    <div className="inline-flex space-x-1">
                      {(() => {
                        // Generate page numbers dynamically
                        const pageNumbers = [];
                        const maxVisiblePages = 5; // Maximum number of page buttons to show

                        if (totalPages <= maxVisiblePages) {
                          // If we have 5 or fewer pages, show all of them
                          for (let i = 1; i <= totalPages; i++) {
                            pageNumbers.push(i);
                          }
                        } else {
                          // Always show first page
                          pageNumbers.push(1);

                          // Calculate start and end of the middle section
                          let startPage = Math.max(2, currentPage - 1);
                          let endPage = Math.min(totalPages - 1, currentPage + 1);

                          // Adjust if we're near the beginning
                          if (currentPage <= 3) {
                            endPage = Math.min(totalPages - 1, 4);
                          }

                          // Adjust if we're near the end
                          if (currentPage >= totalPages - 2) {
                            startPage = Math.max(2, totalPages - 3);
                          }

                          // Add ellipsis if needed before middle section
                          if (startPage > 2) {
                            pageNumbers.push('...');
                          }

                          // Add middle section
                          for (let i = startPage; i <= endPage; i++) {
                            pageNumbers.push(i);
                          }

                          // Add ellipsis if needed after middle section
                          if (endPage < totalPages - 1) {
                            pageNumbers.push('...');
                          }

                          // Always show last page
                          pageNumbers.push(totalPages);
                        }

                        return pageNumbers.map((pageNum, index) => {
                          if (pageNum === '...') {
                            return (
                              <span key={`ellipsis-${index}`} className="mx-1 flex items-center">
                                ...
                              </span>
                            );
                          }

                          return (
                            <button
                              key={`page-${pageNum}`}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-8 h-8 flex items-center justify-center rounded-full
                                ${pageNum === currentPage ? "text-white bg-blue-500" : "text-blue-500"}
                              `}
                            >
                              <span className="numbers">{pageNum}</span>
                            </button>
                          );
                        });
                      })()}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 cursor-pointer p-[1px] ml-1"
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

              {/* Add this CSS to your component or stylesheet */}
              <style jsx>{`
                .pagination-container {
                  min-height: 40px;
                }

                @media (max-width: 640px) {
                  .pagination-container button {
                    width: 32px !important;
                    height: 32px !important;
                  }
                }
              `}</style>
            </div>
          </div>{" "}
          {/* End of main dashboard container */}
        </div>
      </div>
    </div>
  );
};


export default AdminDashboard;
