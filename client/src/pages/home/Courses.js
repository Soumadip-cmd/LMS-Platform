

import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TagStyle from '../../components/TagStyle/TagStyle';
import CourseContext from '../../context/course/courseContext';

const Courses = () => {
  const navigate = useNavigate();
  const courseContext = useContext(CourseContext);
  const { getTopCourses, loading } = courseContext;
  const [topCourses, setTopCourses] = useState([]);

  // Handle course click - navigate to different routes based on course language
  const handleCourseClick = (course) => {
    // If it's a German-related course, navigate to /exams, otherwise navigate to /courses
    if (course.flag === 'DE' ||
        (course.title && course.title.toLowerCase().includes('german')) ||
        (course.title && course.title.toLowerCase().includes('deutsch'))) {
      navigate('/exams');
    } else {
      navigate('/courses');
    }
  };

  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
        const courses = await getTopCourses({ limit: 8 });
        if (courses) {
          // Transform the API response to match your UI format
          const formattedCourses = courses.map(course => ({
            id: course._id,
            title: course.language ? `${course.language.name} Courses` : 'Language Course',
            programs: course.enrolledStudents?.length || 0,
            flag: course.language?.code || 'UN',
            flagImage: null,
            flagBg: getFlagBgColor(course.language?.code),
            bgImage: course.thumbnailUrl || 'https://placehold.co/300x200',
            comingSoon: course.status === 'underReview'
          }));
          setTopCourses(formattedCourses);
        }
      } catch (error) {
        console.error('Error fetching top courses:', error);
        setTopCourses([]); // Empty array if API fails
      }
    };

    fetchTopCourses();
  }, []);

  // Helper function to determine flag background color based on language code
  const getFlagBgColor = (code) => {
    const flagColors = {
      'EN': 'bg-red-600',
      'DE': 'bg-yellow-400',
      'FR': 'bg-blue-600',
      'JP': 'bg-red-500',
      'ES': 'bg-yellow-500',
      'MY': 'bg-blue-500',
      'IT': 'bg-green-600',
      'CN': 'bg-red-600'
    };
    return flagColors[code] || 'bg-gray-500';
  };

  return (
    <div className="container mx-auto 2xl:mx-1 px-4 py-8 ">
      <div className="relative mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Top <TagStyle color="#000000" text="Courses"/></h1>
        <div className="absolute -top-1 -z-10 left-0 h-8 w-40 bg-yellow-200 rounded-sm"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <p>Loading courses...</p>
        </div>
      ) : topCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {topCourses.map((course) => (
            <div
              key={course.id}
              className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer"
              onClick={() => handleCourseClick(course)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.bgImage}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
                  <h3 className="text-white text-lg font-medium mb-1">{course.title}</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${course.flagBg} overflow-hidden`}>
                      {course.flagImage ? (
                        <img
                          src={course.flagImage}
                          alt={course.flag}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-white font-bold">{course.flag}</span>
                      )}
                    </div>
                    <span className="text-white text-sm"><span className="numbers">{course.programs}</span> programs</span>
                  </div>
                </div>
              </div>
              {course.comingSoon && (
                <div className="absolute top-3 right-0">
                  <span className="bg-yellow-400 text-xs font-semibold px-3 py-1 rounded-l-full text-gray-800">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-48">
          <p>No courses available or coming soon.</p>
        </div>
      )}

      <div className="flex justify-center mt-10">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-md transition duration-300 w-full md:w-auto md:min-w-64 transform hover:scale-105"
          onClick={() => navigate('/courses')}
        >
          View All Courses
        </button>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="bg-blue-700 hover:bg-blue-800 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transform hover:scale-105 transition duration-300"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Courses;