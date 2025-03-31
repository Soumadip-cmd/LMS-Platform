import React from 'react';

const CourseSection = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-blue-500 mb-2">Choose your course to get started!</h1>
        <p className="text-gray-600">Select a language course or exam to personalize your learning experience and start progressing today!</p>
      </div>
      
      {/* Aligned dropdowns to the right - responsive for mobile with fixed positioning */}
      <div className="flex justify-end mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full sm:w-auto">
          <div className="relative">
            <select className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-md bg-white pr-8 focus:outline-none focus:border-blue-500 focus:ring-0 transition-none">
              <option>Select your Language</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-md bg-white pr-8 focus:outline-none focus:border-blue-500 focus:ring-0 transition-none">
              <option>Course Type</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-md bg-white pr-8 focus:outline-none focus:border-blue-500 focus:ring-0 transition-none">
              <option>All Exam Patterns</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-md bg-white pr-8 focus:outline-none focus:border-blue-500 focus:ring-0 transition-none">
              <option>All Levels</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800">Featured Courses</h2>
      </div>
      
      {/* Course cards with consistent heights and aligned elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* DELF A1 Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              <h3 className="font-bold text-blue-600">DELF A1</h3>
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzIDIiPjxwYXRoIGZpbGw9IiMwMDAwOTMiIGQ9Ik0wIDBoMXYySDB6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEgMGgxdjJIMXoiLz48cGF0aCBmaWxsPSIjZWIwMDAwIiBkPSJNMiAwaDF2MkgyeiIvPjwvc3ZnPg==" className="ml-2 w-6 h-4" alt="French Flag" />
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Live Online</span>
          </div>
          <div className="p-4 flex-grow">
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Complete A1 Syllabus</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Vocabulary Training</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Grammar Focus</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Mock Test</span>
              </li>
            </ul>
          </div>
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-blue-600 font-bold">₹ 499/course</div>
            </div>
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded transition duration-200">
              Select Course
            </button>
          </div>
        </div>
        
        {/* TELC A2 Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              <h3 className="font-bold text-green-700">TELC A2</h3>
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1IDMiPjxwYXRoIGQ9Ik0wIDBoNXYxSDB6IiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTAgMWg1djFIMHoiIGZpbGw9IiNmMDAiLz48cGF0aCBkPSJNMCAyaDV2MUgweiIgZmlsbD0iI2ZmY2UwMCIvPjwvc3ZnPg==" className="ml-2 w-6 h-4" alt="German Flag" />
            </div>
            <span className="bg-green-100 text-green-800 text-xs font-medium py-1 px-2 rounded">Recorded</span>
          </div>
          <div className="p-4 flex-grow">
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Complete A2 Syllabus</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Advance Vocabulary</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Grammar Practice</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Mock Test</span>
              </li>
            </ul>
          </div>
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-green-700 font-bold">₹ 499/course</div>
            </div>
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded transition duration-200">
              Select Course
            </button>
          </div>
        </div>
        
        {/* Goethe B1 Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              <h3 className="font-bold text-purple-600">Goethe B1</h3>
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1IDMiPjxwYXRoIGQ9Ik0wIDBoNXYxSDB6IiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTAgMWg1djFIMHoiIGZpbGw9IiNmMDAiLz48cGF0aCBkPSJNMCAyaDV2MUgweiIgZmlsbD0iI2ZmY2UwMCIvPjwvc3ZnPg==" className="ml-2 w-6 h-4" alt="German Flag" />
            </div>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium py-1 px-2 rounded">Exam Prep</span>
          </div>
          <div className="p-4 flex-grow">
            <p className="font-bold mb-2">10 Full Length Mock Test</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Complete B1 Syllabus</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Writing, Speaking, Reading, Listening</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>AI Grading - Writing and Speaking</span>
              </li>
            </ul>
          </div>
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-purple-600 font-bold">₹ 499/course</div>
            </div>
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded transition duration-200">
              Select Course
            </button>
          </div>
        </div>
        
        {/* TELC B2 Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              <h3 className="font-bold text-blue-600">TELC B2</h3>
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MDAgNjAwIj48cGF0aCBmaWxsPSIjZWQyOTM5IiBkPSJNMCAwaDkwMHY2MDBIMHoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAyMDBoOTAwdjIwMEgweiIvPjwvc3ZnPg==" className="ml-2 w-6 h-4" alt="Austrian Flag" />
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">Live Online</span>
          </div>
          <div className="p-4 flex-grow">
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Complete B2 Syllabus</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Advance Speaking</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Complex Writing</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-700 mr-2">•</span>
                <span>Mock Test</span>
              </li>
            </ul>
          </div>
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-blue-600 font-bold">₹ 499/course</div>
            </div>
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded transition duration-200">
              Select Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSection;