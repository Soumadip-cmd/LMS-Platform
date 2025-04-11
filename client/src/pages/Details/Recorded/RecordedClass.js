import React, { useState } from "react";
import {
  Star,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Play,
} from "lucide-react";

const RecordedClass = () => {
  const [expandedSections, setExpandedSections] = useState({
    "Project Introduction": true,
    "Project Setup and configuration": false,
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

  return (
    <div className="m-2 lg:mx-4 xl:mx-12  font-sans text-gray-800">
      {/* Breadcrumb Navigation */}
      <div className="py-4 px-4 text-sm text-gray-600">
        <p>
          Home / Courses / German / Goethe / A1 / Ace your German Goethe B1 exam
          in 30 days
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 px-4">
        {/* Left Column - Course Info */}
        <div className="lg:w-8/12">
          <h1 className="text-4xl font-bold text-blue-500 mb-4">
            Ace your German Goethe B1 exam in 30 Days
          </h1>

          <p className="mb-4">
            Master MERN Stack by building a Full Stack AI Text to Image SaaS App
            using React.js, MongoDB, Node.js, Express.js and Stripe Payment
          </p>

          {/* Rating and Enrollment */}
          <div className="flex items-center gap-4 mb-6">
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
              <span className="text-sm text-gray-500 ml-2">(122 ratings)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">21 students Enrolled</span>
            </div>
          </div>

          {/* Course Creator and Update Date */}
          <div className="mb-6">
            <p className="text-sm">
              Course by <span className="text-blue-500">Richard James</span>
              <span className="ml-8">Last Update : November 25, 2020</span>
            </p>
          </div>

          {/* Course Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-500 mb-4">
              Course Description
            </h2>
            <p className="mb-4">
              This is the most comprehensive and in-depth JavaScript course with
              30 JavaScript projects.
            </p>
            <p className="mb-4">
              JavaScript is currently the most popular programming language in
              the world. If you are an aspiring web developer or full stack
              developer, JavaScript is a must to learn. It also helps you to get
              high-paying jobs all over the world.
            </p>
            <p className="mb-4">
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
            <h2 className="text-2xl font-bold text-blue-500 mb-4">
              Course Structure
            </h2>
            <p className="mb-4">
              22 sections | 54 lectures | 27h 25m Total Duration
            </p>

            {/* Section 1 */}
            <div className="border rounded-md mb-2">
              <div
                className="flex justify-between items-center p-3 cursor-pointer"
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
                  <div className="flex items-center gap-2 p-2">
                    <Play size={16} className="text-gray-500" />
                    <span>App Overview – Build Text-to-Image SaaS</span>
                    <span className="ml-auto text-sm text-gray-500">
                      10 mins
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2">
                    <Play size={16} className="text-gray-500" />
                    <span>Tech Stack – React, Node.js, MongoDB</span>
                    <span className="ml-auto text-sm text-gray-500">
                      15 mins
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2">
                    <Play size={16} className="text-gray-500" />
                    <span>
                      Core Features – Authentication, payment, deployment
                    </span>
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
                className="flex justify-between items-center p-3 cursor-pointer"
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
                  <div className="flex items-center gap-2 p-2">
                    <Play size={16} className="text-gray-500" />
                    <span>Environment Setup – Install Node.js, VS Code</span>
                    <span className="ml-auto text-sm text-gray-500">
                      10 mins
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2">
                    <Play size={16} className="text-gray-500" />
                    <span>Repository Setup – Clone project repository</span>
                    <span className="ml-auto text-sm text-gray-500">
                      10 mins
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2">
                    <Play size={16} className="text-gray-500" />
                    <span>Install Dependencies – Set up npm packages</span>
                    <span className="ml-auto text-sm text-gray-500">
                      10 mins
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2">
                    <Play size={16} className="text-gray-500" />
                    <span>
                      Initial Configuration – Set up basic files and folders
                    </span>
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
                  className="flex justify-between items-center p-3 cursor-pointer"
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
                    <p className="text-gray-500 italic">
                      Section content here...
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Course Details and Purchase */}
        <div className="lg:w-4/12">
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
              <div className="flex items-center text-red-500 mb-2">
                <span className="mr-2">5 days left at this price!</span>
                <span className="bg-green-100 text-green-800 font-semibold px-2 rounded ml-auto">
                  50% off
                </span>
              </div>

              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold">₹ 15,999</span>
                <span className="text-gray-500 line-through ml-2">
                  ₹ 21,999
                </span>
              </div>

              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center">
                  <Star fill="#FFA500" color="#FFA500" size={16} />
                  <span className="ml-1">4.5</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} />
                  <span className="ml-1">30 hours</span>
                </div>
                <div className="flex items-center">
                  <BookOpen size={16} />
                  <span className="ml-1">54 lessons</span>
                </div>
              </div>

              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-md font-semibold mb-4">
                Enroll Now
              </button>

              <div>
                <h4 className="text-lg font-semibold text-blue-500 mb-2">
                  What's in the course?
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Lifetime access with free updates.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Step-by-step, hands-on project guidance.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Downloadable resources and source code.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Quizzes to test your knowledge.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Certificate of completion.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-500 mr-2">•</span>
                    <span>Quizzes to test your knowledge.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Instructor Card - Separate from main course card */}
          <div className="border rounded-lg overflow-hidden shadow-md">
            <div className="bg-white p-4">
              <h4 className="text-lg font-semibold text-blue-500 mb-2">
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