import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Globe, Image, BarChart, Users } from "lucide-react";

const MobileNav = ({isMobileMenuOpen, toggleMobileMenu, openDropdown, toggleDropdown, secondaryDropdown, toggleSecondaryDropdown, menuItems, navigate,handleDropdownItemNavigation }) => {
  return (
    <>
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
                      className=" w-[60%] h-[60%]"
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
                </div>
              </div>
            </div>
    </>
  )
}

export default MobileNav
