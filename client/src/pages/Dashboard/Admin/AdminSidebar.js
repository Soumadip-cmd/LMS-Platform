import React from "react";
import {
  BarChart2,
  Settings,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminSidebar = ({ active = "Dashboard" }) => {
  // Sidebar Item Component
  const SidebarItem = ({ icon, text, path }) => (
    <Link to={path} className="block">
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
          active === text ? "bg-blue-50 text-black" : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <span className={active === text ? "text-blue-500" : "text-gray-500"}>{icon}</span>
        <span className={active === text ? "font-medium" : ""}>{text}</span>
      </div>
    </Link>
  );

  return (
    <>
      <div className="hidden md:block w-64 bg-white shadow-md z-10">
        <div className="h-full p-4 flex flex-col">
          <nav className="mt-16 space-y-5 flex-grow">
            <SidebarItem
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide-layout-dashboard"
                >
                  <rect width="7" height="9" x="3" y="3" rx="1" />
                  <rect width="7" height="5" x="14" y="3" rx="1" />
                  <rect width="7" height="9" x="14" y="12" rx="1" />
                  <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
              }
              text="Dashboard"
              path="/dashboard/admin"
            />
            <SidebarItem icon={<BookOpen size={20} />} text="Courses" path="/dashboard/admin/courses" />
            <SidebarItem icon={<Users size={20} />} text="Students" path="/dashboard/admin/students" />
            <SidebarItem icon={<Users size={20} />} text="Instructors" path="/dashboard/admin/instructors" />
            <SidebarItem icon={<FileText size={20} />} text="Assignments" path="/dashboard/admin/assignments" />
            <SidebarItem
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
              }
              text="Mock Tests"
              path="/dashboard/admin/mock-tests"
            />
            <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" path="/dashboard/admin/analytics" />
            <SidebarItem icon={<MessageSquare size={20} />} text="Messages" path="/dashboard/admin/messages" />
            <SidebarItem icon={<Settings size={20} />} text="Settings" path="/dashboard/admin/settings" />
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;