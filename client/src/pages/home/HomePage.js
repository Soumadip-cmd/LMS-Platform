import React, { useState } from "react";
import { Bell } from "lucide-react";
import Navbar from "../../components/Header/Navbar";

const HomePage = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="font-sans min-h-screen flex flex-col ">
      {/* Top banner */}
      <div className="bg-blue-900 text-white p-2 text-center text-sm ">
        Keep learning with free resources! Experience{" "}
        <span className="font-bold">Preplings</span>.
        <a href="#" className="ml-2 text-yellow-400 hover:underline">
          Learn more
        </a>
      </div>
      <section className="md:mx-10">
        {/* Navigation */}
        <Navbar/>
        {/* Main content */}
        <main className="flex-grow bg-white">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              {/* Left side text content */}
              <div className="lg:w-1/2 mb-10 lg:mb-0">
                <div className="relative inline-block mb-3">
                  <div className="absolute inset-0 bg-[#FFB71C80] transform -rotate-2 z-0"></div>
                  <span className="relative z-10 px-3 py-1 block font-bold text-blue-600 text-sm">
                    PREPARE WITH CONFIDENCE
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 ">
                  Master Languages With
                  <div className="mt-4">
                    <span className="text-blue-500">AI-Powered</span> Learning
                  </div>
                </h1>

                <p className="text-gray-600 mb-8">
                  Enhance your language skills through personalized AI feedback
                  and real-world practice. Join thousands of successful learners
                  today
                </p>

                <div className="flex flex-wrap gap-4 items-start">
                  <div className="flex flex-col items-start">
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-[20px] hover:bg-blue-600 transition">
                      START LEARNING FREE
                    </button>
                    <div className="flex items-start m-2">
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
                      <span className="text-xs">No Credit Card Required</span>
                    </div>
                  </div>
                  <button className="text-blue-500 border border-blue-500 px-6 py-3 rounded-[20px] hover:bg-blue-500 hover:text-white transition-colors duration-300 flex items-center">
                    WATCH DEMO
                  </button>
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
                <div className="absolute bottom-16 -left-6 md:-left-10 bg-white p-3 rounded-lg shadow-lg flex items-center max-w-xs">
                  <div className="bg-yellow-400 rounded-full p-2 mr-3">
                    <Bell size={20} color="white" />
                  </div>
                  <div className="text-sm">
                    <span>Tomorrow is our "When I Grow Up" Spirit Day!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom section */}
            <div className="mt-20 text-center max-w-3xl mx-auto">
              <p className="text-blue-500 mb-4">Powered by advanced AI</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Language learning reimagined with intelligent feedback
              </h2>
              <p className="text-gray-600">
                Our AI-powered platform analyzes your speaking and writing,
                providing personalized feedback and targeted practice
                opportunities to accelerate your language learning journey.
              </p>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};
export default HomePage;
