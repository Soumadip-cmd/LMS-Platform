import React from "react";
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
  UserPlus
} from "lucide-react";

const ResourcesSidebar = () => {
  // Get current location to determine active route
  const location = useLocation();
  const currentPath = location.pathname;

  // Sidebar sections configuration
  const sections = [
    {
      title: null,
      items: [
        { icon: <Home size={18} />, text: "Home", path: "/resources/home" },
        { icon: <Newspaper size={18} />, text: "Feed", path: "/resources/feed" },
      ]
    },
    {
      title: "Resources",
      items: [
        { icon: <Rocket size={18} />, text: "Get Started", path: "/resources/get-started" },
        { icon: <FileText size={18} />, text: "Blog", path: "/resources/blog" },
        { icon: <HelpCircle size={18} />, text: "Help Center", path: "/resources/help" },
        { icon: <Bell size={18} />, text: "Product Updates", path: "/resources/updates" },
        { icon: <Map size={18} />, text: "Roadmap", path: "/resources/roadmap" },
        { icon: <ClipboardList size={18} />, text: "Changelog", path: "/resources/changelog" },
      ]
    },
    {
      title: "Community",
      items: [
        { icon: <UserPlus size={18} />, text: "Introduce yourself", path: "/resources/introduce" },
        { icon: <MessageSquare size={18} />, text: "Discussions", path: "/resources/discussions" },
        { icon: <AskIcon size={18} />, text: "Ask the Community", path: "/resources/ask" },
        { icon: <Star size={18} />, text: "Wishlist", path: "/resources/wishlist" },
        { icon: <Calendar size={18} />, text: "Events", path: "/resources/events" },
        { icon: <Users size={18} />, text: "Groups", path: "/resources/groups" },
      ]
    }
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
          <span className={isActive ? "text-blue-500" : "text-gray-500"}>{icon}</span>
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

  return (
    <div className="w-60 bg-white border-r border-gray-200 h-screen">
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
    </div>
  );
};

export default ResourcesSidebar;