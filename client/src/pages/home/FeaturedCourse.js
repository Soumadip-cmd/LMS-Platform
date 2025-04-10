import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Filter } from "lucide-react";
import TagStyle from "../../components/TagStyle/TagStyle";
// Import for navigation - depending on your routing setup, you might need to adjust this
import { useNavigate } from "react-router-dom";

const FeaturedCourses = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [buttonPositions, setButtonPositions] = useState(null);
  const cardRefs = useRef([]);
  // Add navigate hook for routing
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: "German A1 Intensive Course",
      description:
        "Master basic German communication skills with our intensive program",
      price: "$139/Month",
      type: "Live Online",
      flag: "🇩🇪",
      image: "https://placehold.co/400x250",
    },
    {
      id: 2,
      title: "Spanish B1 Business Course",
      description:
        "Master basic German communication skills with our intensive program",
      price: "$139/Month",
      type: "Recorded",
      flag: "🇪🇸",
      image: "https://placehold.co/400x250",
      tag: "FREE",
    },
    {
      id: 3,
      title: "French C1 Intensive Course",
      description: "Perfect your German language with advanced topics",
      price: "$139/Month",
      type: "Live Online",
      flag: "🇫🇷",
      image: "https://placehold.co/400x250",
    },
    {
      id: 4,
      title: "German A1 Intensive Course",
      description:
        "Master basic German communication skills with our intensive program",
      price: "$139/Month",
      type: "Live Online",
      flag: "🇩🇪",
      image: "https://placehold.co/400x250",
    },
  ];

  const handleDotClick = (index) => {
    setActiveSlide(index);
  };

  // Add a function to handle the enrollment button click
  const handleEnrollClick = (courseType) => {
    if (courseType === "Live Online") {
      navigate("/details/live-online");
    } else if (courseType === "Recorded") {
      navigate("/detail/recorded-class");
    }
  };

  return (
    <div className="mx-auto 2xl:mx-1 px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Featured Courses Header */}
        <div className="relative">
          <h2 className="text-2xl font-bold">
            Featured
            <TagStyle color="#000000" text="Courses" />
          </h2>
        </div>

        {/* Course Count and Filters */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            we found <span className="font-medium text-blue-500 numbers">118</span>{" "}
            courses available for you
          </p>
          <div className="relative group">
            <button className="flex items-center px-4 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200 transition-colors duration-200 shadow-md">
              <Filter className="w-4 h-4 mr-1 text-blue-500" />
              <span className="text-blue-500">Filters</span>
              <ChevronDown className="w-4 h-4 ml-2 text-blue-500" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="py-2">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Price: Low to High
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Price: High to Low
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Newest First
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Popularity
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Course Cards */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 transform hover:scale-105 pb-16"
              >
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                  {course.tag && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-sm">
                      {course.tag}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-sm ${
                        course.type === "Recorded"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {course.type}
                    </span>
                    <span className="text-gray-500 font-medium">
                      $<span className="numbers">{course.price.replace('$', '').replace('/Month', '')}</span>/Month
                    </span>
                  </div>
                  <h3 className="font-medium text-lg mb-2">
                    <span className="mr-2">{course.flag}</span>
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{course.description}</p>
                </div>
                {/* Absolute positioned button at the bottom with added onClick handler */}
                <div className="absolute bottom-4 left-4">
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition w-32"
                    onClick={() => handleEnrollClick(course.type)}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-4">
            {courses.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 mx-1 rounded-full ${
                  activeSlide === index ? "bg-gray-700" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCourses;