import React, { useState, useEffect,useContext } from "react";
import {

  DollarSign,
  Users as UsersIcon,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import StudentSidebar from "./StudentSidebar";
import authContext from "../../../context/auth/authContext";
import courseContext from "../../../context/course/courseContext";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("All");
  
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
 const AuthContext = useContext(authContext);
 const CourseContextData = useContext(courseContext);
 const { user, isAuthenticated } = AuthContext;

 const { 
  dashboardStats, 
  coursesProgress, 
  loading, 
  getDashboardStats, 
  getCoursesProgress 
} = CourseContextData;
 useEffect(() => {
  if (getDashboardStats && getCoursesProgress) {
    getDashboardStats();
    getCoursesProgress(activeTab);
  }
}, [activeTab, getDashboardStats, getCoursesProgress]);
 
 


  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = loading || !coursesProgress ? [] : coursesProgress
  .filter(course => activeTab === "All" ? true : 
          activeTab === "Completed" ? course.completed : !course.completed)
  .slice(indexOfFirstCourse, indexOfLastCourse)
  .map(course => ({
    id: course.courseId,
    title: course.title,
    progress: course.progress || 0,
    status: course.completed ? "Completed" : "Ongoing",
    color: course.completed ? "bg-green-500" : 
           course.progress > 70 ? "bg-green-500" :
           course.progress > 40 ? "bg-yellow-400" :
           course.progress > 20 ? "bg-purple-500" : "bg-blue-500",
    thumbnailUrl: course.thumbnailUrl
  }));
  const totalPages = Math.ceil((coursesProgress?.length || 0) / coursesPerPage);

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
    <div className="flex flex-col md:flex-row bg-gray-100 relative pb-3">
      {/* Sidebar - Modified to be absolute instead of fixed, with bottom padding to prevent footer overlap */}
      <StudentSidebar/>

      {/* Main Content - adjusted with margin to compensate for absolute sidebar */}
      <div className="flex-1 md:ml-64 p-2 sm:p-4">
        <div className=" rounded-lg pt-8 md:pt-6 px-2 md:px-0 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div className="w-full ">
              <div className="flex flex-col items-start justify-between custom-header-flex space-y-4">
                <h1 className="text-2xl md:text-[2.4rem] lg:text-4xl font-semibold text-[#1976D2]">
                  Welcome Back, {user ? user.name.split(' ')[0] : ''}!
                </h1>
                <div className="mt-2 custom-date-margin">
                <DateDisplay 
    date={`${new Date().toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}|`} 
    time={new Date().toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
  />
                </div>
              </div>
              <p className="text-gray-600 text-base md:text-lg mt-4 mb-8">
                Track your learning progress, upcoming assignments, and course
                activities. Let's continue your language learning journey!
              </p>
            </div>
          </div>

          {/* Stats Cards */}

          <div className="grid grid-cols-1  md:grid-cols-2 2xl:grid-cols-4 gap-6 mt-6">
           
<StatCard
  icon={<DollarSign size={32} color="#FFC107" />}
  title="Course Progress"
  value={`${dashboardStats?.overallProgress || 0}%`}
  trend={12}
  trendText="vs last month"
/>
<StatCard
  icon={<UsersIcon size={32} color="#FFC107" />}
  title="Active Courses"
  value={dashboardStats?.activeCourses || 0}
  trend={12}
  trendText="vs Yesterday"
  trendDown
/>


<StatCard
  icon={<Award size={32} color="#FFC107" />}
  title="Achievements"
  value={dashboardStats?.achievements || 0}
  trend={4}
  trendText="vs last month"
/>
<StatCard
  icon={<Clock size={32} color="#FFC107" />}
  title="Study Time"
  value={`${dashboardStats?.studyTime || 0}h`}
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
    thumbnailUrl={course.thumbnailUrl}
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
const CourseCard = ({ title, progress, status, color,thumbnailUrl }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-[0_0px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_0px_15px_rgba(0,0,0,0.15)] cursor-pointer transform transition-all duration-300 hover:scale-105">
    <img
  src={thumbnailUrl || `https://placehold.co/400x200?text=${title.replace(/\s+/g, "+")}`}
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
