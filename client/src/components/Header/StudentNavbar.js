import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  BarChart,
  BookOpen,
  FileText,
  Activity,
  MessageSquare,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";

const StudentNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [screenHeightType, setScreenHeightType] = useState('normal');
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Screen height detection
  useEffect(() => {
    const checkScreenHeight = () => {
      const height = window.innerHeight;
      if (height > 740) {
        setScreenHeightType('large');
      } else if (height > 642) {
        setScreenHeightType('medium');
      } else {
        setScreenHeightType('small');
      }
    };
    
    checkScreenHeight();
    window.addEventListener('resize', checkScreenHeight);
    
    return () => {
      window.removeEventListener('resize', checkScreenHeight);
    };
  }, []);

  // Close dropdown and sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".mobile-profile-trigger")
      ) {
        setIsSidebarOpen(false);
      }
    }

    // Toggle body scroll when sidebar opens/closes
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Reset overflow when component unmounts
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  // Sign out positioning logic - Only fixed for medium height screens (between 642px and 740px)
  const signOutClass = screenHeightType === 'medium' 
    ? 'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-1'
    : 'border-t border-gray-200 py-4';
  
  // Only show bottom spacing when sign out is fixed
  const showBottomSpace = screenHeightType === 'medium';

  return (
    <>
      {/* Fixed wrapper for navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Blue banner */}
        <div className="w-full bg-blue-900 text-white py-2 px-4 text-center">
          <p className="text-sm">
            Keep learning with free resources! Experience{" "}
            <span className="font-bold">Preplings</span>.
            <a href="#" className="ml-2 text-yellow-300 hover:underline">
              Learn more
            </a>
          </p>
        </div>

        {/* Main navbar */}
        <div className="w-full bg-white shadow-sm">
          <div className="w-full bg-white shadow px-4 lg:px-6 xl:px-12 py-3">
            <div className="flex items-center justify-between">
              {/* Logo and search section */}
              <div className="flex items-center space-x-4 flex-1">
                {/* Logo */}
                <Link to="/" className="flex items-center lg:mr-6 xl:mr-7">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/logo/logo.png`}
                    alt="logo.png"
                    className="h-12"
                  />
                </Link>

                {/* Search Bar - Desktop only */}
                <div className="relative mx-4 hidden md:block">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-gray-100 rounded-md py-2 px-4 pr-10 w-72 lg:w-96 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-100"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 cursor-pointer transition-colors duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right Icons */}
              <div className="flex items-center justify-center space-x-4">
                {/* Desktop Icons Only */}
                <div className="hidden md:flex items-center space-x-4">
                  {/* Message Icon */}
                  <div className="relative cursor-pointer">
                    <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 rounded-full cursor-pointer">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/Navbar_icons/Chaticon.png`}
                        alt="Chat"
                        className="w-5 h-5"
                      />
                    </div>
                    {hasNewMessage && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-orange-500 rounded-full border border-white"></span>
                    )}
                  </div>

                  {/* Bell Icon */}
                  <div className="relative flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full cursor-pointer">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/Navbar_icons/Notificationicon.png`}
                      alt="Notification"
                      className="w-5 h-5"
                    />
                    {hasNewNotification && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-blue-800 rounded-full border border-white"></span>
                    )}
                  </div>
                </div>

                {/* Desktop User Profile Dropdown */}
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={toggleProfile}
                    className="flex items-center focus:outline-none cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src="https://placehold.co/40x40"
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="ml-2 font-medium text-gray-800">
                      Sarah U.
                    </span>
                    <ChevronDown size={16} className="ml-1 text-gray-600" />
                  </button>

                  {/* Desktop Dropdown Menu with Animation */}
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-md ring-1 ring-black ring-opacity-5 py-1 transition-all duration-200 ease-in-out origin-top-right z-10 
                      ${
                        isProfileOpen
                          ? "transform scale-100 opacity-100"
                          : "transform scale-95 opacity-0 pointer-events-none"
                      }`}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        Sarah Uddin
                      </p>
                      <p className="text-xs text-gray-500">
                        sarah.uddin@example.com
                      </p>
                    </div>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </a>
                  </div>
                </div>

                {/* Mobile Profile Icon (Triggers Sidebar) */}
                <div className="md:hidden mobile-profile-trigger">
                  <button
                    onClick={toggleSidebar}
                    className="focus:outline-none cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src="https://placehold.co/40x40"
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add padding to content below fixed navbar */}
      <div className="pt-24 mb-8 md:mb-0">
        {/* Your page content goes here */}
      </div>

      {/* Mobile-only Right Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100 overflow-hidden" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Mobile-only Right Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="py-4 pl-4 pr-2 md:p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src="https://placehold.co/40x40"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-800">Sarah Uddin</p>
              <p className="text-xs text-gray-500">sarah.uddin@example.com</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-full text-black transition-colors duration-200 hover:bg-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Special Chat & Notification Section in Sidebar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-around">
            {/* Chat Icon in Sidebar */}
            <div className="flex flex-col items-center cursor-pointer">
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-full cursor-pointer">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/Navbar_icons/Chaticon.png`}
                    alt="Chat"
                    className="w-6 h-6"
                  />
                  {hasNewMessage && (
                    <span className="absolute top-[1px] right-[1px] md:-top-1 md:-right-1 w-3 h-3 bg-orange-500 rounded-full border border-white"></span>
                  )}
                </div>
              </div>
              <span className="mt-1 text-sm font-medium text-gray-700">
                Messages
              </span>
            </div>

            {/* Notification Icon in Sidebar */}
            <div className="flex flex-col items-center cursor-pointer">
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full cursor-pointer">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/Navbar_icons/Notificationicon.png`}
                    alt="Notification"
                    className="w-6 h-6"
                  />
                  {hasNewNotification && (
                    <span className="absolute top-[1px] right-[1px] md:-top-1 md:-right-1 w-3 h-3 bg-blue-800 rounded-full border border-white"></span>
                  )}
                </div>
              </div>
              <span className="mt-1 text-sm font-medium text-gray-700">
                Notifications
              </span>
            </div>
          </div>
        </div>

        {/* Regular Sidebar Menu */}
        <div className="py-4">
          {/* Dashboard */}
          <a
            href="#"
            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 flex items-center"
          >
            <div className="flex items-center justify-center w-5 h-5 text-blue-600 mr-3">
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
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <span className="font-medium">Dashboard</span>
          </a>
          
          {/* Courses */}
          <a
            href="#"
            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 flex items-center"
          >
            <BookOpen size={20} className="text-blue-600 mr-3" />
            <span>Courses</span>
          </a>
          
          {/* Assignments */}
          <a
            href="#"
            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 flex items-center"
          >
            <FileText size={20} className="text-blue-600 mr-3" />
            <span>Assignments</span>
          </a>
          
          {/* Mock Tests */}
          <a
            href="#"
            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 flex items-center"
          >
            <div className="flex items-center justify-center w-5 h-5 text-blue-600 mr-3">
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
              >
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" />
                <line x1="6" y1="18" x2="6.01" y2="18" />
              </svg>
            </div>
            <span>Mock Tests</span>
          </a>
          
          {/* Analytics */}
          <a
            href="#"
            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 flex items-center"
          >
            <BarChart size={20} className="text-blue-600 mr-3" />
            <span>Analytics</span>
          </a>
          
          {/* Messages */}
          <a
            href="#"
            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 flex items-center"
          >
            <MessageSquare size={20} className="text-blue-600 mr-3" />
            <span>Messages</span>
          </a>
          
          {/* Settings */}
          <a
            href="#"
            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 flex items-center"
          >
            <Settings size={20} className="text-blue-600 mr-3" />
            <span>Settings</span>
          </a>
          
          {/* Become an Instructor */}
          <div className="px-4 mt-6 mb-6">
            <button className="w-full bg-[#FFB71C] hover:bg-yellow-500 transition-colors text-white py-3 px-4 rounded-lg hover:text-[#0D47A1] text-sm font-medium duration-300">
              Become an Instructor
            </button>
          </div>
        </div>
        
        {/* Sign Out - With conditional positioning */}
        <div className={signOutClass}>
          <a
            href="#"
            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 flex items-center"
          >
            <LogOut size={20} className="text-red-500 mr-3" />
            <span>Sign out</span>
          </a>
        </div>
        
        {/* Space at bottom for medium screens to prevent content hiding behind fixed sign out */}
        {showBottomSpace && <div className="h-16"></div>}
      </div>
    </>
  );
};

export default StudentNavbar;