import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  // State to track if mobile menu is open
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Track which dropdown is open in the mobile menu
  const [openDropdown, setOpenDropdown] = useState(null);
  // Use navigate for programmatic navigation if needed
  const navigate = useNavigate();
  
  // Clean up effect to ensure scroll is re-enabled when component unmounts
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

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
    }
  };

  // Toggle dropdown in mobile menu
  const toggleDropdown = (item) => {
    if (openDropdown === item) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(item);
    }
  };

  return (
    <>
      {/* Fixed wrapper for the entire navbar including banner */}
      <div className="fixed top-0 left-0 right-0 z-[80] w-full">
        {/* Top banner - Moved outside of nav to span full width */}
        <div className="bg-blue-900 text-white p-2 text-center text-sm w-full">
          Keep learning with free resources! Experience{" "}
          <span className="font-bold">Preplings</span>.
          <a href="#" className="ml-2 text-yellow-400 hover:underline">
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
            {/* Menu items - Simplified to match image */}
            <div className="flex space-x-6">
              {[
                { name: "Courses", hasDropdown: true, path: "/courses" },
                { name: "Exams", hasDropdown: false, path: "/exams" },
                { name: "Dashboard", hasDropdown: false, path: "/dashboard/student" },
                { name: "Support", hasDropdown: false, path: "/support/contact-us" },
              ].map((item) => (
                <div key={item.name} className="group relative cursor-pointer">
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:rotate-180 text-gray-700 group-hover:text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                  {item.hasDropdown && (
                    <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md py-2 z-10 hidden group-hover:block transform origin-top scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition duration-200">
                      {[1, 2, 3].map((subItem) => (
                        <a
                          key={subItem}
                          href="#"
                          className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-200 hover:text-blue-700"
                        >
                          {item.name} Item {subItem}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Auth buttons for desktop - Keeping original styling */}
            <div className="flex space-x-3">
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
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay that darkens the main content when menu is open */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[90] ${
          isMobileMenuOpen ? "opacity-50 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMobileMenu}
      ></div>

      {/* Mobile sidebar menu - slides in from right */}
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
                className=" h-12"
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

          {/* Mobile menu content - scrollable */}
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

            {/* Menu items with dropdowns */}
            <div className="px-4 py-2">
              {[
                { name: "Courses", hasDropdown: true, path: "/courses" },
                { name: "Exams", hasDropdown: false, path: "/exams" },
                { name: "Dashboard", hasDropdown: false, path: "/dashboard/student" },
                { name: "Support", hasDropdown: false, path: "/support/contact-us" },
              ].map((item) => (
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transition-transform duration-300 ${
                          openDropdown === item.name
                            ? "rotate-180 text-blue-600"
                            : "text-gray-500"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Dropdown content */}
                  {item.hasDropdown && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openDropdown === item.name
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="bg-gray-50 rounded-md mt-1 mb-2">
                        {[1, 2, 3].map((subItem) => (
                          <a
                            key={subItem}
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 border-l-2 border-transparent hover:border-blue-500"
                          >
                            {item.name} Item {subItem}
                          </a>
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
                className="bg-yellow-400 text-white py-2 px-4 rounded-md hover:bg-yellow-500 hover:text-[#0D47A1] font-medium transition-colors duration-300 text-center"
                onClick={toggleMobileMenu}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add padding to the main content to prevent it from being hidden behind the fixed navbar */}
      <div className=" h-[7.5rem] md:h-[109px]"></div> {/* Adjust this height based on your navbar's total height */}
    </>
  );
};

export default Navbar;