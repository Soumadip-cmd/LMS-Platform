import React, { useState } from "react";
import {
  Bell,
  Mic,
  CheckCircle,
  Users,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Clock,
  Globe,
  Award,
} from "lucide-react";
import Navbar from "../../components/Header/Navbar";
import TagStyle from "../../components/TagStyle/TagStyle";
import Courses from "./Courses";
import Exams from "./Exams";
import FeaturedCourses from "./FeaturedCourse";
import StudentSay from "./StudentSay";
import GetitNow from "./GetitNow";
import PreplingsNews from "./PreplingsNews";
import Footer from "../../components/Footer/Footer";

const HomePage = () => {
  const [email, setEmail] = useState("");

  return (
    <div className=" min-h-screen flex flex-col ">
      
      
      <section className="md:mx-10">
        {/* Main content */}
        <main className="flex-grow bg-white">
          <div className="container mx-auto md:pt-16 md:pb-4 px-4 py-8 pb-8  ">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              {/* Left side text content */}
              <div className="lg:w-1/2 mb-10 ">
                <TagStyle
                  color="#2563eb"
                  text="PREPARE WITH CONFIDENCE"
                  size="14px"
                />

                <div className="container mx-auto p-4 ">
                  <div className="max-w-3xl">
                    <h1 className="text-2xl md:text-4xl xl:text-5xl font-bold mb-6">
                      Master Languages With
                      <div className="mt-2">
                        <span className="text-blue-500">AI-Powered</span>{" "}
                        Learning
                      </div>
                    </h1>

                    <p className="text-gray-600 mb-8 lg:pr-28">
                      Enhance your language skills through personalized AI
                      feedback and real-world practice. Join thousands of
                      successful learners today
                    </p>

                    <div className="flex flex-wrap gap-4 items-start">
                      <div className="flex flex-col items-start">
                        <button className="bg-blue-500 text-white px-6 py-3 rounded-[20px] hover:bg-blue-600 transition font-medium">
                          START LEARNING FREE
                        </button>
                        <div className="flex items-center ml-2 mt-2">
                          <svg
                            className="w-4 h-4 text-blue-500 mr-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M8 12L11 15L16 9"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="text-sm text-gray-500">
                            No Credit Card Required
                          </span>
                        </div>
                      </div>

                      <button className="text-blue-500 border border-blue-500 px-6 py-3 rounded-[20px] hover:bg-blue-50 transition-colors duration-300">
                        WATCH DEMO
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side images */}
              <div className="lg:w-1/2 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="row-span-2">
                    <img
                      src="https://placehold.co/400x500"
                      alt="Mother helping child learn"
                      className="rounded-lg shadow-md w-full h-auto"
                    />
                  </div>
                  <div>
                    <img
                      src="https://placehold.co/300x250"
                      alt="Student learning"
                      className="rounded-lg shadow-md w-full h-auto"
                    />
                  </div>
                  <div>
                    <img
                      src="https://placehold.co/300x250"
                      alt="Student writing"
                      className="rounded-lg shadow-md w-full h-auto"
                    />
                  </div>
                </div>

                {/* Notification bubble */}
                <div className="relative bg-white p-4 pt-6 pb-3 rounded-2xl shadow-lg max-w-xs md:bottom-14">
                  <div className="absolute  top-3 -left-4 bg-yellow-400 rounded-full p-2 flex items-center justify-center">
                    <Bell size={20} color="white" />
                  </div>
                  <div className="text-sm  text-center mt-2">
                    Tomorrow is our" When I<br />
                    Grow Up" Sprit Day!
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom section */}

            {/* powered by advanced AI */}

            <div className="container mx-auto mt-14 mb-8 md:mt-0 lg:my-14 px-4 py-12 max-w-6xl">
              {/* Header Section */}
              <div className="text-center mb-16">
                <p className="text-[#0D47A1] font-medium md:text-[27px] mb-2">
                  Powered by advanced AI
                </p>
                <h1 className="text-2xl md:text-4xl xl:text-5xl font-bold mb-6">
                  Language learning reimagined with{" "}
                  <br className="hidden md:block" />
                  intelligent feedback
                </h1>
                <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                  Our AI-powered platform analyzes your speaking and writing,
                  providing personalized feedback and targeted practice
                  opportunities to accelerate your language learning journey.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Mic className="text-blue-500" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Speech Recognition & Analysis
                  </h3>
                  <p className="text-gray-600">
                    Advanced AI listens to your pronunciation and provides
                    real-time feedback to improve your accent and fluency.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="text-blue-500" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Writing Assessment
                  </h3>
                  <p className="text-gray-600">
                    Get detailed feedback on your written language skills with
                    suggestions for grammar, vocabulary, and style improvements.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Users className="text-blue-500" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Personalized Curriculum
                  </h3>
                  <p className="text-gray-600">
                    AI adapts lessons to focus on your specific needs, creating
                    a custom learning path based on your progress and goals.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <MessageSquare className="text-blue-500" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Immersive Conversations
                  </h3>
                  <p className="text-gray-600">
                    Practice real-life scenarios with AI conversation partners
                    that adjust to your proficiency level.
                  </p>
                </div>

                {/* Feature 5 */}
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="text-blue-500" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Cultural Context
                  </h3>
                  <p className="text-gray-600">
                    Learn language within authentic cultural contexts, including
                    idioms, expressions, and customs.
                  </p>
                </div>

                {/* Feature 6 */}
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="text-blue-500" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Progress Tracking
                  </h3>
                  <p className="text-gray-600">
                    Visualize your improvement over time with detailed analytics
                    and achievement milestones.
                  </p>
                </div>
              </div>
            </div>

            {/* why choose prempling section */}
            <div className="max-w-6xl mx-auto md:px-4 px-6 lg:py-12  bg-white">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-12 xl:gap-20">
                {/* Left side: Features */}
                <div className="lg:w-1/2  space-y-10 lg:space-y-12 pr-0  lg:pr-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                      Why Choose{" "}
                      <TagStyle
                        color="#000000"
                        text="Preplings"
                        size="inherit"
                      />
                      ?
                    </h2>
                  </div>

                  {/* Feature 1 */}
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-100 p-2 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        Learn 3x Faster
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Our AI-driven approach accelerates learning by
                        identifying and focusing on your specific areas for
                        improvement, saving months of traditional study time.
                      </p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-100 p-2 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        Build Real Confidence
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Practice in a judgment-free environment with
                        personalized feedback that builds genuine language
                        confidence for real-world situations.
                      </p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-100 p-2 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                        <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        Cultural Fluency
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Go beyond vocabulary and grammar to understand cultural
                        nuances and context, preparing you for authentic
                        interactions.
                      </p>
                    </div>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-100 p-2 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        Recognized Progress
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Earn certifications and track measurable improvements
                        that can be shared with employers or academic
                        institutions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side: App Demo */}
                <div className="lg:w-1/2 mt-12 lg:mt-0 relative">
                  <div className="bg-blue-50 rounded-3xl p-4 sm:p-6 shadow-lg max-w-sm sm:max-w-md mx-auto">
                    {/* Browser-like header */}
                    <div className="bg-white rounded-t-lg p-2 mb-4">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                    </div>

                    {/* App content */}
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-start">
                        <div className="w-3/4 bg-gray-200 h-4 rounded"></div>
                        <div className="bg-green-100 text-green-600 text-xs rounded-full px-2 py-1 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">
                            Pronunciation Improved
                          </span>
                          <span className="sm:hidden">Improved</span>
                        </div>
                      </div>

                      <div className="mt-8 bg-gray-200 h-3 rounded w-1/2"></div>
                      <div className="mt-2 bg-gray-200 h-3 rounded w-3/4"></div>
                      <div className="mt-2 bg-gray-200 h-3 rounded w-2/3"></div>
                    </div>

                    {/* Level indicator */}
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 text-xs mr-2">
                          i
                        </div>
                        <span className="text-sm">Level up: Intermediate</span>
                      </div>

                      <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
                        <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                      </div>

                      <div className="flex justify-end mt-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements - hidden on smallest screens */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 sm:w-16 sm:h-16 bg-blue-300 rounded-2xl rotate-12 hidden sm:block"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-blue-300 rounded-2xl -rotate-12 hidden sm:block"></div>
                </div>
              </div>
            </div>
            {/* courses section */}
            <section>
              {/* Top courses */}
              <Courses />
            </section>

            {/* Top Exam Section */}
            <section>
              <Exams />
            </section>

            {/* Featured Courses section */}
            <section>
              <FeaturedCourses />
            </section>

            {/* Student review */}
            <section>
              <StudentSay />
            </section>
          </div>
        </main>
      </section>
      {/* Get it now */}
      <section>
        <GetitNow />
      </section>

      {/* prepling news section */}
      <div className="md:mx-10">
        <section>
          <PreplingsNews />
        </section>

        
      </div>
    </div>
  );
};
export default HomePage;
