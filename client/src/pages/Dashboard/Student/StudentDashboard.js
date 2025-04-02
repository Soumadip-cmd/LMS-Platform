import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  FileText,
  Activity,
  BarChart2,
  MessageSquare,
  Settings,
  Menu,
  X,
  DollarSign,
  Users as UsersIcon,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleString("en-US", {
    weekday: "long",
  })}, ${currentDate.toLocaleString("en-US", {
    month: "long",
  })} ${currentDate.getFullYear()}`;

  // Effect for custom breakpoint
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media (min-width: 1047px) {
        .custom-header-flex {
          flex-direction: row !important;
          align-items: center !important;
        }
        .custom-date-margin {
          margin-top: 0 !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Dummy data for courses
  const courses = [
    {
      id: 1,
      title: "German B2 Course",
      progress: 75,
      status: "Ongoing",
      color: "bg-yellow-400",
    },
    {
      id: 2,
      title: "German B2 Course",
      progress: 100,
      status: "Completed",
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "German B2 Course",
      progress: 40,
      status: "Ongoing",
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "German B2 Course",
      progress: 25,
      status: "Ongoing",
      color: "bg-yellow-400",
    },
    {
      id: 5,
      title: "German B2 Course",
      progress: 60,
      status: "Ongoing",
      color: "bg-purple-500",
    },
    {
      id: 6,
      title: "French A1 Course",
      progress: 15,
      status: "Ongoing",
      color: "bg-blue-500",
    },
    {
      id: 7,
      title: "Spanish B1 Course",
      progress: 50,
      status: "Ongoing",
      color: "bg-red-500",
    },
    {
      id: 8,
      title: "Italian A2 Course",
      progress: 80,
      status: "Ongoing",
      color: "bg-green-500",
    },
    {
      id: 9,
      title: "Portuguese Basics",
      progress: 30,
      status: "Ongoing",
      color: "bg-yellow-400",
    },
  ];

  // Filter courses based on active tab
  const filteredCourses =
    activeTab === "All"
      ? courses
      : courses.filter((course) => course.status === activeTab);

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Handle page navigation
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    // Changed to div with relative positioning instead of min-h-screen
    <div className="flex flex-col md:flex-row bg-gray-100 relative pb-32">
      {/* Sidebar - Modified to be absolute instead of fixed, with bottom padding to prevent footer overlap */}
      <div
        className="hidden md:block absolute h-auto top-0 bottom-0 bg-white shadow-md z-20"
        style={{ width: "16rem" }}
      >
        <div className="h-full overflow-y-auto p-4 flex flex-col">
          <nav className="mt-2 flex-grow items-center">
            <div className="space-y-2">
              <SidebarItem
                icon={
                  <div className="w-6 h-6 flex items-center justify-center text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </div>
                }
                text="Dashboard"
                active
                onClick={() => {}}
              />
              <SidebarItem
                icon={
                  <div className="w-6 h-6 flex items-center justify-center text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                }
                text="Courses"
                onClick={() => setSidebarOpen(false)}
              />
              <SidebarItem
                icon={
                  <div className="w-6 h-6 flex items-center justify-center text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                }
                text="Assignments"
                onClick={() => setSidebarOpen(false)}
              />
              <SidebarItem
                icon={
                  <div className="w-6 h-6 flex items-center justify-center text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                      <line x1="6" y1="6" x2="6.01" y2="6" />
                      <line x1="6" y1="18" x2="6.01" y2="18" />
                    </svg>
                  </div>
                }
                text="Mock Tests"
                onClick={() => setSidebarOpen(false)}
              />
              <SidebarItem
                icon={
                  <div className="w-6 h-6 flex items-center justify-center text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="20" x2="12" y2="10" />
                      <line x1="18" y1="20" x2="18" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="16" />
                    </svg>
                  </div>
                }
                text="Analytics"
                onClick={() => setSidebarOpen(false)}
              />
              <SidebarItem
                icon={
                  <div className="w-6 h-6 flex items-center justify-center text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                }
                text="Messages"
                onClick={() => setSidebarOpen(false)}
              />
              <SidebarItem
                icon={
                  <div className="w-6 h-6 flex items-center justify-center text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </div>
                }
                text="Settings"
                onClick={() => setSidebarOpen(false)}
              />
            </div>

            <div className="mt-6 mb-4">
              <button className="w-full bg-[#FFB71C] hover:bg-yellow-500 transition-colors text-white py-2 px-4 rounded-lg hover:text-[#0D47A1] text-sm font-medium duration-300">
                Become an Instructor
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content - adjusted with margin to compensate for absolute sidebar */}
      <div className="flex-1 md:ml-64 p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-[0_0px_10px_rgba(0,0,0,0.1)] p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div className="w-full ">
              <div className="flex flex-col items-start justify-between custom-header-flex space-y-4">
                <h1 className="text-2xl md:text-[2.4rem] lg:text-[2.8rem] font-medium text-blue-500">
                  Welcome Back, Sarah!
                </h1>
                <div className="mt-2 custom-date-margin">
                  <DateDisplay date="Tuesday, March 2025|" time="12:10 AM" />
                </div>
              </div>
              <p className="text-gray-600 text-base md:text-xl mt-4 mb-8">
                Track your learning progress, upcoming assignments, and course
                activities. Let's continue your language learning journey!
              </p>
            </div>
          </div>

          {/* Stats Cards */}

          <div className="grid grid-cols-1  md:grid-cols-2 2xl:grid-cols-4 gap-6 mt-6">
            <StatCard
              icon={<DollarSign size={32} color="#FFC107" />}
              title="Course Prgress"
              value="78%"
              trend={12}
              trendText="vs last month"
            />
            <StatCard
              icon={<UsersIcon size={32} color="#FFC107" />}
              title="Active Courses"
              value="3"
              trend={12}
              trendText="vs Yesterday"
              trendDown
            />
            <StatCard
              icon={<Award size={32} color="#FFC107" />}
              title="Achievements"
              value="12"
              trend={4}
              trendText="vs last month"
            />
            <StatCard
              icon={<Clock size={32} color="#FFC107" />}
              title="Study Time"
              value="24h"
              trend={12}
              trendText="vs Yesterday"
            />
          </div>
        </div>

        {/* My Courses Section with Pagination */}
        <div className="bg-white rounded-lg shadow-[0_0px_10px_rgba(0,0,0,0.1)] p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-bold mb-2">My Courses</h2>
            <div className="flex mt-2 md:mt-0 space-x-2">
              <TabButton
                text="All"
                active={activeTab === "All"}
                onClick={() => setActiveTab("All")}
              />
              <TabButton
                text="Ongoing"
                active={activeTab === "Ongoing"}
                onClick={() => setActiveTab("Ongoing")}
              />
              <TabButton
                text="Completed"
                active={activeTab === "Completed"}
                onClick={() => setActiveTab("Completed")}
              />
            </div>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                progress={course.progress}
                status={course.status}
                color={course.color}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-blue-500 hover:bg-blue-50"
                }`}
              >
                <ChevronLeft size={24} />
              </button>

              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-blue-500 hover:bg-blue-50"
                }`}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for sidebar items
const SidebarItem = ({ icon, text, active, onClick }) => (
  <div
    className={`flex items-center p-3 rounded-md cursor-pointer transition-all ${
      active
        ? "bg-blue-50 text-black font-semibold"
        : "text-gray-600 hover:bg-gray-50"
    }`}
    onClick={onClick}
  >
    <div className="mr-3">{icon}</div>
    <div className={active ? "font-medium" : ""}>{text}</div>
  </div>
);

// Date display component
const DateDisplay = ({ date, time }) => {
  const formattedDate = date.replace("|", " | ");

  return (
    <div
      className="flex items-center rounded-full px-4 py-1 text-sm"
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
  iconBg,
  title,
  value,
  trend,
  trendText,
  trendDown = false,
}) => {
  // Arrow component for trend direction
  const UpArrow = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-1"
    >
      <path
        d="M12 4L12 16"
        stroke="#22C55E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 9L12 4L17 9"
        stroke="#22C55E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 20H18"
        stroke="#22C55E"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  const DownArrow = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-1"
    >
      <path
        d="M12 20L12 8"
        stroke="#EF4444"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 15L12 20L17 15"
        stroke="#EF4444"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 4H18"
        stroke="#EF4444"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  // Render trend text based on direction
  const renderTrendText = () => {
    if (trendDown) {
      return (
        <div className="flex items-center text-red-500 text-xs">
          <DownArrow />
          <span className="font-medium ">
            <strong className="font-bold">{trend}%</strong>vs {trendText}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-green-500 text-xs">
          <UpArrow />
          <span className="font-medium">
            <strong className="font-bold">{trend}%</strong> vs {trendText}
          </span>
        </div>
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-[0_0px_10px_rgba(0,0,0,0.1)]">
      <div className="text-gray-400 mb-4 text-lg">{title}</div>
      <div className="flex">
        <div
          className={`bg-[#FFBE3338] w-20 h-20 rounded-full flex items-center justify-center`}
        >
          {icon}
        </div>
        <div className="ml-auto">
          <div className="text-4xl font-bold text-center mb-3">{value}</div>
          <div>{renderTrendText()}</div>
        </div>
      </div>
    </div>
  );
};

// Tab button component
const TabButton = ({ text, active, onClick }) => (
  <button
    className={`px-4 py-1 rounded-md text-sm font-medium ${
      active ? "bg-yellow-400 text-white" : "bg-gray-100 text-gray-600"
    }`}
    onClick={onClick}
  >
    {text}
  </button>
);

// Course card component
const CourseCard = ({ title, progress, status, color }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-[0_0px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_0px_15px_rgba(0,0,0,0.15)] cursor-pointer transform transition-all duration-300 hover:scale-105">
      <img
        src={`https://placehold.co/400x200?text=${title.replace(/\s+/g, "+")}`}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold mb-2">{title}</h3>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full ${color}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600">{status}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;
