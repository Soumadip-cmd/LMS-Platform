import React from 'react';
import TagStyle from '../../components/TagStyle/TagStyle';
import { Link, useNavigate } from 'react-router-dom';

const ExamCard = ({ 
  title, 
  flag, 
  duration, 
  features, 
  price, 
  originalPrice, 
  discount, 
  isFree 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-lg">
      <div className="relative">
        {(discount || isFree) && (
          <div className={`absolute top-2 left-2 text-white text-xs font-bold py-1 px-2 rounded ${isFree ? 'bg-green-500' : 'bg-red-500'}`}>
            {isFree ? 'FREE' : `-`}<span className="numbers">{discount}</span>{`% OFF`}
          </div>
        )}
        <img 
          src="https://placehold.co/400x320" 
          alt={`${title} exam`} 
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-blue-600 font-bold text-xl mb-2 flex items-center">
          {title} {flag}
        </h3>
        
        <div className="text-gray-600 flex items-center mb-3">
          <span className="inline-block bg-blue-100 rounded-full p-1 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span className="text-sm">Duration : <span className="numbers">{duration}</span> hours</span>
        </div>
        
        <div className="flex-grow">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start mb-2">
              <span className="inline-block bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          {isFree ? (
            <p className="text-green-500 font-bold text-lg">FREE</p>
          ) : (
            <div className="flex items-center">
              <p className="text-red-500 font-bold text-lg">$<span className="numbers">{price}</span>.00</p>
              {originalPrice && (
                <p className="text-gray-400 line-through ml-2">$<span className="numbers">{originalPrice}</span>.00</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Exams = () => {
  const navigate = useNavigate();
  
  const examData = [
    {
      title: "TELC B1",
      flag: "🇩🇪",
      duration: "2.4",
      features: [
        "30 Full-length Practice Exams",
        "Detailed Score Analysis",
        "Instant Results & Solutions"
      ],
      price: "100",
      originalPrice: "150",
      discount: "35",
      isFree: false
    },
    {
      title: "DELF A1",
      flag: "🇫🇷",
      duration: "2.4",
      features: [
        "30 Mock Examinations",
        "Detailed Score Analysis",
        "Instant Results & Solutions"
      ],
      price: "",
      originalPrice: "",
      discount: 0,
      isFree: true
    },
    {
      title: "DELE A2",
      flag: "🇪🇸",
      duration: "2.4",
      features: [
        "20 Mock Examinations",
        "Progress Tracking Dashboard",
        "Detailed Answer Explanation"
      ],
      price: "100",
      originalPrice: "150",
      discount: "10",
      isFree: false
    },
    {
      title: "Goethe B1",
      flag: "🇩🇪",
      duration: "2.4",
      features: [
        "15 Practice Tests",
        "Performance Analysis",
        "Review & Feedback System"
      ],
      price: "",
      originalPrice: "",
      discount: 0,
      isFree: true
    },
  ];

  return (
    <div className="bg-gray-50  py-8 px-4">
      <div className="mx-auto 2xl:mx-1">
        <div className="mb-8 relative inline-block">
          <h2 className="text-2xl font-bold">Trending <TagStyle color="#000000" text="Exams"/></h2>
          <div className="absolute -right-4 bottom-0 bg-yellow-200 h-3 w-32 -z-10"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {examData.map((exam, index) => (
            <ExamCard 
              key={index}
              title={exam.title}
              flag={exam.flag}
              duration={exam.duration}
              features={exam.features}
              price={exam.price}
              originalPrice={exam.originalPrice}
              discount={exam.discount}
              isFree={exam.isFree}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-md transition duration-300 w-full md:w-auto md:min-w-64 transform hover:scale-105"
          onClick={() => navigate('/exams')}
        >
          View All Exams
        </button>
      </div>
      </div>
    </div>
  );
};

export default Exams;