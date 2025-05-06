

import React, { useState, useEffect, useContext, useRef } from "react";
import { ChevronDown, Filter } from "lucide-react";
import TagStyle from "../../components/TagStyle/TagStyle";
import { useNavigate } from "react-router-dom";
import CourseContext from '../../context/course/courseContext';

const FeaturedCourses = () => {
  console.log("FeaturedCourses component rendering");
  
  const [activeSlide, setActiveSlide] = useState(0);
  const [filterOption, setFilterOption] = useState("popularity");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const navigate = useNavigate();
  
  // Get context
  const courseContext = useContext(CourseContext);
  const { getFeaturedCourses, loading, courses, error } = courseContext;
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  
  // Refs to track previous values
  const prevPageRef = useRef(currentPage);
  const prevFilterRef = useRef(filterOption);
  const isFirstRenderRef = useRef(true);
  const apiCallCountRef = useRef(0);
  
  // Controlled API call with detailed logging
  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      // Track API call count
      apiCallCountRef.current += 1;
      const callNumber = apiCallCountRef.current;
      
      console.log(`[API Call #${callNumber}] Starting API request with parameters:`, {
        page: currentPage,
        limit: 4,
        sortBy: filterOption,
        loading,
        isFirstRender: isFirstRenderRef.current,
        prevPage: prevPageRef.current,
        prevFilter: prevFilterRef.current
      });
      
      try {
        // Call API with filter parameters
        console.log(`[API Call #${callNumber}] Calling getFeaturedCourses...`);
        const result = await getFeaturedCourses({
          page: currentPage,
          limit: 4,
          sortBy: filterOption
        });
        
        console.log(`[API Call #${callNumber}] API call successful:`, result);
        
        if (result && result.pagination) {
          console.log(`[API Call #${callNumber}] Setting total courses to:`, result.pagination.total);
          setTotalCourses(result.pagination.total);
        }
      } catch (err) {
        console.error(`[API Call #${callNumber}] Error fetching featured courses:`, err);
      } finally {
        console.log(`[API Call #${callNumber}] API call complete`);
      }
    };
    
    // Log render reason
    if (isFirstRenderRef.current) {
      console.log("API call triggered by initial render");
      isFirstRenderRef.current = false;
    } else if (prevPageRef.current !== currentPage) {
      console.log(`API call triggered by page change: ${prevPageRef.current} -> ${currentPage}`);
    } else if (prevFilterRef.current !== filterOption) {
      console.log(`API call triggered by filter change: ${prevFilterRef.current} -> ${filterOption}`);
    } else {
      console.log("API call triggered by other state change or context update");
    }
    
    // Only fetch if not already loading
    if (!loading) {
      console.log("Loading state is false, proceeding with API call");
      fetchFeaturedCourses();
    } else {
      console.log("Loading state is true, skipping API call");
    }
    
    // Update previous values after the effect runs
    prevPageRef.current = currentPage;
    prevFilterRef.current = filterOption;
    
  }, [currentPage, filterOption, loading]); // Removed getFeaturedCourses from dependencies

  const handleDotClick = (index) => {
    console.log(`Dot clicked: ${index}`);
    setActiveSlide(index);
    // For pagination, calculate the page number based on the dot index
    setCurrentPage(index + 1);
  };

  const handleEnrollClick = (courseId, courseType) => {
    console.log(`Enroll clicked for course: ${courseId}, type: ${courseType}`);
    if (courseType === "Live Online") {
      navigate(`/details/live-online/${courseId}`);
    } else if (courseType === "Recorded") {
      navigate(`/details/recorded-class/${courseId}`);
    }
  };
  
  const handleFilterChange = (option) => {
    console.log(`Filter changed to: ${option}`);
    setFilterOption(option);
    setShowFilterMenu(false);
  };
  
  // Function to determine course type based on course data
  const getCourseType = (course) => {
    const courseType = course.isLive ? "Live Online" : "Recorded";
    console.log(`Course ${course._id} type determined as: ${courseType}`);
    return courseType;
  };

  console.log("Rendering component with state:", {
    loading,
    coursesCount: courses?.length || 0,
    totalCourses,
    currentPage,
    filterOption,
    showFilterMenu
  });

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
            we found <span className="font-medium text-blue-500 numbers">{totalCourses}</span>{" "}
            courses available for you
          </p>
          <div className="relative">
            <button 
              className="flex items-center px-4 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200 transition-colors duration-200 shadow-md"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter className="w-4 h-4 mr-1 text-blue-500" />
              <span className="text-blue-500">Filters</span>
              <ChevronDown className="w-4 h-4 ml-2 text-blue-500" />
            </button>
            
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10">
                <div className="py-2">
                  <button
                    onClick={() => handleFilterChange("price-low")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => handleFilterChange("price-high")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Price: High to Low
                  </button>
                  <button
                    onClick={() => handleFilterChange("newest")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Newest First
                  </button>
                  <button
                    onClick={() => handleFilterChange("popularity")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Popularity
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Course Cards */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading courses...</p>
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {courses.map((course, index) => {
                const courseType = getCourseType(course);
                const isFree = course.price === 0;
                
                return (
                  <div
                    key={course._id}
                    className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 transform hover:scale-105 pb-16"
                  >
                    <div className="relative">
                      <img
                        src={course.thumbnailUrl || "https://placehold.co/400x250"}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                      {isFree && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-sm">
                          FREE
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-sm ${
                            courseType === "Recorded"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {courseType}
                        </span>
                        <span className="text-gray-500 font-medium">
                          {isFree ? 'Free' : `$${course.price}/Month`}
                        </span>
                      </div>
                      <h3 className="font-medium text-lg mb-2">
                        <span className="mr-2">{course.language?.code || ''}</span>
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{course.description}</p>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition w-32"
                        onClick={() => handleEnrollClick(course._id, courseType)}
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p>No courses available.</p>
            </div>
          )}

          {/* Pagination Dots */}
          {!loading && courses && courses.length > 0 && (
            <div className="flex justify-center mt-4">
              {Array.from({ length: Math.ceil(totalCourses / 4) || 1 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  className={`w-2 h-2 mx-1 rounded-full ${
                    currentPage === i + 1 ? "bg-gray-700" : "bg-gray-300"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCourses;