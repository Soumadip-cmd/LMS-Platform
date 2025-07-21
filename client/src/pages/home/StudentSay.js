import React from 'react';
import { Quote } from 'lucide-react';
import TagStyle from '../../components/TagStyle/TagStyle';

const StudentSay = () => {
  const testimonials = [
    {
      category: "Great Quality!",
      text: "The AI feedback system helped me improve my pronunciation significantly. I feel much more confident speaking German now!",
      name: "Oliver Beddows",
      role: "German B2 Student",
      avatar: "https://res.cloudinary.com/deg0l45uc/image/upload/v1753082933/Client/image_3_teucho.png"
    },
    {
      category: "Customer Support",
      text: "The AI feedback system helped me improve my pronunciation significantly. I feel much more confident speaking German now!",
      name: "Michael Chen",
      role: "Business German Student",
      avatar: "https://res.cloudinary.com/deg0l45uc/image/upload/v1753082932/Client/image_1_tcjjyu.png"
    },
    {
      category: "Code Quality!",
      text: "The AI feedback system helped me improve my pronunciation significantly. I feel much more confident speaking German now!",
      name: "Oliver Beddows",
      role: "German B2 Student",
      avatar: "https://res.cloudinary.com/deg0l45uc/image/upload/v1753082933/Client/image_2_safg6t.png"
    }
  ];
 
  return (
    <div className="bg-white py-8 px-4 md:px-8 mx-auto 2xl:mx-1">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/4 mb-8 lg:mb-0 lg:pr-8">
          <h2 className="text-3xl font-bold">
            What Our <TagStyle color="#000000" text="Students"/>
            Say
          </h2>
          <p className="mt-4 text-gray-700">
            One-stop solution for any eLearning center, online courses. People love LMS because they can create their sites with ease here.
          </p>
        </div>
        
        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-6 rounded-lg relative transition-shadow duration-300 hover:shadow-lg flex flex-col"
            >
              <div className="absolute top-4 right-4 text-gray-300">
                <Quote size={24} />
              </div>
              
              <h3 className="text-blue-500 font-semibold text-lg mb-3">{testimonial.category}</h3>
              
              <p className="text-gray-700 mb-auto">{testimonial.text}</p>
              
              <div className="flex items-center mt-4">
                <img 
                  src={testimonial.avatar} 
                  alt={`${testimonial.name} avatar`} 
                  className="w-12 h-12 rounded-full mr-4 flex-shrink-0" 
                />
                <div className="flex flex-col">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
          
    </div>

  );
};

export default StudentSay;
