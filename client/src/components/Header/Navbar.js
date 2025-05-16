import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Globe, Image, BarChart, Users, LogOut, User } from "lucide-react";
import AuthContext from "../../context/auth/authContext";

const Navbar = () => {
  // Get auth context
  const authCtx = useContext(AuthContext);
  const { isAuthenticated, user, logout, loading } = authCtx;

  // Debug auth state
  useEffect(() => {
    console.log('Navbar - Auth State:', { isAuthenticated, user, loading });

    // Check for token in localStorage as a backup
    const token = localStorage.getItem('authToken');
    console.log('Navbar - Token in localStorage:', !!token);
  }, [isAuthenticated, user, loading]);
  // State to track if mobile menu is open
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Track which dropdown is open in the mobile menu
  const [openDropdown, setOpenDropdown] = useState(null);
  // Track hover state for desktop dropdowns
  const [hoverDropdown, setHoverDropdown] = useState(null);
  // Track secondary dropdown (for the nested exam dropdowns)
  const [secondaryDropdown, setSecondaryDropdown] = useState(null); // Don't show German exams by default
  // Use navigate for programmatic navigation if needed
  const navigate = useNavigate();

  // Clean up effect to ensure scroll is re-enabled when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // We're now handling click outside in the toggle function directly
  // This effect is kept for compatibility but doesn't do anything
  useEffect(() => {
    // No-op
  }, [secondaryDropdown]);

  // Toggle mobile menu and handle body scroll
  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    // Toggle body scroll lock
    if (newState) {
      // Lock scrolling on body when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Enable scrolling when menu is closed
      document.body.style.overflow = 'auto';
      // Close any open dropdown when closing the menu
      setOpenDropdown(null);
      setSecondaryDropdown(null);
    }
  };

  // Toggle dropdown in mobile menu
  const toggleDropdown = (item) => {
    if (openDropdown === item) {
      setOpenDropdown(null);
      setSecondaryDropdown(null);
    } else {
      setOpenDropdown(item);
      setSecondaryDropdown(null);
    }
  };

  // Toggle secondary dropdown in mobile menu (for exam types)
  const toggleSecondaryDropdown = (item, e) => {
    e.stopPropagation();
    if (secondaryDropdown === item) {
      setSecondaryDropdown(null);
    } else {
      setSecondaryDropdown(item);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      // Clear any stored tokens
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Toggle secondary dropdown for desktop view - CLICK-ONLY APPROACH
  const toggleDesktopSecondaryDropdown = (item, e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Toggling secondary dropdown:", item);

    // Store the clicked element for dropdown positioning
    const clickedElement = e.currentTarget;

    // Toggle the secondary dropdown
    if (secondaryDropdown === item) {
      // If it's already open, close it
      setSecondaryDropdown(null);
    } else {
      // If it's closed, open it

      // First, close any other open dropdown
      setSecondaryDropdown(null);

      // Then open the new dropdown after a brief delay
      setTimeout(() => {
        // Set the dropdown to be visible
        setSecondaryDropdown(item);

        // Position the dropdown after it's been rendered
        setTimeout(() => {
          const dropdown = document.getElementById(`secondary-dropdown-${item}`);
          if (dropdown) {
            // Get the position of the clicked element for more accurate positioning
            const rect = clickedElement.getBoundingClientRect();

            // Position the dropdown to the right of the clicked element
            dropdown.style.position = 'fixed';
            dropdown.style.top = `${rect.top}px`;
            dropdown.style.left = `${rect.right + 5}px`; // Small offset from the right edge
            dropdown.style.zIndex = '9999';

            // Make sure it's visible
            dropdown.style.display = 'block';
            dropdown.style.opacity = '1';

            // Add a click event listener to the document to close the dropdown when clicking outside
            const closeDropdown = (event) => {
              if (!dropdown.contains(event.target) && !clickedElement.contains(event.target)) {
                setSecondaryDropdown(null);
                document.removeEventListener('click', closeDropdown);
              }
            };

            // Add the event listener after a short delay to prevent it from triggering immediately
            setTimeout(() => {
              document.addEventListener('click', closeDropdown);
            }, 100);
          }
        }, 50);
      }, 10);
    }
  };

  // Menu data structure with nested exams
  const menuItems = [
    {
      name: "Courses",
      hasDropdown: true,
      path: "/courses",
      subItems: [
        { name: "German", icon: "DE", available: true },
        { name: "English", icon: "GB", available: false },
        { name: "French", icon: "FR", available: false },
        { name: "Chinese", icon: "CN", available: false },
        { name: "Spanish", icon: "ES", available: false },
      ]
    },
    {
      name: "Exams",
      hasDropdown: true,
      path: "/exams",
      subItems: [
        {
          name: "German",
          icon: "DE",
          available: true,
          hasChildren: true,
          children: [
            { name: "Goethe", available: true },
            { name: "TELC", available: true },
            { name: "TestDaF", available: false },
            { name: "DSH", available: false },
          ]
        },
        {
          name: "English",
          icon: "GB",
          available: false,
          hasChildren: true,
          children: [
            { name: "Cambridge", available: false },
            { name: "IELTS", available: false },
            { name: "TOEFL", available: false },
          ]
        },
        {
          name: "French",
          icon: "FR",
          available: false,
          hasChildren: true,
          children: [
            { name: "DELF", available: false },
            { name: "DALF", available: false },
            { name: "TCF", available: false },
          ]
        },
        {
          name: "Chinese",
          icon: "CN",
          available: false,
          hasChildren: true,
          children: [
            { name: "HSK", available: false },
            { name: "BCT", available: false },
          ]
        },
        {
          name: "Spanish",
          icon: "ES",
          available: false,
          hasChildren: true,
          children: [
            { name: "DELE", available: false },
            { name: "SIELE", available: false },
          ]
        },
      ]
    },
    {
      name: "Pricing",
      hasDropdown: false,
      path: "/pricing"
    },
    {
      name: "Support",
      hasDropdown: true,
      path: "/support/contact-us",
      subItems: [
        { name: "Contact Us", icon: "image" , path:"/support/contact-us"},
        { name: "Resources", icon: "bar-chart" , path:"/support/resources/home"},
        { name: "Community", icon: "users", path:"/support/community/introduce" },
      ]
    },
  ];

  // Handle direct navigation from dropdown items
  const handleDropdownItemNavigation = (e, path) => {
    e.preventDefault(); // Prevent default Link behavior

    // First close all dropdowns and the mobile menu
    setHoverDropdown(null);
    setOpenDropdown(null);
    setSecondaryDropdown(null);
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'auto';

    // Log the path for debugging
    console.log("Navigating to:", path);

    // Then navigate programmatically
    setTimeout(() => {
      navigate(path);
    }, 10); // Small delay to ensure dropdowns close first
  };

  return (
    <>
      {/* Fixed wrapper for the entire navbar including banner */}
      <div className="fixed top-0 left-0 right-0 z-[80] w-full">
        {/* Top banner - Moved outside of nav to span full width */}
        <div className="bg-blue-900 text-white p-2 text-center text-sm w-full">
          Keep learning with free resources! Experience{" "}
          <span className="font-bold">Preplings</span>.
          <a href="/resources" className="ml-2 text-yellow-400 hover:underline">
            Learn more
          </a>
        </div>

        {/* Main navbar */}
        <nav className="bg-white shadow px-4 lg:px-6 xl:px-14 py-3 flex flex-wrap items-center justify-between relative z-10">
          <div className="flex items-center">
            <Link to="/" className="flex items-center mr-6 group">
              <img src={`${process.env.PUBLIC_URL}/assets/logo/logo.png`} alt="logo.png" className="h-12" />
            </Link>

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

          {/* Hamburger menu button for mobile */}
          <button
            className="xl:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-300 z-[85]"
            onClick={toggleMobileMenu}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                // X icon when menu is open
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Hamburger icon when menu is closed
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <div className="hidden xl:flex items-center space-x-6">
            {/* Menu items */}
            <div className="flex space-x-6">
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  className="group relative cursor-pointer"
                  onMouseEnter={() => {
                    setHoverDropdown(item.name);
                  }}
                  onMouseLeave={() => {
                    setHoverDropdown(null);
                    // Don't close secondary dropdown on mouse leave
                  }}
                >
                  <div className="flex items-center transition-transform duration-300 group-hover:scale-110">
                    {item.hasDropdown ? (
                      <span className="transition-colors duration-300 group-hover:text-blue-600 relative after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all after:duration-300 group-hover:after:w-full">
                        {item.name}
                      </span>
                    ) : (
                      <Link to={item.path} className="transition-colors duration-300 group-hover:text-blue-600 relative after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all after:duration-300 group-hover:after:w-full">
                        {item.name}
                      </Link>
                    )}
                    {item.hasDropdown && (
                      <ChevronDown
                        size={16}
                        className="ml-1 transition-transform duration-300 group-hover:rotate-180 text-gray-700 group-hover:text-blue-600"
                      />
                    )}
                  </div>

                  {/* Custom dropdown matching the image design */}
                  {item.hasDropdown && item.subItems && (
                    <div
                      className={`absolute left-0 top-full mt-1 w-52 bg-white shadow-lg rounded-md overflow-hidden z-10 hidden group-hover:block transform origin-top scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition duration-200`}
                      onMouseEnter={() => setHoverDropdown(item.name)}
                    >
                      {item.subItems.map((subItem, index) => (
                        <div key={index} className="relative" style={{ position: 'relative' }}>
                          {/* First level dropdown item */}
                          {item.name === "Exams" && subItem.hasChildren ? (
                            <div
                              className={`flex items-center justify-between px-4 py-3 hover:bg-[#FFB71C] transition-colors duration-200 group/item ${!subItem.available && 'pointer-events-none opacity-70'}`}
                              onClick={(e) => toggleDesktopSecondaryDropdown(subItem.name, e)}
                              data-dropdown-toggler="true"
                            >
                              <div className="flex items-center min-w-[100px]">
                                {subItem.icon === "DE" ? (
                                  <img src="https://placehold.co/20" alt="German flag" className="w-5 h-5 rounded-full mr-2" />
                                ) : subItem.icon === "GB" ? (
                                  <img src="https://placehold.co/20" alt="British flag" className="w-5 h-5 rounded-full mr-2" />
                                ) : subItem.icon === "FR" ? (
                                  <img src="https://placehold.co/20" alt="French flag" className="w-5 h-5 rounded-full mr-2" />
                                ) : subItem.icon === "CN" ? (
                                  <img src="https://placehold.co/20" alt="Chinese flag" className="w-5 h-5 rounded-full mr-2" />
                                ) : subItem.icon === "ES" ? (
                                  <img src="https://placehold.co/20" alt="Spanish flag" className="w-5 h-5 rounded-full mr-2" />
                                ) : (
                                  <Globe className="w-5 h-5 mr-2" />
                                )}
                                <span className="text-gray-700 group-hover/item:text-black">
                                  {subItem.name}
                                </span>
                              </div>
                              <ChevronDown
                                size={16}
                                className="ml-1 transition-transform duration-300 text-gray-700 -rotate-90"
                              />
                            </div>
                          ) : (
                            <Link
                              to={item.name === 'Support' && subItem.path ? subItem.path : `/${item.name.toLowerCase() === 'courses' ? subItem.name.toLowerCase() : item.name.toLowerCase() === 'exams' ? `german/${subItem.name.toLowerCase()}` : item.name.toLowerCase() === 'support' ? `support/${subItem.name.toLowerCase().replace(' ', '-')}` : `${item.name.toLowerCase()}/${subItem.name.toLowerCase().replace(' ', '-')}`}`}
                              className={`flex items-center px-4 py-3 hover:bg-[#FFB71C] transition-colors duration-200 group/item ${item.name !== "Support" && !subItem.available && 'pointer-events-none opacity-70'}`}
                              onClick={(e) => {
                                if (item.name === "Support" || subItem.available) {
                                  // Use the predefined path for Support items if available
                                  const path = item.name === 'Support' && subItem.path ? subItem.path : `/${item.name.toLowerCase() === 'courses' ? subItem.name.toLowerCase() : item.name.toLowerCase() === 'exams' ? `german/${subItem.name.toLowerCase()}` : item.name.toLowerCase() === 'support' ? `support/${subItem.name.toLowerCase().replace(' ', '-')}` : `${item.name.toLowerCase()}/${subItem.name.toLowerCase().replace(' ', '-')}`}`;
                                  // Use the handler for proper navigation
                                  handleDropdownItemNavigation(e, path);
                                } else {
                                  e.preventDefault();
                                }
                              }}
                            >
                              {item.name === "Courses" || item.name === "Exams" ? (
                                item.name === "Courses" ? (
                                  subItem.icon === "DE" ? <img src="https://placehold.co/20" alt="German flag" className="w-5 h-5 rounded-full mr-2" /> :
                                  subItem.icon === "GB" ? <img src="https://placehold.co/20" alt="British flag" className="w-5 h-5 rounded-full mr-2" /> :
                                  subItem.icon === "FR" ? <img src="https://placehold.co/20" alt="French flag" className="w-5 h-5 rounded-full mr-2" /> :
                                  subItem.icon === "CN" ? <img src="https://placehold.co/20" alt="Chinese flag" className="w-5 h-5 rounded-full mr-2" /> :
                                  subItem.icon === "ES" ? <img src="https://placehold.co/20" alt="Spanish flag" className="w-5 h-5 rounded-full mr-2" /> :
                                  <Globe className="w-5 h-5 mr-2" />
                                ) : (
                                  <img src="https://placehold.co/20" alt="German flag" className="w-5 h-5 rounded-full mr-2" />
                                )
                              ) : item.name === "Support" && subItem.icon === "image" ? (
                                <Image className="w-5 h-5 mr-2 text-gray-700" />
                              ) : item.name === "Support" && subItem.icon === "bar-chart" ? (
                                <BarChart className="w-5 h-5 mr-2 text-gray-700" />
                              ) : item.name === "Support" && subItem.icon === "users" ? (
                                <Users className="w-5 h-5 mr-2 text-gray-700" />
                              ) : (
                                <span className="mr-2">{subItem.icon}</span>
                              )}

                              {/* Different text span styles for Support vs other items */}
                              {item.name === "Support" ? (
                                <span className="text-gray-700 group-hover/item:text-black flex-grow">
                                  {subItem.name}
                                </span>
                              ) : (
                                <span className="text-gray-700 group-hover/item:text-black">
                                  {subItem.name}
                                </span>
                              )}

                              {/* Only show correct icons for Courses and Exams, NOT for Support */}
                              {(item.name === "Courses" || item.name === "Exams") && (
                                <img
                                  src={subItem.available ?
                                    `${process.env.PUBLIC_URL}/assets/Navbar_icons/green-Correct.png` :
                                    `${process.env.PUBLIC_URL}/assets/Navbar_icons/gray-Correct.png`
                                  }
                                  alt={subItem.available ? "Available" : "Not available"}
                                  className="w-5 h-5 ml-auto"
                                />
                              )}
                            </Link>
                          )}

                          {/* Secondary dropdown for exams - NEW APPROACH */}
                          {item.name === "Exams" && subItem.hasChildren && subItem.children && (
                            <div
                              id={`secondary-dropdown-${subItem.name}`}
                              className="bg-white shadow-lg rounded-md overflow-hidden"
                              style={{
                                display: secondaryDropdown === subItem.name ? 'block' : 'none',
                                minWidth: '200px',
                                minHeight: '150px',
                                zIndex: 9999,
                                position: 'fixed',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                border: '2px solid #e5e7eb',
                                transition: 'opacity 0.2s ease-in-out',
                                opacity: secondaryDropdown === subItem.name ? '1' : '0'
                              }}
                              onMouseEnter={() => {
                                // Keep the dropdown open when hovering over it
                                if (secondaryDropdown === subItem.name) {
                                  console.log("Hovering over dropdown");
                                }
                              }}
                            >
                              {subItem.children.map((childItem, childIndex) => (
                                <Link
                                  key={childIndex}
                                  to={`/${subItem.name.toLowerCase()}/${childItem.name.toLowerCase()}`}
                                  className={`flex items-center justify-between px-4 py-3 hover:bg-[#FFB71C] transition-colors duration-200 group/child
                                    ${!childItem.available && 'pointer-events-none opacity-70'}`}
                                  onClick={(e) => {
                                    if (childItem.available) {
                                      handleDropdownItemNavigation(e, `/${subItem.name.toLowerCase()}/${childItem.name.toLowerCase()}`);
                                    } else {
                                      e.preventDefault();
                                    }
                                  }}
                                >
                                  <div className="flex items-center min-w-[100px]">
                                    <img src="https://placehold.co/20" alt={`${subItem.name} flag`} className="w-5 h-5 rounded-full mr-2" />
                                    <span className="text-gray-700 group-hover/child:text-black">
                                      {childItem.name}
                                    </span>
                                  </div>
                                  <img
                                    src={childItem.available ?
                                      `${process.env.PUBLIC_URL}/assets/Navbar_icons/green-Correct.png` :
                                      `${process.env.PUBLIC_URL}/assets/Navbar_icons/gray-Correct.png`
                                    }
                                    alt={childItem.available ? "Available" : "Not available"}
                                    className="w-5 h-5"
                                  />
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Auth buttons for desktop */}
            <div className="flex space-x-3 items-center">
              {(isAuthenticated && user) ? (
                <>
                  <div className="flex items-center mr-3">
                    <span className="text-gray-700 mr-2">Welcome, {user.name || 'User'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center bg-gray-200 font-medium text-blue-600 px-4 py-1 rounded hover:text-blue-800 transition-colors duration-300"
                  >
                    <LogOut size={16} className="mr-1" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="bg-gray-200 font-medium text-blue-600 px-4 py-1 rounded hover:text-blue-800 transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="bg-[#FFB71C] text-white px-4 py-1 rounded hover:bg-yellow-400 hover:text-[#0D47A1] font-medium transition-colors duration-300"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[90] ${
          isMobileMenuOpen ? "opacity-50 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMobileMenu}
      ></div>

      {/* Mobile sidebar menu */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white shadow-xl z-[100] transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile menu header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link
              to="/"
              className="flex items-center"
              onClick={toggleMobileMenu}
            >
              <img
                src={`${process.env.PUBLIC_URL}/assets/logo/logo.png`}
                alt="logo.png"
                className="h-12"
              />
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile menu content */}
          <div className="flex-1 overflow-y-auto py-4" style={{ maxHeight: 'calc(100vh - 130px)' }}>
            {/* Mobile search bar */}
            <div className="px-4 mb-6">
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

            {/* Mobile menu items */}
            <div className="px-4 py-2">
              {menuItems.map((item) => (
                <div key={item.name} className="mb-2">
                  <div
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => {
                      if (!item.hasDropdown) {
                        navigate(item.path);
                        toggleMobileMenu();
                      } else if (item.hasDropdown) {
                        toggleDropdown(item.name);
                      }
                    }}
                  >
                    <span
                      className={`transition-colors duration-200 ${
                        openDropdown === item.name
                          ? "text-blue-600 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.hasDropdown && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${
                          openDropdown === item.name
                            ? "rotate-180 text-blue-600"
                            : "text-gray-500"
                        }`}
                      />
                    )}
                  </div>

                  {/* First level dropdown content for mobile */}
                  {item.hasDropdown && item.subItems && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openDropdown === item.name
                          ? "max-h-80 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="bg-gray-50 rounded-md mt-1 mb-2">
                        {item.subItems.map((subItem, index) => (
                          <div key={index} className="relative">
                            {/* First level item (language or category) */}
                            {item.name === "Exams" && subItem.hasChildren ? (
                              <div
                                className={`flex items-center justify-between px-4 py-3 hover:bg-[#FFB71C] transition-colors duration-200 ${!subItem.available && 'opacity-70'}`}
                                onClick={(e) => toggleSecondaryDropdown(subItem.name, e)}
                              >
                                <div className="flex items-center min-w-[100px]">
                                  {subItem.icon === "DE" ? (
                                    <img src="https://placehold.co/20" alt="German flag" className="w-5 h-5 rounded-full mr-2" />
                                  ) : subItem.icon === "GB" ? (
                                    <img src="https://placehold.co/20" alt="British flag" className="w-5 h-5 rounded-full mr-2" />
                                  ) : subItem.icon === "FR" ? (
                                    <img src="https://placehold.co/20" alt="French flag" className="w-5 h-5 rounded-full mr-2" />
                                  ) : subItem.icon === "CN" ? (
                                    <img src="https://placehold.co/20" alt="Chinese flag" className="w-5 h-5 rounded-full mr-2" />
                                  ) : subItem.icon === "ES" ? (
                                    <img src="https://placehold.co/20" alt="Spanish flag" className="w-5 h-5 rounded-full mr-2" />
                                  ) : (
                                    <Globe className="w-5 h-5 mr-2" />
                                  )}
                                  <span className="text-gray-700">
                                    {subItem.name}
                                  </span>
                                </div>
                                <ChevronDown
                                  size={16}
                                  className={`transition-transform duration-300 text-gray-500 ${
                                    secondaryDropdown === subItem.name
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />
                              </div>
                            ) : (
                              <Link
                                to={item.name === 'Support' && subItem.path ? subItem.path : `/${item.name.toLowerCase() === 'courses' ? subItem.name.toLowerCase() : item.name.toLowerCase() === 'exams' ? `german/${subItem.name.toLowerCase()}` : item.name.toLowerCase() === 'support' ? `support/${subItem.name.toLowerCase().replace(' ', '-')}` : `${item.name.toLowerCase()}/${subItem.name.toLowerCase().replace(' ', '-')}`}`}
                                className={`flex items-center px-4 py-3 hover:bg-[#FFB71C] transition-colors duration-200 group/item ${item.name !== "Support" && !subItem.available && 'pointer-events-none opacity-70'}`}
                                onClick={(e) => {
                                  if (!subItem.available && item.name !== "Support") {
                                    e.preventDefault();
                                  } else {
                                    // Use the predefined path for Support items if available
                                    const path = item.name === 'Support' && subItem.path ? subItem.path : `/${item.name.toLowerCase() === 'courses' ? subItem.name.toLowerCase() : item.name.toLowerCase() === 'exams' ? `german/${subItem.name.toLowerCase()}` : item.name.toLowerCase() === 'support' ? `support/${subItem.name.toLowerCase().replace(' ', '-')}` : `${item.name.toLowerCase()}/${subItem.name.toLowerCase().replace(' ', '-')}`}`;
                                    // Use the handler for proper navigation
                                    handleDropdownItemNavigation(e, path);
                                  }
                                }}
                              >
                                {item.name === "Courses" || item.name === "Exams" ? (
                                  item.name === "Courses" ? (
                                    subItem.icon === "DE" ? <img src="https://placehold.co/20" alt="German flag" className="w-5 h-5 rounded-full mr-2" /> :
                                    subItem.icon === "GB" ? <img src="https://placehold.co/20" alt="British flag" className="w-5 h-5 rounded-full mr-2" /> :
                                    subItem.icon === "FR" ? <img src="https://placehold.co/20" alt="French flag" className="w-5 h-5 rounded-full mr-2" /> :
                                    subItem.icon === "CN" ? <img src="https://placehold.co/20" alt="Chinese flag" className="w-5 h-5 rounded-full mr-2" /> :
                                    subItem.icon === "ES" ? <img src="https://placehold.co/20" alt="Spanish flag" className="w-5 h-5 rounded-full mr-2" /> :
                                    <Globe className="w-5 h-5 mr-2" />
                                  ) : (
                                    <img src="https://placehold.co/20" alt="German flag" className="w-5 h-5 rounded-full mr-2" />
                                  )
                                ) : item.name === "Support" && subItem.icon === "image" ? (
                                  <Image className="w-5 h-5 mr-2" />
                                ) : item.name === "Support" && subItem.icon === "bar-chart" ? (
                                  <BarChart className="w-5 h-5 mr-2" />
                                ) : item.name === "Support" && subItem.icon === "users" ? (
                                  <Users className="w-5 h-5 mr-2" />
                                ) : (
                                  <span className="mr-2">{subItem.icon}</span>
                                )}

                                {/* Different text span styles for Support vs other items */}
                                {item.name === "Support" ? (
                                  <span className="text-gray-700 group-hover/item:text-black flex-grow">
                                    {subItem.name}
                                  </span>
                                ) : (
                                  <span className="text-gray-700 group-hover/item:text-black">
                                    {subItem.name}
                                  </span>
                                )}

                                {/* Only show correct icons for Courses and Exams, NOT for Support */}
                                {(item.name === "Courses" || item.name === "Exams") && (
                                  <div className="ml-auto">
                                    <img
                                      src={subItem.available ?
                                        `${process.env.PUBLIC_URL}/assets/Navbar_icons/green-Correct.png` :
                                        `${process.env.PUBLIC_URL}/assets/Navbar_icons/gray-Correct.png`
                                      }
                                      alt={subItem.available ? "Available" : "Not available"}
                                      className="w-5 h-5"
                                    />
                                  </div>
                                )}
                              </Link>
                            )}

                            {/* Second level dropdown (exam types) */}
                            {item.name === "Exams" && subItem.hasChildren && (
                              <div
                                className={`overflow-hidden bg-gray-100 transition-all duration-300 ${
                                  secondaryDropdown === subItem.name
                                    ? "max-h-80 opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                              >
                                {subItem.children.map((childItem, childIndex) => (
                                  <Link
                                    key={childIndex}
                                    to={`/${subItem.name.toLowerCase()}/${childItem.name.toLowerCase()}`}
                                    className={`flex items-center justify-between px-4 py-3 ml-3 hover:bg-[#FFB71C] transition-colors duration-200 ${!childItem.available && 'pointer-events-none opacity-70'}`}
                                    onClick={(e) => {
                                      if (childItem.available) {
                                        handleDropdownItemNavigation(e, `/${subItem.name.toLowerCase()}/${childItem.name.toLowerCase()}`);
                                      } else {
                                        e.preventDefault();
                                      }
                                    }}
                                  >
                                    <div className="flex items-center min-w-[100px]">
                                      <img src="https://placehold.co/20" alt={`${subItem.name} flag`} className="w-5 h-5 rounded-full mr-2" />
                                      <span className="text-gray-700 group-hover:text-black">
                                        {childItem.name}
                                      </span>
                                    </div>
                                    <img
                                      src={childItem.available ?
                                        `${process.env.PUBLIC_URL}/assets/Navbar_icons/green-Correct.png` :
                                        `${process.env.PUBLIC_URL}/assets/Navbar_icons/gray-Correct.png`
                                      }
                                      alt={childItem.available ? "Available" : "Not available"}
                                      className="w-5 h-5"
                                    />
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu footer with auth buttons */}
          <div className="border-t p-4 bg-gray-50">
            {(isAuthenticated && user) ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-center mb-2">
                  <User size={18} className="text-gray-700 mr-2" />
                  <span className="text-gray-700">Welcome, {user.name || 'User'}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="flex items-center justify-center bg-gray-200 font-medium text-blue-600 py-2 px-4 rounded hover:text-blue-800 transition-colors duration-300"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/auth/login"
                  className="bg-gray-200 font-medium text-blue-600 py-1 px-4 rounded hover:text-blue-800 transition-colors duration-300 text-center"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  className="bg-[#FFB71C] text-white py-2 px-4 rounded-md hover:bg-yellow-500 hover:text-[#0D47A1] font-medium transition-colors duration-300 text-center"
                  onClick={toggleMobileMenu}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add padding to the main content */}
      <div className="h-[7.5rem] md:h-[109px]"></div>
    </>
  );
};

export default Navbar;