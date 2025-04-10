import React from "react";
import {
  Check,
  Download,
  MessageSquare,
  Users,
  Shield,
  MessageCircle,
  Clipboard,
  UserPlus,
  Video,
  Settings,
  Laptop,
} from "lucide-react";

const LiveOnline = () => {
  const customShadow = {
    boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
  };

  return (
    <div className="">
      {/* Header Banner */}
      <div className="bg-transparent m-2"></div>
      <div className="bg-gray-300 px-4 mt-5 md:mt-0" >
        <div className="lg:mx-4 xl:mx-12 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <p className="text-sm md:text-base  py-3 font-semibold">
              <span className="text-blue-600 ">
                Next batch starts:
              </span>{" "}
              <span className="text-gray-500">May <span className="numbers">15</span>, <span className="numbers">2024</span> | <span className="numbers">8</span>PM IST</span>
            </p>
          </div>
          <button className="flex items-center text-sm text-slate-700 bg-gray-400 hover:bg-gray-500 font-semibold hover:text-slate-200 px-3  rounded transition-colors mt-2 md:mt-0 py-2 w-full md:w-auto justify-center md:justify-normal mb-3 md:mb-0">
            <Download className="h-4 w-4 mr-1" />
            Download Syllabus
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="m-2 lg:mx-4 xl:mx-12 px-4 py-8">
        {/* Course Title Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-centern mt-5 mb-9 md:mt-8 md:mb-[4.5rem]">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-semibold">
              <span className="text-blue-600">Goethe-B1 Course</span> <span className="text-gray-400">|</span>{" "}
              <span className="text-red-600">Live Online</span>
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Master B1-Level German with 3-month intensive program with live
              interactive classes
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-col items-start lg:items-end w-full lg:w-auto lg:flex-row lg:gap-7">
            <div className="flex items-center lg:flex-col">
              <p className="text-xl md:text-2xl font-bold numbers">₹ 15,999</p>
              <p className="ml-2 text-lg md:text-xl text-red-500 font-bold line-through  numbers">
                ₹ 21,999
              </p>
            </div>
            <button className="mt-4 lg:mt-2 w-full lg:w-auto bg-blue-600 text-white px-6 py-2 md:py-3 lg:px-6 lg:py-5 rounded-md md:text-2xl font-medium hover:bg-blue-700 transition">
              Enroll
            </button>
          </div>
        </div>

        {/* Main Content using Flexbox instead of Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="lg:w-[55%] space-y-6 ">
            {/* Key Features */}
            <div className="bg-white rounded-lg p-6 md:px-6 md:py-8" style={customShadow}>
              <div className="space-y-4 md:space-y-8">
                <div className="flex items-start">
                  <div className="bg-[#FFBE33] p-3 md:py-2 md:px-3 rounded-md mr-4">
                    <Video className=" size-6 md:size-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium md:text-xl mb-0.5">Live Interactive Sessions</h3>
                    <p className="text-gray-600 text-sm">
                      <span className="numbers">5</span> sessions per week, <span className="numbers">60</span> minutes each.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#FFBE33] p-3 md:py-2 md:px-3 rounded-md mr-4">
                    <Users className=" size-6 md:size-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium md:text-xl mb-0.5">Small Group Size</h3>
                    <p className="text-gray-600 text-sm">
                      Maximum <span className="numbers">5-8</span> students per class
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#FFBE33] p-3 md:py-2 md:px-3 rounded-md mr-4">
                    <Settings className=" size-6 md:size-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium md:text-xl mb-0.5">Exam Preparation</h3>
                    <p className="text-gray-600 text-sm">
                      Tailored for Goethe B1 certification
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Features */}
            <div className="bg-white rounded-lg p-6 md:px-6 md:py-8" style={customShadow}>
              <h2 className="text-xl font-semibold mb-4 md:mb-7">Interactive Features</h2>
              <div className="space-y-4 md:space-y-8">
                <div className="flex items-start">
                  <div className="bg-[#FFBE33] p-3 md:py-2 md:px-3 rounded-md mr-4">
                    <MessageCircle className=" size-6 md:size-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium md:text-xl mb-0.5">Live Q&A Sessions</h3>
                    <p className="text-gray-600 text-sm">
                      Weekly discussion forums and doubt-clearing sessions
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#FFBE33] p-3 md:py-2 md:px-3 rounded-md mr-4">
                    <Clipboard className=" size-6 md:size-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium md:text-xl mb-0.5">Real-time Feedback</h3>
                    <p className="text-gray-600 text-sm">
                      Instant assessment and personalized recommendations
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#FFBE33] p-3 md:py-2 md:px-3 rounded-md mr-4">
                    <UserPlus className=" size-6 md:size-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium md:text-xl mb-0.5">Community Access</h3>
                    <p className="text-gray-600 text-sm">
                      Join study groups and practice with peers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-lg p-6 md:px-6 md:py-8" style={customShadow}>
              <h2 className="text-xl font-semibold  mb-4">What You'll Learn</h2>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="font-medium mb-4 text-lg md:text-xl">Language Skills</h3>
                  <ul className="space-y-2 md:space-y-3 mb-4">
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border-2 border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 stroke-[4] text-gray-500" />
                      </div>
                      <span>Speaking & Pronunciation</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border-2 border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 stroke-[4] text-gray-500" />
                      </div>
                      <span>Writing & Grammar</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border-2 border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 stroke-[4] text-gray-500" />
                      </div>
                      <span>Listening Comprehension</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border-2 border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 stroke-[4] text-gray-500" />
                      </div>
                      <span>Reading & Vocabulary</span>
                    </li>
                  </ul>
                </div>

                <div className="flex-1">
                  <h3 className="font-medium mb-4 text-lg md:text-xl">Exam Preparation</h3>
                  <ul className="space-y-2 md:space-y-3">
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border-2 border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 stroke-[4] text-gray-500" />
                      </div>
                      <span>Test Strategies</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border-2 border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 stroke-[4] text-gray-500" />
                      </div>
                      <span>Practice Exams</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border-2 border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 stroke-[4] text-gray-500" />
                      </div>
                      <span>Time Management</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-5 w-5 mr-2 rounded-full border-2 border-gray-500 flex items-center justify-center">
                        <Check className="h-3 w-3 stroke-[4] text-gray-500" />
                      </div>
                      <span>Error Analysis</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Middle and Right Column */}
          <div className="lg:w-3/5 space-y-6">
            {/* Video Conference Image - No background/shadow */}
            <div className="">
              <div className="flex justify-center">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/FeaturedCourses/live-online-img.png`}
                  alt="Online German class in session"
                  className="rounded-lg w-auto h-auto"
                />
              </div>
            </div>

            {/* Course Info Boxes */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Course Includes */}
              <div className="bg-white rounded-lg p-6 flex-1" style={customShadow}>
                <h2 className="text-xl font-semibold mb-4">Course Includes</h2>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="bg-white border-[3px] border-[#FFBE33] rounded-full p-1 mr-3">
                      <Check className="h-5 w-5 stroke-[3] text-[#FFBE33]" />
                    </div>
                    <span><span className="numbers">75</span> Live Sessions</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-white border-[3px] border-[#FFBE33] rounded-full p-1 mr-3">
                      <Check className="h-5 w-5 stroke-[3] text-[#FFBE33]" />
                    </div>
                    <span>Practice Materials</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-white border-[3px] border-[#FFBE33] rounded-full p-1 mr-3">
                      <Check className="h-5 w-5 stroke-[3] text-[#FFBE33]" />
                    </div>
                    <span><span className="numbers">10</span> Mock Exams</span>
                  </li>
                </ul>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-lg p-6 flex-1" style={customShadow}>
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="bg-white border-[2px] border-[#FFBE33] rounded-full p-1 mr-3">
                      <svg
                        className="h-5 w-5 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704l1.323-6.208Zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0Z" />
                      </svg>
                    </div>
                    <span>A<span className="numbers">2</span> level German</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-white border-[2px] border-[#FFBE33] rounded-full p-1 mr-3">
                      <svg
                        className="h-5 w-5 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704l1.323-6.208Zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0Z" />
                      </svg>
                    </div>
                    <span>Stable Internet</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-white border-[2px] border-[#FFBE33] rounded-full p-1 mr-3">
                      <svg
                        className="h-5 w-5 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704l1.323-6.208Zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0Z" />
                      </svg>
                    </div>
                    <span>Webcam and Mic</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Course Delivery */}
            <div className="bg-white rounded-lg p-6 md:pb-10" style={customShadow}>
              <h2 className="text-xl font-semibold mb-4">Course Delivery</h2>
              <div className="flex items-start">
                <div className="bg-[#FFBE33] p-3  md:py-2 md:px-2 rounded-md mr-4">
                  <Laptop className="size-6 md:size-12 text-white" />
                </div>
                <div className="md:mt-[3px]">
                  <h3 className="font-medium md:text-xl mb-0.5">
                    Live via Zoom & Preplings Platform
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Interactive sessions with screen sharing and breakout rooms
                  </p>
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