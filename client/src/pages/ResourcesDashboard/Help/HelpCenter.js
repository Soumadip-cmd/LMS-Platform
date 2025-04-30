import React from 'react';
import { Search, Book, Users, BookOpen, Briefcase, MessageCircle } from 'lucide-react';

const HelpCenter = () => {
  return (
    <div className="p-4 md:p-6 mx-2 lg:mx-4 bg-gray-50 min-h-screen">
      {/* Header Section - Updated to match blog header structure */}
      <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="mb-4 p-6 md:mb-0">
          <div className="flex items-center mb-2">
            <img
              src={`${process.env.PUBLIC_URL}/assets/Resources/help-center-I.png`}
              alt="Help header decoration"
              className="size-10 mr-1"
            />
            <h1 className="text-xl md:text-2xl xl:text-3xl font-semibold">Help Center</h1>
          </div>
          <p className="text-gray-600 mt-4 md:text-lg text-sm">
            If you have questions, we have answers. Browse our extensive help center to learn more about our product.
          </p>
        </div>
        <div>
          <img
            src={`${process.env.PUBLIC_URL}/assets/Resources/help-center-img1.png`}
            alt="Help header decoration"
            className="hidden md:block md:h-48 w-full md:w-auto"
          />
        </div>
      </div>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Getting Started Card */}
        <CardItem
          icon={<Book className="text-white" size={20} />}
          title="Getting started"
          description="Unleash the power of analytics with our step-by-step guide to get started on your data-driven journey."
        />
        
        {/* Student Help Card */}
        <CardItem
          icon={<Users className="text-white" size={20} />}
          title="Student Help"
          description="Unleash the power of analytics with our step-by-step guide to get started on your data-driven journey."
        />
        
        {/* Instructor Help Card */}
        <CardItem
          icon={<BookOpen className="text-white" size={20} />}
          title="Instructor Help"
          description="Unleash the power of analytics with our step-by-step guide to get started on your data-driven journey."
        />
        
        {/* Preplings Business Card */}
        <CardItem
          icon={<Briefcase className="text-white" size={20} />}
          title="Preplings Business"
          description="Unleash the power of analytics with our step-by-step guide to get started on your data-driven journey."
        />
        
        {/* Contact Us Card */}
        <CardItem
          icon={<MessageCircle className="text-white" size={20} />}
          title="Contact Us"
          description="Unleash the power of analytics with our step-by-step guide to get started on your data-driven journey."
        />
      </div>
    </div>
  );
};

// Card Component
const CardItem = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <div className={`w-10 h-10 bg-[#FFBE33] rounded-xl flex items-center justify-center mb-4 `}>
        {icon}
      </div>
      <h3 className="font-semibold text-lg md:text-xl text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default HelpCenter;