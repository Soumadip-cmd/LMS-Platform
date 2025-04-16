import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Newspaper,
  BookOpen,
  Rocket,
  FileText,
  HelpCircle,
  Bell,
  Map,
  ClipboardList,
  Users,
  MessageSquare,
  HelpCircle as AskIcon,
  Star,
  Calendar,
  UserPlus,
  Menu,
  X,
} from "lucide-react";

const ResourcesSidebar = () => {
  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get current location to determine active route
  const location = useLocation();
  const currentPath = location.pathname;

  // Handle sidebar open/close effects
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        sidebarOpen &&
        e.target.closest(".mobile-sidebar-container") === null &&
        e.target.closest(".hamburger-button") === null
      ) {
        setSidebarOpen(false);
      }
    };

    // Close sidebar when route changes
    const handleRouteChange = () => {
      setSidebarOpen(false);
    };

    // Prevent background scrolling when sidebar is open
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    document.addEventListener("click", handleOutsideClick);

    // Clean up
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.body.style.overflow = ""; // Reset on unmount
    };
  }, [sidebarOpen, location]);

  // Sidebar sections configuration
  const sections = [
    {
      title: null,
      items: [
        { icon: <Home size={18} />, text: "Home", path: "/resources/home" },
        {
          icon: <Newspaper size={18} />,
          text: "Feed",
          path: "/resources/feed",
        },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          icon: <Rocket size={18} />,
          text: "Get Started",
          path: "/resources/get-started",
        },
        { icon: <FileText size={18} />, text: "Blog", path: "/resources/blog" },
        {
          icon: <HelpCircle size={18} />,
          text: "Help Center",
          path: "/resources/help",
        },
        {
          icon: <Bell size={18} />,
          text: "Product Updates",
          path: "/resources/updates",
        },
        {
          icon: <Map size={18} />,
          text: "Roadmap",
          path: "/resources/roadmap",
        },
        {
          icon: <ClipboardList size={18} />,
          text: "Changelog",
          path: "/resources/changelog",
        },
      ],
    },
    {
      title: "Community",
      items: [
        {
          icon: <UserPlus size={18} />,
          text: "Introduce yourself",
          path: "/resources/introduce",
        },
        {
          icon: <MessageSquare size={18} />,
          text: "Discussions",
          path: "/resources/discussions",
        },
        {
          icon: <AskIcon size={18} />,
          text: "Ask the Community",
          path: "/resources/ask",
        },
        {
          icon: <Star size={18} />,
          text: "Wishlist",
          path: "/resources/wishlist",
        },
        {
          icon: <Calendar size={18} />,
          text: "Events",
          path: "/resources/events",
        },
        {
          icon: <Users size={18} />,
          text: "Groups",
          path: "/resources/groups",
        },
      ],
    },
  ];

  // Sidebar Item Component
  const SidebarItem = ({ icon, text, path }) => {
    // Check if this item is active based on current path
    const isActive = currentPath === path;

    return (
      <Link to={path} className="block">
        <div
          className={`flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
            isActive
              ? "bg-blue-50 text-black font-medium"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span className={isActive ? "text-blue-500" : "text-gray-500"}>
            {icon}
          </span>
          <span>{text}</span>
        </div>
      </Link>
    );
  };

  // Sidebar Section Component
  const SidebarSection = ({ title, items }) => (
    <div className="mb-4">
      {title && (
        <h3 className="text-sm font-medium text-blue-600 px-4 mb-1">{title}</h3>
      )}
      <div className="space-y-2">
        {items.map((item) => (
          <SidebarItem
            key={item.text}
            icon={item.icon}
            text={item.text}
            path={item.path}
          />
        ))}
      </div>
    </div>
  );

  // Sidebar content - used for both desktop and mobile
  const SidebarContent = () => (
    <div className="h-full p-3 flex flex-col">
      <div className="flex-grow">
        {sections.map((section, index) => (
          <SidebarSection
            key={section.title || `section-${index}`}
            title={section.title}
            items={section.items}
          />
        ))}
      </div>
    </div>
  );

  // Blue banner component
  const BlueBanner = () => (
    <div className="bg-blue-900 md:hidden text-white p-2 text-center text-sm w-full">
      Keep learning with free resources! Experience{" "}
      <span className="font-bold">Preplings</span>.
      <Link to="/" className="ml-2 text-yellow-400 hover:underline">
        Learn more
      </Link>
    </div>
  );

  // Header component with logo and hamburger button
  const Header = () => (
    <div className="w-full bg-white border-b border-gray-200 flex justify-between items-center px-4 py-2">
      {/* Logo */}
      <div className="flex md:hidden items-center">
        <img
          src={`${process.env.PUBLIC_URL}/assets/logo/logo.png`}
          alt="logo.png"
          className="h-12"
        />
      </div>

      {/* Hamburger for mobile only */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hamburger-button md:hidden"
      >
        <Menu size={24} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Fixed mobile header container */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white">
        {/* Banner at the top */}
        <BlueBanner />

        {/* Header with logo and hamburger */}
        <Header />
      </div>

      {/* Add padding to account for fixed header on mobile */}
      <div className="md:hidden h-28"></div> {/* Adjust height based on your header + banner height */}

      <div className="flex  flex-1">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden md:block w-60  bg-white border-gray-200 h-full overflow-y-auto z-10 shadow-lg">
          <SidebarContent />
        </div>

        {/* Main content area */}
        <div className="flex-1">{/* Your main content goes here */}</div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar from right side */}
      <div
        className={`mobile-sidebar-container fixed top-0 right-0 w-64 h-full bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        {/* Sidebar header with logo and close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={`${process.env.PUBLIC_URL}/assets/logo/logo.png`}
                alt="logo.png"
                className="h-12"
              />
            </Link>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        {/* Search box */}
        <div className="px-4 mt-3 mb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-100 rounded-md py-2 px-4 pr-10 w-full focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-100"
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
        <div className="pt-2">
          <SidebarContent />
        </div>
      </div>
    </div>
  );
};

export default ResourcesSidebar;