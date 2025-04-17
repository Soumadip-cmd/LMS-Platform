import React, { useState } from 'react';

const ResourceFeed = () => {
  // State to track active tab in leaderboard
  const [activeTab, setActiveTab] = useState('allTime');

  // Sample data for different time periods
  const leaderboardData = {
    allTime: [
      { id: 'you', rank: 345, name: 'You', xp: 500, isCurrentUser: true },
      { id: 'john', rank: 1, name: 'John', xp: 5000, isBlue: true },
      { id: 'yousuf', rank: 2, name: 'Yousuf', xp: 4888 },
      { id: 'barmer', rank: 3, name: 'Barmer', xp: 4888 }
    ],
    month: [
      { id: 'you', rank: 120, name: 'You', xp: 200, isCurrentUser: true },
      { id: 'sarah', rank: 1, name: 'Sarah', xp: 2500, isBlue: true },
      { id: 'michael', rank: 2, name: 'Michael', xp: 2200 },
      { id: 'david', rank: 3, name: 'David', xp: 2100 }
    ],
    week: [
      { id: 'you', rank: 45, name: 'You', xp: 100, isCurrentUser: true },
      { id: 'emma', rank: 1, name: 'Emma', xp: 1200, isBlue: true },
      { id: 'james', rank: 2, name: 'James', xp: 1100 },
      { id: 'olivia', rank: 3, name: 'Olivia', xp: 1000 }
    ]
  };

  return (
    <div className="flex flex-col md:flex-row w-full gap-4 p-4 bg-gray-50">
      {/* Main Content Area */}
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-xl font-semibold text-blue-500">Hey! What's Going On?</h1>
        </div>

        {/* Feed Cards */}
        <div className="flex flex-col gap-4">
          {/* User Post Card 1 */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src="https://placehold.co/40x40" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold">Anna Lieberman</h3>
                  <p className="text-xs text-gray-500">4 months ago - Posted in introduce yourself</p>
                </div>
              </div>
              <button className="text-gray-500">
                <span className="text-xl">...</span>
              </button>
            </div>
            
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-2">Hello from India!</h2>
              <p className="text-sm text-gray-700">
                Hi everyone, I'm an Indian citizen with a deep love for languages and cultures. 
                Recently, I joined a language learning course on Preplings, an amazing platform 
                that's helping me explore new languages in a fun and interactive way. Whether it's 
                improving my English fluency or picking up a new foreign language, I'm excited 
                about this journey of growth and connection through communication.
              </p>
            </div>
            
            <div className="flex justify-end space-x-8 pt-2">
              <button className="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span className="text-xs text-gray-600">Like</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-xs text-gray-600">Follow</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-xs text-blue-600">Share</span>
              </button>
            </div>
          </div>

          {/* User Post Card 2 */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src="https://placehold.co/40x40" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold">Yousuf</h3>
                  <p className="text-xs text-gray-500">4 months ago - Posted in introduce yourself</p>
                </div>
              </div>
              <button className="text-gray-500">
                <span className="text-xl">...</span>
              </button>
            </div>
            
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-2">Hello from India!</h2>
              <p className="text-sm text-gray-700">
                Hi everyone, I'm an Indian citizen with a deep love for languages and cultures. 
                Recently, I joined a language learning course on Preplings, an amazing platform 
                that's helping me explore new languages in a fun and interactive way. Whether it's 
                improving my English fluency or picking up a new foreign language, I'm excited 
                about this journey of growth and connection through communication.
              </p>
            </div>
            
            <div className="flex justify-end space-x-8 pt-2">
              <button className="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span className="text-xs text-gray-600">Like</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="text-xs text-gray-600">Follow</span>
              </button>
              <button className="flex flex-col items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-xs text-blue-600">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">Good Morning! </h2>
            <span className="text-yellow-400 text-xl">☀️</span>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-blue-500">Welcome to <span className="bg-yellow-100 px-1 py-0.5 rounded">Preplings</span></p>
            <p className="text-xs text-gray-600 mt-2">
              Connect, Share and engage with community and build relationships.
            </p>
          </div>
          <button className="w-full py-2 border border-blue-500 text-blue-500 rounded-full text-sm hover:bg-blue-50 transition">
            Already a member?
          </button>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold mb-4">Leaderboard</h2>
          
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg mb-4">
            <button 
              className={`flex-1 py-1 px-2 text-xs font-medium ${activeTab === 'allTime' ? 'rounded-lg bg-white shadow-sm' : ''}`}
              onClick={() => setActiveTab('allTime')}
            >
              All Time
            </button>
            <button 
              className={`flex-1 py-1 px-2 text-xs font-medium ${activeTab === 'month' ? 'rounded-lg bg-white shadow-sm' : ''}`}
              onClick={() => setActiveTab('month')}
            >
              Month
            </button>
            <button 
              className={`flex-1 py-1 px-2 text-xs font-medium ${activeTab === 'week' ? 'rounded-lg bg-white shadow-sm' : ''}`}
              onClick={() => setActiveTab('week')}
            >
              Week
            </button>
          </div>
          
          {/* Leaderboard Items */}
          <div className="space-y-3">
            {leaderboardData[activeTab].map(user => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {user.isCurrentUser ? (
                    <span className="text-sm text-gray-500">{user.rank}</span>
                  ) : (
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      user.rank === 1 ? 'bg-blue-500' : 
                      user.rank === 2 ? 'bg-gray-300' : 
                      'bg-yellow-700'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trophy">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                        <path d="M4 22h16"></path>
                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                      </svg>
                    </div>
                  )}
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                    <img src="https://placehold.co/32x32" alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <span className={`text-sm ${user.isBlue ? 'text-blue-500' : ''}`}>{user.name}</span>
                </div>
                <span className="text-sm font-medium">{user.xp}XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceFeed;