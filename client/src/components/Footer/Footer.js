import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white">
      {/* Horizontal rule at the top of footer */}
      <hr className="border-gray-200 mx-4 sm:mx-8 lg:mx-16" />

      <div className="py-6 sm:py-8 md:py-10 px-4 sm:px-8 lg:px-16 md:mr-10 lg:mr-0">
        <div className="mx-auto md:mx-6 lg:mx-1 2xl:mx-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-x-6 sm:gap-x-8 md:gap-x-12 gap-y-6 sm:gap-y-8">
            {/* Logo and Open Time Section */}
            <div className="sm:col-span-2 md:col-span-3 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-center sm:justify-start -ml-3">
              
                <img
                  src={`${process.env.PUBLIC_URL}/assets/logo/logo.png`}
                  alt="logo.png"
                  className="h-10 sm:h-12"
                />
              </div>

              <div className="text-center sm:text-left">
                <h3 className="font-medium mb-3 text-gray-800">Open Time</h3>
                <div className="flex flex-col text-sm text-gray-600 space-y-2">
                  <p className="flex justify-center sm:justify-start">
                    <span className="mr-2 font-medium">Mon - Friday :</span>
                    <span>09:00 - 20:00</span>
                  </p>
                  <p className="flex justify-center sm:justify-start">
                    <span className="mr-2 font-medium">Sat - Sunday :</span>
                    <span>09:00 - 13:00</span>
                  </p>
                </div>
              </div>

              {/* Copyright shown only on desktop */}
              <p className="text-xs text-gray-500 pt-4 hidden md:block text-center sm:text-left">
                © 2025 Preplings. All Rights Reserved
              </p>
            </div>

            {/* First About Section */}
            <div className="sm:col-span-1 md:col-span-2 md:ml-6">
              <h3 className="font-medium mb-3 md:mb-5 text-gray-800 text-center sm:text-left">About</h3>
              <ul className="grid grid-cols-3 sm:grid-cols-1 gap-2 md:block md:space-y-3 text-sm text-gray-600 text-center sm:text-left">
                <li>
                  <a href="#" className="hover:text-blue-700">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Instructor
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Events
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Become an Instructor
                  </a>
                </li>
              </ul>
            </div>

            {/* Second About Section - Hidden on mobile, visible on md screens and up */}
            <div className="hidden md:block md:col-span-2">
              <h3 className="font-medium mb-5 text-gray-800">About</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-700">
                    News & Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Library
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Gallery
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-700">
                    Career
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter Section */}
            <div className="sm:col-span-2 md:col-span-5">
              <h3 className="font-medium mb-3 text-gray-800 text-center sm:text-left">
                Sign Up for Our Newsletter
              </h3>
              <p className="text-sm text-gray-600 mb-5 text-center sm:text-left">
                Receive weekly newsletter with educational materials, popular
                books and much more!
              </p>

              <div className="flex flex-col sm:flex-row max-w-md mx-auto sm:mx-0">
                <input
                  type="email"
                  placeholder="Your e-mail"
                  className="w-full p-2 px-4 text-sm border border-gray-200 rounded-t-lg sm:rounded-l-lg sm:rounded-r-none bg-gray-50 focus:outline-none mb-2 sm:mb-0"
                />
                <button className="w-full sm:w-auto bg-yellow-400 font-medium text-sm px-4 py-2 sm:rounded-r-lg hover:bg-yellow-500 transition">
                  Subscribe
                </button>
              </div>

              {/* Social Media Icons - Centered on mobile with wrap support */}
              <div className="flex justify-center flex-wrap gap-3 mt-6">
                <a href="#" aria-label="Facebook" className="flex items-center justify-center">
                  <div className="w-8 h-8 flex items-center justify-center text-blue-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </div>
                </a>
                <a href="#" aria-label="Instagram" className="flex items-center justify-center">
                  <div className="w-8 h-8 flex items-center justify-center text-pink-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                </a>
                <a href="#" aria-label="Twitter" className="flex items-center justify-center">
                  <div className="w-8 h-8 flex items-center justify-center text-black">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </div>
                </a>
                <a href="#" aria-label="LinkedIn" className="flex items-center justify-center">
                  <div className="w-8 h-8 flex items-center justify-center text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                    </svg>
                  </div>
                </a>
                <a href="#" aria-label="YouTube" className="flex items-center justify-center">
                  <div className="w-8 h-8 flex items-center justify-center text-red-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </div>
                </a>
              </div>

              {/* Copyright shown after newsletter on mobile only */}
              <p className="text-xs text-center md:hidden text-gray-500 mt-6">
                © 2025 Preplings. All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;