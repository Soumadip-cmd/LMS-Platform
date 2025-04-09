import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Edit, Mic, Book, Headphones } from 'lucide-react';

const GeneralPractice = () => {
  return (
    <div className="bg-gray-50 p-6 md:p-8 ">
      <div className="m-2 lg:mx-4 xl:mx-12  ">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">
          <span className="flex items-center">
          Master German Language skills <img src="https://placehold.co/40x40" alt='german flag' className="ml-2" />
            </span>
          </h1>
          <p className="text-gray-500">Enhance your German Language proficiency with our comprehensive skill-focused modules covering, writing, speaking, grammar, and listening</p>
        </header>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3   2xl:grid-cols-5 gap-4 md:gap-6">
          
          {/* Reading Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold whitespace-nowrap">
                <div className="flex items-center">
                  <div className="bg-[#FFB71C] rounded-full p-2 mr-4">
                    <BookOpen className="text-white h-5 w-5" />
                  </div>
                  Reading
                </div>
              </h2>
            </div>
            
            <ul className="space-y-1 mb-4">
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Comprehensive Reading Materials</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Text Analysis Practice</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Reading Comprehension Tests</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Vocabulary Building</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Speed Reading Exercises</span>
              </li>
            </ul>
            
            <div className="flex-grow"></div>
            
            <Link to="/practice-reading" className="w-full block">
              <button className="w-full bg-[#FFB71C] hover:bg-[#efa912] text-center py-2 rounded-md font-medium transition-colors text-white hover:text-[#0D47A1] mt-4">
                Practice Reading
              </button>
            </Link>
          </div>
          
          {/* Writing Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold whitespace-nowrap">
                <div className="flex items-center">
                  <div className="bg-[#FFB71C] rounded-full p-2 mr-4">
                    <Edit className="text-white  h-5 w-5" />
                  </div>
                  Writing
                </div>
              </h2>
            </div>
            
            <ul className="space-y-1 mb-4">
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Essay Writing Practice</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Grammar Corrections</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Writing Templates</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Personal Feedback</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Creative Writing Tasks</span>
              </li>
            </ul>
            
            <div className="flex-grow"></div>
            
            <Link to="/practice-writing" className="w-full block">
              <button className="w-full bg-[#FFB71C] hover:bg-[#efa912] text-center py-2 rounded-md font-medium transition-colors text-white hover:text-[#0D47A1] mt-4">
                Practice Writing
              </button>
            </Link>
          </div>
          
          {/* Speaking Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold whitespace-nowrap">
                <div className="flex items-center">
                  <div className="bg-[#FFB71C] rounded-full p-2 mr-4">
                    <Mic className="text-white h-5 w-5" />
                  </div>
                  Speaking
                </div>
              </h2>
            </div>
            
            <ul className="space-y-1 mb-4">
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Pronunciation Practice</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Conversation Exercises</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Speech Recording</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Live Speaking Sessions</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Accent Training</span>
              </li>
            </ul>
            
            <div className="flex-grow"></div>
            
            <Link to="/practice-speaking" className="w-full block">
              <button className="w-full bg-[#FFB71C] hover:bg-[#efa912] text-center py-2 rounded-md font-medium transition-colors text-white hover:text-[#0D47A1] mt-4">
                Practice Speaking
              </button>
            </Link>
          </div>
          
          {/* Grammar Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold whitespace-nowrap">
                <div className="flex items-center">
                  <div className="bg-[#FFB71C] rounded-full p-2 mr-4">
                    <Book className="text-white h-5 w-5" />
                  </div>
                  Grammar
                </div>
              </h2>
            </div>
            
            <ul className="space-y-1 mb-4">
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Grammar Rules</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Practice Exercises</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Common Mistakes</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Sentence Formation</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Grammar Tests</span>
              </li>
            </ul>
            
            <div className="flex-grow"></div>
            
            <Link to="/practice-grammar" className="w-full block">
              <button className="w-full bg-[#FFB71C] hover:bg-[#efa912] text-center py-2 rounded-md font-medium transition-colors text-white hover:text-[#0D47A1] mt-4">
                Practice Grammar
              </button>
            </Link>
          </div>
          
          {/* Listening Card */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold whitespace-nowrap">
                <div className="flex items-center">
                  <div className="bg-[#FFB71C] rounded-full p-2 mr-4">
                    <Headphones className="text-white h-5 w-5" />
                  </div>
                  Listening
                </div>
              </h2>
            </div>
            
            <ul className="space-y-1 mb-4">
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Audio Comprehension</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Listening Exercises</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Native Speaking Audio</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Dictation Practice</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span className="text-sm">Audio Analysis</span>
              </li>
            </ul>
            
            <div className="flex-grow"></div>
            
            <Link to="/practice-listening" className="w-full block">
              <button className="w-full bg-[#FFB71C] hover:bg-[#efa912] text-center py-2 rounded-md font-medium transition-colors text-white hover:text-[#0D47A1] mt-4">
                Practice Listening
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralPractice;