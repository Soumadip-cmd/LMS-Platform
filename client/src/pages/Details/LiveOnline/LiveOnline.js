import React from 'react';
import { Check, Download, MessageSquare, Users, Shield, MessageCircle, Clipboard, UserPlus, Video } from 'lucide-react';

const LiveOnline = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gray-300 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm"><span className="text-blue-600 font-medium">Next batch starts:</span> <span className="text-gray-700">May 15, 2024 | 8PM IST</span></p>
          </div>
          <button className="flex items-center text-sm text-slate-700 bg-gray-400 hover:bg-gray-500 hover:text-slate-200 px-3 py-1.5 rounded transition-colors">
            <Download className="h-4 w-4 mr-1" />
            Download Syllabus
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Course Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-blue-600">Goethe-B1 Course</span> | <span className="text-red-600">Live Online</span>
            </h1>
            <p className="text-gray-600 mt-2">Master B1-Level German with 3-month intensive program with live interactive classes</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-center md:items-end w-full md:w-auto">
            <div className="flex items-center">
              <p className="text-2xl font-bold">₹ 15,999</p>
              <p className="ml-2 text-red-500 line-through">₹ 21,999</p>
            </div>
            <button className="mt-2 w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition">Enroll</button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Key Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4 shadow-sm">
                    <MessageSquare className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Live Interactive Sessions</h3>
                    <p className="text-gray-600 text-sm">5 sessions per week, 60 minutes each.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4 shadow-sm">
                    <Users className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Small Group Size</h3>
                    <p className="text-gray-600 text-sm">Maximum 5-8 students per class</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4 shadow-sm">
                    <Shield className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Exam Preparation</h3>
                    <p className="text-gray-600 text-sm">Tailored for Goethe B1 certification</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4">Interactive Features</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4 shadow-sm">
                    <MessageCircle className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Live Q&A Sessions</h3>
                    <p className="text-gray-600 text-sm">Weekly discussion forums and doubt-clearing sessions</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4 shadow-sm">
                    <Clipboard className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Real-time Feedback</h3>
                    <p className="text-gray-600 text-sm">Instant assessment and personalized recommendations</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4 shadow-sm">
                    <UserPlus className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Community Access</h3>
                    <p className="text-gray-600 text-sm">Join study groups and practice with peers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4">What You'll Learn</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Language Skills</h3>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-gray-500" />
                      </div>
                      <span>Speaking & Pronunciation</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-gray-500" />
                      </div>
                      <span>Writing & Grammar</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-gray-500" />
                      </div>
                      <span>Listening Comprehension</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-gray-500" />
                      </div>
                      <span>Reading & Vocabulary</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Exam Preparation</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-gray-500" />
                      </div>
                      <span>Test Strategies</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-gray-500" />
                      </div>
                      <span>Practice Exams</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-gray-500" />
                      </div>
                      <span>Time Management</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-gray-500" />
                      </div>
                      <span>Error Analysis</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Middle and Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Conference Image */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src="/api/placeholder/800/450" 
                  alt="Online German class in session" 
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Course Info Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Includes */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold mb-4">Course Includes</h2>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="bg-yellow-100 rounded-full p-1 mr-3 shadow-sm">
                      <Check className="h-5 w-5 text-yellow-500" />
                    </div>
                    <span>75 Live Sessions</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-yellow-100 rounded-full p-1 mr-3">
                      <Check className="h-5 w-5 text-yellow-500" />
                    </div>
                    <span>Practice Materials</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-yellow-100 rounded-full p-1 mr-3">
                      <Check className="h-5 w-5 text-yellow-500" />
                    </div>
                    <span>10 Mock Exams</span>
                  </li>
                </ul>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold mb-4">Requirements</h2>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="bg-amber-100 rounded-full p-1 mr-3 shadow-sm">
                      <Check className="h-5 w-5 text-amber-500" />
                    </div>
                    <span>A2 level German</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-amber-100 rounded-full p-1 mr-3">
                      <Check className="h-5 w-5 text-amber-500" />
                    </div>
                    <span>Stable Internet</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-amber-100 rounded-full p-1 mr-3">
                      <Check className="h-5 w-5 text-amber-500" />
                    </div>
                    <span>Webcam and Mic</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Course Delivery */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4">Course Delivery</h2>
              <div className="flex items-start">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Live via Zoom & Preplings Platform</h3>
                  <p className="text-gray-600 text-sm">Interactive sessions with screen sharing and breakout rooms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveOnline;