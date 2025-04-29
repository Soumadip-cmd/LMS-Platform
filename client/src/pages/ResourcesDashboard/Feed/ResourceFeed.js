import React, { useState } from "react";
import TagStyle from "../../../components/TagStyle/TagStyle";

const ResourceFeed = () => {
  // State to track active tab in leaderboard
  const [activeTab, setActiveTab] = useState("week");

  // Sample data for different time periods
  const leaderboardData = {
    allTime: [
      { id: "you", rank: 345, name: "You", xp: 500, isCurrentUser: true },
      { id: "john", rank: 1, name: "John", xp: 5000, isBlue: true },
      { id: "yousuf", rank: 2, name: "Yousuf", xp: 4888 },
      { id: "barmer", rank: 3, name: "Barmer", xp: 4888 },
    ],
    month: [
      { id: "you", rank: 120, name: "You", xp: 200, isCurrentUser: true },
      { id: "sarah", rank: 1, name: "Sarah", xp: 2500, isBlue: true },
      { id: "michael", rank: 2, name: "Michael", xp: 2200 },
      { id: "david", rank: 3, name: "David", xp: 2100 },
    ],
    week: [
      { id: "you", rank: 45, name: "You", xp: 100, isCurrentUser: true },
      { id: "emma", rank: 1, name: "Emma", xp: 1200, isBlue: true },
      { id: "james", rank: 2, name: "James", xp: 1100 },
      { id: "olivia", rank: 3, name: "Olivia", xp: 1000 },
    ],
  };

  // Render Welcome Card component
  const WelcomeCard = () => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex  mb-2">
        <h2 className="text-xl md:text-2xl xl:text-2xl lg:text-xl font-bold">
          Good Morning!{" "}
        </h2>
        <span className="text-yellow-400 text-xl">
          <img
            className="size-8 md:size-10 lg:size-8 xl:size-10 mx-2"
            src={`${process.env.PUBLIC_URL}/assets/Resources/goodMorning.png`}
            alt="good morning img"
          />
        </span>
      </div>
      <div className="mb-4">
        <p className="text-base font-semibold text-[#1976D2]">
          Welcome to{" "}
          <div className="relative inline-block mb-3">
            <div className="absolute inset-0 bg-[#FFB71C80] transform -rotate-3 z-0 "></div>
            <span className="relative z-10 px-1 py-0.5 block text-[#1976D2] font-semibold">
              Preplings
            </span>
          </div>
        </p>
        <p className="text-sm md:text-base text-gray-600 mt-2">
          Connect, Share and engage with community and build relationships.
        </p>
      </div>
      <div className=" flex justify-center items-center">
        <button className="w-full lg:w-auto lg:px-12 xl:px-20 py-3 my-4 lg:mx-4 xl:mx-6 border-2 border-[#1976D2] text-[#1976D2] rounded-full text-base font-medium hover:bg-blue-50 transition">
          Already a member?
        </button>
      </div>
    </div>
  );

  // Render Leaderboard component
  const Leaderboard = () => (
    <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
      {/* Leaderboard Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className=" text-xl md:text-2xl font-bold text-gray-800">
          Leaderboard
        </h2>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-yellow-500 mr-1"
          >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
            <path d="M4 22h16"></path>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
          </svg>
          <span className=" text-sm  md:text-base font-medium text-gray-600">
            Top Players
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#D9D9D9] p-2 rounded-lg mb-5">
        <button
          className={`flex-1 py-2 text-sm md:text-base font-medium transition-all duration-200 ${
            activeTab === "allTime"
              ? "bg-white rounded-md shadow-sm text-blue-600"
              : "text-black hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("allTime")}
        >
          All Time
        </button>
        <button
          className={`flex-1 py-2 text-sm md:text-base font-medium transition-all duration-200 ${
            activeTab === "month"
              ? "bg-white rounded-md shadow-sm text-blue-600"
              : "text-black hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("month")}
        >
          Month
        </button>
        <button
          className={`flex-1 py-2 text-sm md:text-base font-medium transition-all duration-200 ${
            activeTab === "week"
              ? "bg-white rounded-md shadow-sm text-blue-600"
              : "text-black hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("week")}
        >
          Week
        </button>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-4 items-center mb-4 px-3">
        <div className="text-xs font-semibold text-gray-500 text-center">
          Rank
        </div>
        <div className="col-span-2 text-xs font-semibold text-gray-500 pl-2">
          User
        </div>
        <div className="text-xs font-semibold text-gray-500 text-right">XP</div>
      </div>

      {/* Leaderboard Items */}
      <div className="space-y-3">
        {leaderboardData[activeTab].map((user) => (
          <div
            key={user.id}
            className={`grid grid-cols-4 items-center p-3 rounded-lg transition-all duration-200 ${
              user.isCurrentUser
                ? "bg-blue-50 border border-blue-100"
                : user.rank <= 3
                ? "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200"
                : "hover:bg-gray-50"
            }`}
          >
            {/* Rank */}
            <div className="flex justify-center">
              {user.isCurrentUser ? (
                <span className="text-sm font-medium text-blue-600 w-8 h-8 flex items-center justify-center">
                  {user.rank}
                </span>
              ) : (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    user.rank === 1
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                      : user.rank === 2
                      ? "bg-gradient-to-br from-gray-300 to-gray-500"
                      : user.rank === 3
                      ? "bg-gradient-to-br from-amber-600 to-amber-800"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {user.rank <= 3 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                      <path d="M4 22h16"></path>
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{user.rank}</span>
                  )}
                </div>
              )}
            </div>

            {/* User */}
            <div className="col-span-2 flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full overflow-hidden bg-gray-100 ring-2 ring-offset-1 ${
                  user.isCurrentUser
                    ? "ring-blue-300"
                    : user.rank === 1
                    ? "ring-yellow-300"
                    : user.rank === 2
                    ? "ring-gray-300"
                    : user.rank === 3
                    ? "ring-amber-300"
                    : "ring-gray-200"
                }`}
              >
                <img
                  src="https://placehold.co/32x32"
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`text-sm font-medium ${
                  user.isCurrentUser
                    ? "text-blue-600"
                    : user.isBlue
                    ? "text-blue-500"
                    : user.rank === 1
                    ? "text-yellow-600"
                    : user.rank === 2
                    ? "text-gray-600"
                    : user.rank === 3
                    ? "text-amber-700"
                    : "text-gray-700"
                }`}
              >
                {user.name}
              </span>
              {user.rank === 1 && (
                <span className="ml-1 text-yellow-500">👑</span>
              )}
            </div>

            {/* XP */}
            <div className="text-right">
              <span
                className={`text-sm font-bold ${
                  user.isCurrentUser
                    ? "text-blue-600"
                    : user.rank === 1
                    ? "text-yellow-600"
                    : user.rank === 2
                    ? "text-gray-600"
                    : user.rank === 3
                    ? "text-amber-700"
                    : "text-gray-700"
                }`}
              >
                {user.xp}
                <span className="text-xs font-medium ml-1">XP</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Blog Posts component (for desktop only now)
  const BlogPosts = () => (
    <div className="flex flex-col gap-4">
      {/* Header */}
      {/* <div className=" mb-2 mt-6">
        <h1 className="text-xl lg:text-2xl font-semibold text-[#1976D2]">Hey! What's Going On?</h1>
      </div> */}

      {/* Feed Cards */}
      <div className="flex flex-col gap-4">
        {/* User Post Card 1 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
              <div className=" size-12 rounded-full overflow-hidden">
                <img
                  src="https://placehold.co/50x50"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Anna Lieberman</h3>
                <p className="text-xs text-[#7E7E7E]">
                  4 months ago - Posted in introduce yourself
                </p>
              </div>
            </div>
            <button className="text-gray-500">
              <span className="text-xl">...</span>
            </button>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-medium mb-4">Hello from India!</h2>
            <p className="text-sm text-[#7E7E7E]">
              Hi everyone, I'm an Indian citizen with a deep love for languages
              and cultures. Recently, I joined a language learning course on
              Preplings, an amazing platform that's helping me explore new
              languages in a fun and interactive way. Whether it's improving my
              English fluency or picking up a new foreign language, I'm excited
              about this journey of growth and connection through communication.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-2">
            <button
              className="flex flex-col items-center gap-1 bg-white rounded-full p-2 px-4"
              style={{
                boxShadow:
                  "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#1976D2]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              <span className="text-xs text-[#1976D2]">Like</span>
            </button>
            <button
              className="flex flex-col items-center gap-1 bg-white rounded-full p-2 px-3"
              style={{
                boxShadow:
                  "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#1976D2]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="text-xs text-[#1976D2]">Follow</span>
            </button>
            <button
              className="flex flex-col items-center gap-1 bg-white rounded-full p-2 px-3"
              style={{
                boxShadow:
                  "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#1976D2]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span className="text-xs text-[#1976D2]">Share</span>
            </button>
          </div>
        </div>

        {/* User Post Card 2 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
              <div className="size-12 rounded-full overflow-hidden">
                <img
                  src="https://placehold.co/50x50"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Yousuf</h3>
                <p className="text-xs text-[#7E7E7E]">
                  4 months ago - Posted in introduce yourself
                </p>
              </div>
            </div>
            <button className="text-gray-500">
              <span className="text-xl">...</span>
            </button>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-medium mb-4">Hello from India!</h2>
            <p className="text-sm text-[#7E7E7E]">
              Hi everyone, I'm an Indian citizen with a deep love for languages
              and cultures. Recently, I joined a language learning course on
              Preplings, an amazing platform that's helping me explore new
              languages in a fun and interactive way. Whether it's improving my
              English fluency or picking up a new foreign language, I'm excited
              about this journey of growth and connection through communication.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-2">
            <button
              className="flex flex-col items-center gap-1 bg-white rounded-full p-2 px-4"
              style={{
                boxShadow:
                  "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#1976D2]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              <span className="text-xs text-[#1976D2]">Like</span>
            </button>
            <button
              className="flex flex-col items-center gap-1 bg-white rounded-full p-2 px-3"
              style={{
                boxShadow:
                  "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#1976D2]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="text-xs text-[#1976D2]">Follow</span>
            </button>
            <button
              className="flex flex-col items-center gap-1 bg-white rounded-full p-2 px-3"
              style={{
                boxShadow:
                  "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#1976D2]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span className="text-xs text-[#1976D2]">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Mobile Post Card (reusable component)
  const MobilePostCard = ({ user, title, content }) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="size-12 rounded-full overflow-hidden">
            <img
              src="https://placehold.co/50x50"
              alt={user}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{user}</h3>
            <p className="text-xs text-[#7E7E7E]">
              4 months ago - Posted in introduce yourself
            </p>
          </div>
        </div>
        <button className="text-gray-500">
          <span className="text-xl">...</span>
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-medium mt-3 mb-3">{title}</h2>
        <p className="text-sm text-[#7E7E7E]">{content}</p>
      </div>

      <div className="flex justify-end space-x-4 pt-2">
        <button
          className="flex flex-col items-center gap-1 bg-white rounded-full p-2 px-4"
          style={{
            boxShadow:
              "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#1976D2]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          <span className="text-xs text-[#1976D2]">Like</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 bg-white rounded-full p-2 px-3"
          style={{
            boxShadow:
              "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#1976D2]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="text-xs text-[#1976D2]">Follow</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 bg-white rounded-full p-2 px-3"
          style={{
            boxShadow:
              "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#1976D2]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span className="text-xs text-[#1976D2]">Share</span>
        </button>
      </div>
    </div>
  );

  // Sample post content
  const postContent =
    "Hi everyone, I'm an Indian citizen with a deep love for languages and cultures. Recently, I joined a language learning course on Preplings, an amazing platform that's helping me explore new languages in a fun and interactive way. Whether it's improving my English fluency or picking up a new foreign language, I'm excited about this journey of growth and connection through communication.";

  return (
    <div className="mx-2 lg:mx-4 bg-gray-50">
      <div class="   pt-8 md:pt-6 md:mb-2 mx-4 lg:mb-2 lg:mt-3">
        <h1 class="text-xl lg:text-2xl font-semibold text-[#1976D2]">
          Hey! What's Going On?
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row w-full gap-4 p-4 overflow-hidden">
        {/* For mobile devices: Header -> Good Morning Card -> Leaderboard -> Blog posts */}
        <div className="block lg:hidden w-full">
          {/* Only show the header part from BlogPosts */}

          <div className="mb-4">
            <WelcomeCard />
          </div>
          <div className="mb-4">
            <Leaderboard />
          </div>
          {/* Blog post cards */}
          <div className="flex flex-col gap-4">
            <MobilePostCard
              user="Anna Lieberman"
              title="Hello from India!"
              content={postContent}
            />
            <MobilePostCard
              user="Yousuf"
              title="Hello from India!"
              content={postContent}
            />
          </div>
        </div>

        {/* For medium and large screens: Original layout */}
        <div className="hidden lg:flex lg:flex-row w-full gap-4">
          {/* Main Content Area */}
          <div className="w-full lg:w-[55%] 2xl:w-2/3 flex flex-col gap-4">
            <BlogPosts />
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[45%] 2xl:w-1/3 flex flex-col gap-4">
            <WelcomeCard />
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceFeed;
