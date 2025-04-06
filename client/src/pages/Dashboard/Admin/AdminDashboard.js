import React, { useState } from "react";
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
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
  // No sidebar state needed

  // Pagination state
  const [currentPage, setCurrentPage] = useState(2);
  const coursesPerPage = 10;
  const totalCourses = 97;
  const totalPages = Math.ceil(totalCourses / coursesPerPage);

  // Course data
  const courses = [
    {
      id: 1,
      title: "Advanced German",
      enrolled: "1234 enrolled",
      revenue: "43$",
    },
    {
      id: 2,
      title: "Business English",
      enrolled: "1234 enrolled",
      revenue: "56$",
    },
    {
      id: 3,
      title: "French C1 Advanced",
      enrolled: "1234 enrolled",
      revenue: "23$",
    },
  ];

  // Date display component
  const DateDisplay = ({ date, time }) => {
    const formattedDate = date.replace("|", " | ");

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
        <span className="text-blue-500 pl-1">{time}</span>
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

      {/* Main Content */}
      <div className="flex-1 w-full md:ml-0">
        <div className="max-w-7xl mx-auto p-2 sm:p-4">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-[0_0px_10px_rgba(0,0,0,0.1)] p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <div className="w-full">
                <div className="flex flex-col xl:flex-row xl:justify-between">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#1976D2]">
                    Welcome Back, Prof. Deepak!
                  </h1>
                  <div className="mt-4 xl:mt-0">
                    <DateDisplay date="Tuesday, March 2025|" time="12:10 AM" />
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
                value="$23,423"
                trend={12}
                trendText="last month"
              />
              <StatCard
                icon={
                  <Users size={24} className="sm:size-32" color="#FFC107" />
                }
                title="Daily Order"
                value="12334"
                trend={12}
                trendText="Yesterday"
                trendDown={true}
              />
              <StatCard
                icon={
                  <Award size={24} className="sm:size-32" color="#FFC107" />
                }
                title="Course Completion"
                value="89.3%"
                trend={4}
                trendText="last month"
              />
              <StatCard
                icon={
                  <Users size={24} className="sm:size-32" color="#FFC107" />
                }
                title="Active Students"
                value="1123"
                trend={12}
                trendText="Yesterday"
              />
            </div>

            {/* Second row of Stats Cards */}
            <div className="grid grid-cols-1  md:grid-cols-2 2xl:grid-cols-4 gap-3 sm:gap-6 mt-6">
              <StatCard
                icon={
                  <BookOpen size={24} className="sm:size-32" color="#FFC107" />
                }
                title="Active Course"
                value="223"
                trend={12}
                trendText="last month"
              />
              <StatCard
                icon={
                  <Users size={24} className="sm:size-32" color="#FFC107" />
                }
                title="Active Instructors"
                value="12334"
                trend={12}
                trendText="Yesterday"
              />
              <StatCard
                icon={
                  <BookOpen size={24} className="sm:size-32" color="#FFC107" />
                }
                title="Average Session"
                value="20 min"
                trend={4}
                trendText="last month"
                trendDown={true}
              />
              <StatCard
                icon={
                  <Users size={24} className="sm:size-32" color="#FFC107" />
                }
                title="Active Students"
                value="1123"
                trend={12}
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
                          <span className="numbers">143</span>
                        </div>
                        <div className="text-sm sm:text-base text-gray-500 text-center mt-1 px-2 sm:px-4 py-2 pb-3 sm:pb-5">
                          Total Student
                        </div>
                      </div>
                      <div className="col-span-1 bg-white rounded-md px-2 pt-4 sm:pt-6 flex flex-col justify-between">
                        <div className="text-2xl sm:text-4xl font-bold text-center">
                          <span className="numbers">123</span>
                        </div>
                        <div className="text-sm sm:text-base text-gray-500 text-center mt-1 px-2 sm:px-4 py-2">
                          Active Student per Day
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 px-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm sm:text-md text-gray-600">
                          Average Rating
                        </div>
                        <div className="text-amber-500 font-bold text-lg sm:text-xl">
                          <span className="numbers">4.7</span>
                          <span className="text-gray-500 text-xs sm:text-sm">
                            /<span className="numbers">5.0</span>
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-white rounded-full h-2">
                        <div
                          className="bg-amber-400 h-2 rounded-full"
                          style={{ width: "85%" }}
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
                          <span className="numbers">143</span>
                        </div>
                        <div className="text-sm sm:text-base text-gray-500 text-center mt-1 px-2 sm:px-4 py-2 pb-3 sm:pb-5">
                          Total Courses
                        </div>
                      </div>
                      <div className="col-span-1 bg-white rounded-md px-2 pt-4 sm:pt-6 flex flex-col justify-between">
                        <div className="text-2xl sm:text-4xl font-bold text-center">
                          <span className="numbers">13</span>
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
                          <span className="numbers">4.7</span>
                          <span className="text-gray-500 text-xs sm:text-sm">
                            /<span className="numbers">5.0</span>
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-white rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "85%" }}
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
                        <span className="numbers">143</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-sm p-2 px-4 sm:px-8">
                      <span className="text-sm sm:text-md text-gray-600">
                        Total Tickets
                      </span>
                      <span className="text-2xl sm:text-4xl font-bold text-green-500">
                        <span className="numbers">44</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-sm p-2 px-4 sm:px-8">
                      <span className="text-sm sm:text-md text-gray-600">
                        Total Tickets
                      </span>
                      <span className="text-2xl sm:text-4xl font-bold text-red-500">
                        <span className="numbers">32</span>
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
                        <span className="numbers">143</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-sm p-2 px-4 sm:px-8">
                      <span className="text-sm sm:text-md text-gray-600">
                        Total Tickets
                      </span>
                      <span className="text-2xl sm:text-4xl font-bold text-green-500">
                        <span className="numbers">44</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-sm p-2 px-4 sm:px-8">
                      <span className="text-sm sm:text-md text-gray-600">
                        Total Tickets
                      </span>
                      <span className="text-2xl sm:text-4xl font-bold text-red-500">
                        <span className="numbers">32</span>
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
                <button className="px-2 py-1 border border-[#FFBE33] text-gray-500 rounded-md text-sm sm:text-base font-medium hover:bg-yellow-600 hover:bg-opacity-15 flex items-center">
                  View All <ChevronRight size={12} className="ml-1" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id} className="border-b">
                        <td className="py-3">
                          <div className="font-normal text-sm sm:text-base">
                            {course.title}
                          </div>
                          <div className="text-sm sm:text-base text-gray-500">
                            <span className="numbers">1234</span> enrolled
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

                    {/* Fixed set of page buttons */}
                    <div className="inline-flex space-x-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full 
              ${
                pageNum === currentPage
                  ? "text-white bg-blue-500"
                  : "text-blue-500"
              }
              ${pageNum > 5 ? "hidden sm:flex" : "flex"}`}
                        >
                          <span className="numbers">{pageNum}</span>
                        </button>
                      ))}
                    </div>

                    {/* Ellipsis - always visible on non-mobile */}
                    <span className="mx-1 hidden sm:inline">...</span>

                    {/* Last two pages - always visible on non-mobile */}
                    <div className="hidden sm:inline-flex space-x-1">
                      <button
                        onClick={() => handlePageChange(totalPages - 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full 
            ${
              currentPage === totalPages - 1
                ? "text-white bg-blue-500"
                : "text-blue-500"
            }`}
                      >
                        <span className="numbers">{totalPages - 1}</span>
                      </button>

                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full 
            ${
              currentPage === totalPages
                ? "text-white bg-blue-500"
                : "text-blue-500"
            }`}
                      >
                        <span className="numbers">{totalPages}</span>
                      </button>
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
