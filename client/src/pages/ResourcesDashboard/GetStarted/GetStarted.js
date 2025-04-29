import React from 'react';

import { HelpCircle, Zap, RefreshCw, AlertTriangle, Mail, Star } from 'lucide-react';
import TagStyle from '../../../components/TagStyle/TagStyle';

const GetStarted = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen mx-2 lg:mx-4 bg-gray-50">
      
      <div className="flex-1 p-4 sm:p-6 ">
        <div className="mx-auto md:mx-2">
          {/* Welcome Banner */}
          <div className="bg-white rounded-lg shadow-md p-4 lg:p-12 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="mb-4  lg:mb-0">
                <h1 className="text-xl md:text-2xl lg:text-2xl xl:text-3xl font-semibold text-black flex items-center flex-wrap">
                  <span className="inline-block align-middle mr-1">Welcome to</span>
                  <TagStyle
                    color="#1976D2"
                    text="Preplings!"
                    size="inherit"
                  />
                  <img src={`${process.env.PUBLIC_URL}/assets/Resources/click-getstarted.png`} alt='' className="inline-block size-10 lg:size-12 ml-2" />
                </h1>
                <p className="text-xs lg:w-[70%] sm:text-sm text-[#7E7E7E] mt-2">
                  New to community and hard to find your path here? we're here to help you.
                </p>
              </div>
              <div className="grid grid-cols-4 gap-3 lg:gap-4">
                {/* Individual avatars instead of mapping */}
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-200 overflow-hidden">
                  <img src="/api/placeholder/40/40" alt="avatar 1" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-200 overflow-hidden">
                  <img src="/api/placeholder/40/40" alt="avatar 2" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-200 overflow-hidden">
                  <img src="/api/placeholder/40/40" alt="avatar 3" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-200 overflow-hidden">
                  <img src="/api/placeholder/40/40" alt="avatar 4" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-200 overflow-hidden mt-2">
                  <img src="/api/placeholder/40/40" alt="avatar 5" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-200 overflow-hidden mt-2">
                  <img src="/api/placeholder/40/40" alt="avatar 6" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-200 overflow-hidden mt-2">
                  <img src="/api/placeholder/40/40" alt="avatar 7" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gray-200 overflow-hidden mt-2">
                  <img src="/api/placeholder/40/40" alt="avatar 8" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* What's New Section */}
          <div className="mb-8">
            <h2 className="text-xl xl:text-2xl font-semibold text-gray-800 mb-2">What's New?</h2>
            <p className="text-xs sm:text-sm text-[#7E7E7E] mb-4">
              We have dozens of different resources and concept types, so you may find yourself a little confused at first, but no worries, you can get started here:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Getting Started Card */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#FFBE33] flex items-center justify-center mb-3 sm:mb-4">
                  <Zap size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-base text-gray-800 mb-1 sm:mb-2">Getting started</h3>
                <p className="text-xs sm:text-sm text-[#7E7E7E]">
                  Unleash the power of analytics with our step-by-step guide to get started on your data driven journey.
                </p>
              </div>
              
              {/* Help Center Card */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#FFBE33] flex items-center justify-center mb-3 sm:mb-4">
                  <HelpCircle size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-base text-gray-800 mb-1 sm:mb-2">Help Center</h3>
                <p className="text-xs sm:text-sm text-[#7E7E7E]">
                  If you have questions, we have answers. Browse our extensive help center to learn more about our product.
                </p>
              </div>
              
              {/* Product Update Card */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#FFBE33] flex items-center justify-center mb-3 sm:mb-4">
                  <RefreshCw size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-base text-gray-800 mb-1 sm:mb-2">Product Update</h3>
                <p className="text-xs sm:text-sm text-[#7E7E7E]">
                  Discover our latest product
                </p>
              </div>
            </div>
          </div>

          {/* The Rule Book Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl xl:text-2xl font-semibold text-gray-800 mt-2 mb-2">The Rule Book</h2>
            <p className="text-xs sm:text-sm text-[#7E7E7E] mb-4">
              We are not fond of the word 'rules', so don't take these set of rules, but more of a set of recommendations for fun, friendly, and inviting way of communication.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Rule 1 Card */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#FFBE33] flex items-center justify-center mb-3 sm:mb-4">
                  <HelpCircle size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-base text-gray-800 mb-1 sm:mb-2">1. Be kind and Respectful</h3>
                <p className="text-xs sm:text-sm text-[#7E7E7E]">
                  We encourage members to interact with kindness, empathy and respectful language.
                </p>
              </div>
              
              {/* Rule 2 Card */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#FFBE33] flex items-center justify-center mb-3 sm:mb-4">
                  <AlertTriangle size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-base text-gray-800 mb-1 sm:mb-2">2. No SPAM please</h3>
                <p className="text-xs sm:text-sm text-[#7E7E7E]">
                  No one likes SPAM, so please avoid sharing links repeatedly or you may be restricted.
                </p>
              </div>
              
              {/* Rule 3 Card */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#FFBE33] flex items-center justify-center mb-3 sm:mb-4">
                  <Mail size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-base text-gray-800 mb-1 sm:mb-2">3. Sharing is Caring</h3>
                <p className="text-xs sm:text-sm text-[#7E7E7E]">
                Found something interesting? Share it with the community, Remember sharing is caring.
                </p>
              </div>
              
              {/* Rule 4 Card */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#FFBE33] flex items-center justify-center mb-3 sm:mb-4">
                  <Star size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-base text-gray-800 mb-1 sm:mb-2">4. Stay on Topic</h3>
                <p className="text-xs sm:text-sm text-[#7E7E7E]">
                We love movies and Tv shows too, but for the sake of keeping order, please stay on topic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;