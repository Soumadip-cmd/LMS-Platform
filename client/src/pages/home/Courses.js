import React from 'react';
import TagStyle from '../../components/TagStyle/TagStyle';



const Courses = () => {
  const courses = [
    {
      id: 1,
      title: 'English Courses',
      programs: 20,
      flag: 'UK',
      flagImage: null, // Replace with your actual image path
      flagBg: 'bg-red-600',
      bgImage: 'https://placehold.co/300x200',
      comingSoon: false
    },
    {
      id: 2,
      title: 'German Courses',
      programs: 20,
      flag: 'DE',
      flagImage: null, // Replace with your actual image path
      flagBg: 'bg-yellow-400',
      bgImage: 'https://placehold.co/300x200',
      comingSoon: true
    },
    {
      id: 3,
      title: 'French Courses',
      programs: 20,
      flag: 'FR',
      flagImage: null, // Replace with your actual image path
      flagBg: 'bg-blue-600',
      bgImage: 'https://placehold.co/300x200',
      comingSoon: false
    },
    {
      id: 4,
      title: 'Japan Courses',
      programs: 20,
      flag: 'JP',
      flagImage: null, // Replace with your actual image path
      flagBg: 'bg-red-500',
      bgImage: 'https://placehold.co/300x200',
      comingSoon: false
    },
    {
      id: 5,
      title: 'Spanish Courses',
      programs: 20,
      flag: 'ES',
      flagImage: null, // Replace with your actual image path
      flagBg: 'bg-yellow-500',
      bgImage: 'https://placehold.co/300x200',
      comingSoon: false
    },
    {
      id: 6,
      title: 'Malaysia Courses',
      programs: 20,
      flag: 'MY',
      flagImage: null, // Replace with your actual image path
      flagBg: 'bg-blue-500',
      bgImage: 'https://placehold.co/300x200',
      comingSoon: false
    },
    {
      id: 7,
      title: 'Italy Courses',
      programs: 20,
      flag: 'IT',
      flagImage: null, // Replace with your actual image path
      flagBg: 'bg-green-600',
      bgImage: 'https://placehold.co/300x200',
      comingSoon: false
    },
    {
      id: 8,
      title: 'China Courses',
      programs: 20,
      flag: 'CN',
      flagImage: null, // Replace with your actual image path
      flagBg: 'bg-red-600',
      bgImage: 'https://placehold.co/300x200',
      comingSoon: false
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="relative mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Top <TagStyle color="#000000" text="Courses"/></h1>
        <div className="absolute -top-1 -z-10 left-0 h-8 w-40 bg-yellow-200 rounded-sm"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {courses.map((course) => (
          <div key={course.id} className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer">
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
                  <span className="text-white text-sm">{course.programs} programs</span>
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

      <div className="flex justify-center mt-10">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-md transition duration-300 w-full md:w-auto md:min-w-64 transform hover:scale-105">
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