import React, { useState, useEffect } from "react";
import {
  Twitter,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
} from "lucide-react";

// Custom styles for the fade-in animation
const styles = `
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.1s ease-in-out forwards;
}
`;

const ContactUs = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showAirplane, setShowAirplane] = useState(false);

  // Show airplane animation when radio button is selected
  useEffect(() => {
    if (selectedSubject !== null) {
      setShowAirplane(true);

      // Hide airplane after animation completes
      const timer = setTimeout(() => {
        setShowAirplane(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [selectedSubject]);

  return (
    <div className="m-2 lg:mx-4 xl:mx-12 p-4 bg-white">
      {/* Add the custom styles */}
      <style>{styles}</style>
      <h1 className="text-3xl font-bold text-blue-500 mb-6">Contact Us</h1>

      <div
        className="flex flex-col md:flex-row rounded-lg overflow-hidden relative h-full"
        style={{
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.07), 0 16px 32px rgba(0,0,0,0.07), 0 32px 64px rgba(0,0,0,0.07)",
        }}
      >
        {/* Left Side - Yellow Contact Information */}
        <div className="bg-[#FFB71C] m-2 p-8 xl:w-2/5 relative overflow-hidden flex flex-col h-full min-h-[600px] rounded-md">
          {/* Header Section */}
          <div className="mb-12">
            <h2 className="text-2xl xl:text-4xl font-medium text-white mb-2">
              Contact Information
            </h2>
            <p className="text-white font-light text-base lg:text-xl">
              Say something to start a live chat!
            </p>
          </div>

          {/* Middle Section with Contact Details */}
          <div className="flex-grow space-y-8 justify-center flex flex-col font-light lg:text-lg">
            <a
              href="tel:+10123456789"
              className="flex items-center text-white hover:text-black hover:underline group"
            >
              <div className="mr-4 text-white group-hover:text-black">
                <Phone size={20} />
              </div>
              <span>+1012 3456 789</span>
            </a>

            <a
              href="mailto:demo@gmail.com"
              className="flex items-center text-white hover:text-black hover:underline group font-light lg:text-lg"
            >
              <div className="mr-4 text-white group-hover:text-black">
                <Mail size={20} />
              </div>
              <span>demo@gmail.com</span>
            </a>

            <div className="flex items-start text-white hover:text-black group font-light lg:text-lg">
              <div className="mr-4 mt-1 text-white group-hover:text-black">
                <MapPin size={20} />
              </div>
              <div>
                <p>132 Dartmouth Street Boston,</p>
                <p>Massachusetts 02156 United States</p>
              </div>
            </div>
          </div>

          {/* Social Media Icons at Bottom - FIXED hover effect and added correct icons */}
          <div className="mt-auto pt-12">
            <div className="flex space-x-4">
              {/* Twitter */}
              <div className="group bg-black bg-opacity-30 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-white hover:border-black transition-colors duration-200">
                <Twitter
                  size={16}
                  className="text-white group-hover:text-black"
                />
              </div>

              {/* Facebook */}
              <div className="group bg-black bg-opacity-30 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors duration-200">
                <Facebook
                  size={16}
                  className="text-white group-hover:text-black"
                />
              </div>

              {/* Instagram */}
              <div className="group bg-black bg-opacity-30 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-white transition-colors duration-200">
                <Instagram
                  size={16}
                  className="text-white group-hover:text-black"
                />
              </div>
            </div>
          </div>

          {/* Decorative Circles - Positioned exactly as in image */}
          <div className="absolute right-0 bottom-0 pointer-events-none">
            <div className="w-full h-full absolute">
              <div className="absolute right-0 bottom-0 size-48 lg:size-64  opacity-80 rounded-full translate-x-24 translate-y-24 z-20 bg-black"></div>
             
            </div>
            <div className="w-full h-full absolute">
              <div className="absolute size-20 right-[128px] bottom-[123px] lg:size-32 lg:right-[168px] lg:bottom-[145px] opacity-50 rounded-full translate-x-24 translate-y-24 z-20 bg-black"></div>
             
            </div>
           
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white p-8 md:w-3/5 md:min-h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                placeholder="johndoe@email.com"
                className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 012 3456 789"
                className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Subject Selection - Making the entire row clickable */}
          <div className="mt-6">
            <label className="block text-sm text-gray-600 mb-4">
              Select Subject?
            </label>
            <div className="flex flex-wrap gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex items-center">
                  <label
                    className="flex items-center cursor-pointer group"
                    onClick={() => setSelectedSubject(index)}
                  >
                    <div className="w-5 h-5 mr-2 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-100">
                      {selectedSubject === index && (
                        <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center animate-fadeIn">
                          <span className="text-white">✓</span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm">General Inquiry</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div className="mt-6">
            <label className="block text-sm text-gray-600 mb-1">Message</label>
            <textarea
              placeholder="Write your message.."
              rows="3"
              className="w-full p-2 border-b border-gray-300 resize-none focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          {/* Send Button with paper airplane */}
          <div className="mt-8 flex justify-end relative z-30">
            <button className="bg-[#FFB71C] hover:bg-yellow-500 hover:text-sky-950 text-white py-3 px-8 rounded font-medium cursor-pointer">
              Send Message
            </button>
          </div>
          <div className=" absolute hidden md:block md:-bottom-[85px] lg:right-[94px]  xl:right-24 xl:-bottom-12  z-10">
            <img
              src={`${process.env.PUBLIC_URL}/assets/ContactUs/letter_send.png`}
              alt="Aeroplane IMg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
