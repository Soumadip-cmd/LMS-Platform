import React from 'react';
import { Link } from 'react-router-dom';

const CourseType = () => {
  return (
    <div className="bg-gray-50  p-6 md:p-8 ">
      <div className="m-2 lg:mx-4 xl:mx-12  ">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">
            <span className="flex items-center">
              Learn German with Us <img src="https://placehold.co/40x40" alt='german flag' className="ml-2" />
            </span>
          </h1>
          <p className="text-gray-500">Get started with our comprehensive German language course packages tailored for self-paced learning and exam preparation</p>
        </header>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4 md:gap-6">
          
          {/* General Practice Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold whitespace-nowrap">General Practice</h2>
              <span className="bg-[#BAFFCC] text-[#00562E] text-xs px-2 py-1 rounded">Self-Paced</span>
            </div>
            
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Comprehensive Reading Practice</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Writing Exercises & Feedback</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Interactive Speaking Sessions</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Extensive Grammar Drills</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Audio-based Listening Practice</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Vocabulary Building</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Progress Tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Practice Tests for Each Section</span>
              </li>
            </ul>
            
            <div className="flex-grow"></div>
            
            <div className="mt-4 mb-4">
              <div className="flex items-center">
                <span className="text-green-600 font-semibold">₹</span>
                <span className="text-lg font-bold text-green-600 ml-1">499</span>
                <span className="text-sm text-green-600">/month</span>
              </div>
            </div>
            
            <Link to="/general-practice" className="w-full block">
              <button className="w-full bg-[#FFB71C] hover:bg-[#efa912] text-center py-3 rounded-xl font-medium transition-colors text-white hover:text-[#0D47A1]">
                Enroll
              </button>
            </Link>
          </div>
          
          {/* Exam Preparation Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold whitespace-nowrap">Exam Preparation</h2>
              <span className="bg-[#DABEFF] text-[#6F00FF] text-xs px-2 py-1 rounded">Structured</span>
            </div>
            
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">TELC Certification</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Goethe Institut Certification</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">TestDaF Certification</span>
              </li>
            </ul>
            
            <div className="flex-grow"></div>
            
            <Link to="/exam-preparation" className="w-full block">
              <button className="w-full bg-[#FFB71C] hover:bg-[#efa912] text-center py-3 rounded-xl font-medium transition-colors text-white hover:text-[#0D47A1] mt-4">
                Choose Your exam
              </button>
            </Link>
          </div>
          
          {/* Live Courses Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold whitespace-nowrap">Live Courses</h2>
              <span className="bg-[#BAFFCC] text-[#00562E] text-xs px-2 py-1 rounded">Interactive</span>
            </div>
            
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Live Interactive Sessions</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Real-time Doubt Clearing</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Group Activities</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Personalized Feedback</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Weekly Assignments</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Live Speaking Practice</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Cultural Workshops</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Flexible Timings</span>
              </li>
            </ul>
            
            <div className="flex-grow"></div>
            
            <Link to="/live-courses" className="w-full block">
              <button className="w-full bg-[#FFB71C] hover:bg-[#efa912] text-center py-3 rounded-xl font-medium transition-colors text-white hover:text-[#0D47A1] mt-4">
                Join Live Classes
              </button>
            </Link>
          </div>
          
          {/* Recorded Courses Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold whitespace-nowrap">Recorded Courses</h2>
              <span className="bg-[#FFE6B0] text-[#996900] text-xs px-2 py-1 rounded">Flexible</span>
            </div>
            
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Pre-recorded Lessons</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">24/7 Access</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Downloadable Materials</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Self-paced Learning</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Lifetime Access</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Regular Updates</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Mobile Friendly</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Study Guides</span>
              </li>
            </ul>
            
            <div className="flex-grow"></div>
            
            <Link to="/recorded-courses" className="w-full block">
              <button className="w-full bg-[#FFB71C] hover:bg-yellow-500 text-center py-3 rounded-xl font-medium transition-colors text-white hover:text-[#0D47A1] mt-4">
                Select Course
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseType;