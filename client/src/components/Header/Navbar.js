import React from 'react';

const Navbar = () => {

  return (
    <>
      <nav className="bg-white shadow px-4 py-3 flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center mr-6 group">
            <div className="bg-yellow-400 text-white p-1 rounded mr-1 transition-transform duration-300 group-hover:scale-110">
              <span className="font-bold">PL</span>
            </div>
            <span className="text-blue-600 font-bold transition-colors duration-300 group-hover:text-blue-800">PREPLINGS</span>
          </div>

          <div className="relative mx-4 hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded-md py-2 px-4 pr-10 w-72 lg:w-96 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300"
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

        <div className="flex items-center space-x-6">
          {/* Menu items - visible only on xl devices */}
          <div className="hidden xl:flex space-x-6">
            {['Courses', 'Exams', 'Dashboard', 'Support'].map((item) => (
              <div key={item} className="group relative cursor-pointer">
                <div className="flex items-center transition-transform duration-300 group-hover:scale-110">
                  <span className="transition-colors duration-300 group-hover:text-blue-600 relative after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all after:duration-300 group-hover:after:w-full">{item}</span>
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
                </div>
                <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md py-2 z-10 hidden group-hover:block transform origin-top scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition duration-200">
                  {[1, 2, 3].map((subItem) => (
                    <a 
                      key={subItem} 
                      href="#" 
                      className="block px-4 py-2 hover:bg-blue-50 transition-colors duration-200 hover:text-blue-700"
                    >
                      {item} Item {subItem}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Auth buttons with hover effects */}
          <div className="flex space-x-3">
            <button 
              className="text-blue-600 hover:text-blue-800 transition-all duration-300 relative after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:scale-110"
            >
              Login
            </button>
            <button 
              className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500 transition-all duration-300 transform hover:scale-110 hover:shadow-md"
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;