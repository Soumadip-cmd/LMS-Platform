import React, { useState } from "react";
import {
  Star,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const RecordedClass = () => {
  const [expandedSections, setExpandedSections] = useState({
    "Project Introduction": true,
    "Project Setup and configuration": true, // Changed to true
    "Tailwind Setup": false,
    "Frontend Project": false,
    "Backend Project": false,
    "Payment Integration": false,
    "Project Deployement": false,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const location = useLocation();
  
  

  // Function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="m-2 lg:mx-4 xl:mx-12 lg:ml-10 xl:ml-20  text-gray-800">
      {/* Breadcrumb Navigation */}
      <div className="py-4 px-4 lg:py-12 md:py-7 text-sm text-gray-600">
         <p>
          <Link 
            to="/" 
            className={`cursor-pointer hover:underline ${isActive('/') ? 'text-blue-500' : ''}`}
          >
            Home
          </Link> / 
          <Link 
            to="/courses" 
            className={`cursor-pointer hover:underline ${isActive('/courses') ? 'text-blue-500' : ''}`}
          >
            Courses
          </Link> / 
          <span> German / Goethe / A1 </span>
          <span 
            
            className={`cursor-pointer hover:underline text-blue-500`}
          >
           
           / 
          Ace your German Goethe B1 exam in 30 days</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 px-4">
        {/* Left Column - Course Info */}
        <div className="lg:w-[60%]">
        <section className=" xl:w-[85%]">
          <h1 className="text-2xl md:text-3xl lg:text-[2.8rem]/[3rem]  font-semibold text-blue-500 mb-4">
            Ace your German Goethe B1 exam in 30 Days
          </h1>

          <p className="mb-4 text-gray-600">
            Master MERN Stack by building a Full Stack AI Text to Image SaaS App
            using React.js, MongoDB, Node.js, Express.js and Stripe Payment
          </p>
          <div className="">
          {/* Rating and Enrollment */}
          <div className="flex items-start md:items-center flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center">
              <span className="font-bold mr-2">4.5</span>
              <div className="flex">
                {[1, 2, 3, 4].map((i) => (
                  <Star key={i} size={16} fill="#FFA500" color="#FFA500" />
                ))}
                <Star
                  size={16}
                  fill="#FFA500"
                  color="#FFA500"
                  className="opacity-30"
                />
              </div>
              <span className="text-sm text-blue-500 ml-2">(122 ratings)</span>
            </div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="size-6" fill="#6B7280">
                <g data-name="user people person users man" id="user_people_person_users_man">
                  <path d="M23.74,16.18a1,1,0,1,0-1.41,1.42A9,9,0,0,1,25,24c0,1.22-3.51,3-9,3s-9-1.78-9-3a9,9,0,0,1,2.63-6.37,1,1,0,0,0,0-1.41,1,1,0,0,0-1.41,0A10.92,10.92,0,0,0,5,24c0,3.25,5.67,5,11,5s11-1.75,11-5A10.94,10.94,0,0,0,23.74,16.18Z"/>
                  <path d="M16,17a7,7,0,1,0-7-7A7,7,0,0,0,16,17ZM16,5a5,5,0,1,1-5,5A5,5,0,0,1,16,5Z"/>
                </g>
              </svg>
              <span className="text-sm text-gray-600">21 students Enrolled</span>
            </div>
          </div>

          {/* Course Creator and Update Date */}
          <div className="mb-6 flex flex-col md:flex-row items-start md:items-center">
  <p className="text-sm text-gray-600 flex flex-col md:flex-row md:items-center">
    <span className="mb-2 md:mb-0">
      Course by <span className="text-blue-500 underline">Richard James</span>
    </span>
    <span className="md:ml-8 text-gray-600">
      Last Update : <span className="text-blue-500">November 25, 2020</span>
    </span>
  </p>
</div>
          </div>
      </section>
          {/* Course Description */}
          <div className="mb-8 md:mb-9 md:mt-16">
            <h2 className="text-xl font-semibold text-blue-500 mb-4">
              Course Description
            </h2>
            <p className="mb-4 text-gray-600">
              This is the most comprehensive and in-depth JavaScript course with
              30 JavaScript projects.
            </p>
            <p className="mb-4 text-gray-600">
              JavaScript is currently the most popular programming language in
              the world. If you are an aspiring web developer or full stack
              developer, JavaScript is a must to learn. It also helps you to get
              high-paying jobs all over the world.
            </p>
            <p className="mb-4 text-gray-600">
              The Ultimate Photography Course will show you how to take advanced
              photos that will stand out as professional work and break down
              camera tech into easy to follow lectures. This course will enhance
              or give you skills in the world of photography - or your money
              back! The course is your track to obtaining Photography skills
              like you always knew you should have! Whether for your own
              projects or to start a career. This course will take you from
              having little knowledge in photography to taking advanced photos
              and having a deep understanding of camera fundamentals.
            </p>
          </div>

          {/* Course Structure */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue-500 mb-4">
              Course Structure
            </h2>
            <p className="mb-4">
              22 sections | 54 lectures | 27h 25m Total Duration
            </p>

            {/* Section 1 */}
            <div className="border rounded-md mb-2">
              <div
                className="flex justify-between items-center p-3 cursor-pointer bg-[#F7F9FD] border border-[#E3E3E3]"
                onClick={() => toggleSection("Project Introduction")}
              >
                <div className="flex items-center gap-2">
                  {expandedSections["Project Introduction"] ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                  <span className="font-semibold">Project Introduction</span>
                </div>
                <span className="text-sm">3 lectures - 45 m</span>
              </div>

              {expandedSections["Project Introduction"] && (
                <div className="px-8 pb-3">
                  <div className="flex items-center gap-2 p-2 cursor-pointer">
                    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
                      <g data-name="Layer 2" id="Layer_2">
                        <g id="Interface-Solid">
                          <g id="interface-solid-multimedia-play-button">
                            <path d="M15.6922,11.59473l-1.943-1.3562a1,1,0,0,0-1.57239.82006v7.88282a1,1,0,0,0,1.57239.82006l1.943-1.3562,3.70343-2.58545a.99989.99989,0,0,0,0-1.63989Z" fill="none"/>
                            <path d="M15,0A15,15,0,1,0,30,15,15.01672,15.01672,0,0,0,15,0Zm4.39563,15.81982L15.6922,18.40527l-1.943,1.3562a1,1,0,0,1-1.57239-.82006V11.05859a1,1,0,0,1,1.57239-.82006l1.943,1.3562,3.70343,2.5852A.99989.99989,0,0,1,19.39563,15.81982Z" fill="#6B7280"/>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <span><span className="numbers">1.</span> App Overview – Build Text-to-Image SaaS</span>
                    <span className="ml-auto text-sm text-gray-500">
                      10 mins
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 cursor-pointer">
                    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
                      <g data-name="Layer 2" id="Layer_2">
                        <g id="Interface-Solid">
                          <g id="interface-solid-multimedia-play-button">
                            <path d="M15.6922,11.59473l-1.943-1.3562a1,1,0,0,0-1.57239.82006v7.88282a1,1,0,0,0,1.57239.82006l1.943-1.3562,3.70343-2.58545a.99989.99989,0,0,0,0-1.63989Z" fill="none"/>
                            <path d="M15,0A15,15,0,1,0,30,15,15.01672,15.01672,0,0,0,15,0Zm4.39563,15.81982L15.6922,18.40527l-1.943,1.3562a1,1,0,0,1-1.57239-.82006V11.05859a1,1,0,0,1,1.57239-.82006l1.943,1.3562,3.70343,2.5852A.99989.99989,0,0,1,19.39563,15.81982Z" fill="#6B7280"/>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <span><span className="numbers">2.</span> Tech Stack – React, Node.js, MongoDB</span>
                    <span className="ml-auto text-sm text-gray-500">
                      15 mins
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 cursor-pointer">
                    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
                      <g data-name="Layer 2" id="Layer_2">
                        <g id="Interface-Solid">
                          <g id="interface-solid-multimedia-play-button">
                            <path d="M15.6922,11.59473l-1.943-1.3562a1,1,0,0,0-1.57239.82006v7.88282a1,1,0,0,0,1.57239.82006l1.943-1.3562,3.70343-2.58545a.99989.99989,0,0,0,0-1.63989Z" fill="none"/>
                            <path d="M15,0A15,15,0,1,0,30,15,15.01672,15.01672,0,0,0,15,0Zm4.39563,15.81982L15.6922,18.40527l-1.943,1.3562a1,1,0,0,1-1.57239-.82006V11.05859a1,1,0,0,1,1.57239-.82006l1.943,1.3562,3.70343,2.5852A.99989.99989,0,0,1,19.39563,15.81982Z" fill="#6B7280"/>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <span><span className="numbers">3.</span> Core Features – Authentication, payment, deployment</span>
                    <span className="ml-auto text-sm text-gray-500">
                      20 mins
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2 */}
            <div className="border rounded-md mb-2">
              <div
                className="flex justify-between items-center p-3 cursor-pointer bg-[#F7F9FD] border border-[#E3E3E3]"
                onClick={() => toggleSection("Project Setup and configuration")}
              >
                <div className="flex items-center gap-2">
                  {expandedSections["Project Setup and configuration"] ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                  <span className="font-semibold">
                    Project Setup and configuration
                  </span>
                </div>
                <span className="text-sm">4 lectures - 45 m</span>
              </div>

              {expandedSections["Project Setup and configuration"] && (
                <div className="px-8 pb-3">
                  <div className="flex items-center gap-2 p-2 cursor-pointer">
                    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
                      <g data-name="Layer 2" id="Layer_2">
                        <g id="Interface-Solid">
                          <g id="interface-solid-multimedia-play-button">
                            <path d="M15.6922,11.59473l-1.943-1.3562a1,1,0,0,0-1.57239.82006v7.88282a1,1,0,0,0,1.57239.82006l1.943-1.3562,3.70343-2.58545a.99989.99989,0,0,0,0-1.63989Z" fill="none"/>
                            <path d="M15,0A15,15,0,1,0,30,15,15.01672,15.01672,0,0,0,15,0Zm4.39563,15.81982L15.6922,18.40527l-1.943,1.3562a1,1,0,0,1-1.57239-.82006V11.05859a1,1,0,0,1,1.57239-.82006l1.943,1.3562,3.70343,2.5852A.99989.99989,0,0,1,19.39563,15.81982Z" fill="#6B7280"/>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <span><span className="numbers">1.</span> Environment Setup – Install Node.js, VS Code</span>
                    <span className="ml-auto text-sm text-gray-500">
                      10 mins
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 cursor-pointer">
                    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
                      <g data-name="Layer 2" id="Layer_2">
                        <g id="Interface-Solid">
                          <g id="interface-solid-multimedia-play-button">
                            <path d="M15.6922,11.59473l-1.943-1.3562a1,1,0,0,0-1.57239.82006v7.88282a1,1,0,0,0,1.57239.82006l1.943-1.3562,3.70343-2.58545a.99989.99989,0,0,0,0-1.63989Z" fill="none"/>
                            <path d="M15,0A15,15,0,1,0,30,15,15.01672,15.01672,0,0,0,15,0Zm4.39563,15.81982L15.6922,18.40527l-1.943,1.3562a1,1,0,0,1-1.57239-.82006V11.05859a1,1,0,0,1,1.57239-.82006l1.943,1.3562,3.70343,2.5852A.99989.99989,0,0,1,19.39563,15.81982Z" fill="#6B7280"/>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <span><span className="numbers">2.</span> Repository Setup – Clone project repository</span>
                    <span className="ml-auto text-sm text-gray-500">
                      10 mins
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 cursor-pointer">
                    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
                      <g data-name="Layer 2" id="Layer_2">
                        <g id="Interface-Solid">
                          <g id="interface-solid-multimedia-play-button">
                            <path d="M15.6922,11.59473l-1.943-1.3562a1,1,0,0,0-1.57239.82006v7.88282a1,1,0,0,0,1.57239.82006l1.943-1.3562,3.70343-2.58545a.99989.99989,0,0,0,0-1.63989Z" fill="none"/>
                            <path d="M15,0A15,15,0,1,0,30,15,15.01672,15.01672,0,0,0,15,0Zm4.39563,15.81982L15.6922,18.40527l-1.943,1.3562a1,1,0,0,1-1.57239-.82006V11.05859a1,1,0,0,1,1.57239-.82006l1.943,1.3562,3.70343,2.5852A.99989.99989,0,0,1,19.39563,15.81982Z" fill="#6B7280"/>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <span><span className="numbers">3.</span> Install Dependencies – Set up npm packages</span>
                    <span className="ml-auto text-sm text-gray-500">
                      10 mins
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 cursor-pointer">
                    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
                      <g data-name="Layer 2" id="Layer_2">
                        <g id="Interface-Solid">
                          <g id="interface-solid-multimedia-play-button">
                            <path d="M15.6922,11.59473l-1.943-1.3562a1,1,0,0,0-1.57239.82006v7.88282a1,1,0,0,0,1.57239.82006l1.943-1.3562,3.70343-2.58545a.99989.99989,0,0,0,0-1.63989Z" fill="none"/>
                            <path d="M15,0A15,15,0,1,0,30,15,15.01672,15.01672,0,0,0,15,0Zm4.39563,15.81982L15.6922,18.40527l-1.943,1.3562a1,1,0,0,1-1.57239-.82006V11.05859a1,1,0,0,1,1.57239-.82006l1.943,1.3562,3.70343,2.5852A.99989.99989,0,0,1,19.39563,15.81982Z" fill="#6B7280"/>
                          </g>
                        </g>
                      </g>
                    </svg>
                    <span><span className="numbers">4.</span> Initial Configuration – Set up basic files and folders</span>
                    <span className="ml-auto text-sm text-gray-500">
                      15 mins
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* More sections - collapsed by default */}
            {[
              "Tailwind Setup",
              "Frontend Project",
              "Backend Project",
              "Payment Integration",
              "Project Deployement",
            ].map((section) => (
              <div key={section} className="border rounded-md mb-2">
                <div
                  className="flex justify-between items-center p-3 cursor-pointer bg-[#F7F9FD] border border-[#E3E3E3]"
                  onClick={() => toggleSection(section)}
                >
                  <div className="flex items-center gap-2">
                    {expandedSections[section] ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                    <span className="font-semibold">{section}</span>
                  </div>
                  <span className="text-sm">4 lectures - 45 m</span>
                </div>

                {expandedSections[section] && (
                  <div className="px-8 pb-3">
                    <div className="flex items-center gap-2 p-2 cursor-pointer">
                      <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
                        <g data-name="Layer 2" id="Layer_2">
                          <g id="Interface-Solid">
                            <g id="interface-solid-multimedia-play-button">
                              <path d="M15.6922,11.59473l-1.943-1.3562a1,1,0,0,0-1.57239.82006v7.88282a1,1,0,0,0,1.57239.82006l1.943-1.3562,3.70343-2.58545a.99989.99989,0,0,0,0-1.63989Z" fill="none"/>
                              <path d="M15,0A15,15,0,1,0,30,15,15.01672,15.01672,0,0,0,15,0Zm4.39563,15.81982L15.6922,18.40527l-1.943,1.3562a1,1,0,0,1-1.57239-.82006V11.05859a1,1,0,0,1,1.57239-.82006l1.943,1.3562,3.70343,2.5852A.99989.99989,0,0,1,19.39563,15.81982Z" fill="#6B7280"/>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <span><span className="numbers">1.</span> Example lecture for {section}</span>
                      <span className="ml-auto text-sm text-gray-500">
                        10 mins
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 cursor-pointer">
                      <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
                        <g data-name="Layer 2" id="Layer_2">
                          <g id="Interface-Solid">
                            <g id="interface-solid-multimedia-play-button">
                              <path d="M15.6922,11.59473l-1.943-1.3562a1,1,0,0,0-1.57239.82006v7.88282a1,1,0,0,0,1.57239.82006l1.943-1.3562,3.70343-2.58545a.99989.99989,0,0,0,0-1.63989Z" fill="none"/>
                              <path d="M15,0A15,15,0,1,0,30,15,15.01672,15.01672,0,0,0,15,0Zm4.39563,15.81982L15.6922,18.40527l-1.943,1.3562a1,1,0,0,1-1.57239-.82006V11.05859a1,1,0,0,1,1.57239-.82006l1.943,1.3562,3.70343,2.5852A.99989.99989,0,0,1,19.39563,15.81982Z" fill="#6B7280"/>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <span><span className="numbers">2.</span> Additional content for {section}</span>
                      <span className="ml-auto text-sm text-gray-500">
                        15 mins
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Course Details and Purchase */}
        <div className="lg:w-[40%]">
          {/* Course Card */}
          <div className="border rounded-lg overflow-hidden shadow-md mb-6">
            {/* Course Image */}
            <div className="relative">
              <img
                src={`${process.env.PUBLIC_URL}/assets/FeaturedCourses/recorded-cls-thumbnail.png`}
                alt="Text to Image SAAS App"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Pricing */}
            <div className="bg-white p-4">
              <div className="flex items-center text-red-600 mb-2">
                <Clock size={16} className="mr-1" />
                <span className="mr-2"><span className="font-semibold">5 days</span> left at this price!</span>
                <span className="bg-green-100 text-green-800 font-semibold px-2 rounded ml-auto">
                  50% off
                </span>
              </div>

              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold">₹ 15,999</span>
                <span className="text-red-600 text-base line-through ml-6 font-semibold">
                  ₹ 21,999
                </span>
              </div>

              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center">
                  <Star fill="#FFA500" color="#FFA500" size={16} />
                  <span className="ml-1">4.5</span>
                </div>
                <span className="text-gray-400">|</span>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-600"/>
                  <span className="ml-1 text-gray-600">30 hours</span>
                </div>
                <span className="text-gray-400">|</span>
                <div className="flex items-center space-x-2">
                  <BookOpen size={16} className="text-gray-600" />
                  <span className="ml-1 text-gray-600">54 lessons</span>
                </div>
              </div>

              <button className="w-full bg-yellow-500 hover:bg-yellow-400 hover:text-[#0D47A1] text-white py-3 rounded-md font-semibold mb-4">
                Enroll Now
              </button>

              <div>
                <h4 className="text-base font-semibold text-blue-500 mb-4 px-2">
                  What's in the course?
                </h4>
                <ul className="space-y-2 px-4">
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span className="text-gray-600">Lifetime access with free updates.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span className="text-gray-600">Step-by-step, hands-on project guidance.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span className="text-gray-600">Downloadable resources and source code.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span className="text-gray-600">Quizzes to test your knowledge.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span className="text-gray-600">Certificate of completion.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span className="text-gray-600">Quizzes to test your knowledge.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Instructor Card - Separate from main course card */}
          <div className="border rounded-lg overflow-hidden shadow-md">
            <div className="bg-white p-4">
              <h4 className="text-base font-semibold text-blue-500 mb-4 md:mb-6">
                Your Instructor
              </h4>
              <div className="grid grid-cols-1 sm:flex sm:items-start gap-3">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/FeaturedCourses/instructor-profile.png`}
                  alt="Richard James"
                  className="w-full max-w-[120px] sm:max-w-[180px] lg:max-w-[248px] h-auto aspect-square rounded-md object-cover mx-auto sm:mx-0"
                />
                <div>
                  <h5 className="font-semibold text-center sm:text-left">
                    Richard James
                  </h5>
                  <div className="flex items-center text-sm mb-1 justify-center sm:justify-start">
                    <span className="font-bold">4.47</span>
                    <span className="text-gray-500">/5</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Over the course of his career, he has developed a skill
                    set in analyzing data and he hopes to use his experience
                    in teaching and data science to help other people learn
                    the power of programming the ability to analyze data.
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

export default RecordedClass;