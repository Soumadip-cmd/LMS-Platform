import React, { useState, useEffect } from "react";
import {
  Twitter,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
} from "lucide-react";
import axios from "axios";
import { SERVER_URI } from "../../utlils/ServerUri";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
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
  const [formdata,setFormdata]=useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    subject: "General Inquiry",
    message: ""
  })
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");


  // Show airplane animation when radio button is selected
  // useEffect(() => {
  //   if (selectedSubject !== null) {
  //     setShowAirplane(true);

  //     // Hide airplane after animation completes
  //     const timer = setTimeout(() => {
  //       setShowAirplane(false);
  //     }, 3000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [selectedSubject]);


  const handleChnage=(e)=>{
   setFormdata({
    ...formdata,
    [e.target.name]:e.target.value
   })
  }


 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!formdata.firstName || !formdata.lastName || !formdata.email || 
        !formdata.phoneNumber || !formdata.subject || !formdata.message) {
        setError("All fields are required");
        setLoading(false);
        return;
      }
  
      const response = await axios.post(`${SERVER_URI}/contact/create`, formdata);
      
      if (response.data.success) {
        setSuccess(true);
        // Reset form
        setFormdata({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          subject: "General Inquiry",
          message: ""
        });
        setSelectedSubject(0);
        
        // Show airplane animation after successful submission
        setShowAirplane(true);
        // Hide airplane after animation completes
        setTimeout(() => {
          setShowAirplane(false);
        }, 3000);
      } else {
        setError(response.data.message || "Something went wrong");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit form");
      console.error("Contact submission error:", error);
    } finally {
      setLoading(false);
    }
  }
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
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                name="firstName"
              value={formdata.firstName}
              onChange={handleChnage}
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
                name="lastName"
              value={formdata.lastName}
              onChange={handleChnage}
                className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                placeholder="johndoe@email.com"
                name="email"
              value={formdata.email}
              onChange={handleChnage}
                className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
              value={formdata.phoneNumber}
              onChange={handleChnage}
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
              name="message"
              value={formdata.message}
              onChange={handleChnage}
              className="w-full p-2 border-b border-gray-300 resize-none focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

           {/* Error message */}
        {error && (
          <div className="mt-4 text-red-500 text-sm">{error}</div>
        )}
        
        {/* Success message */}
        {success && (
          <div className="mt-4 text-green-500 text-sm">
            Thank you for contacting us! We'll get back to you soon.
          </div>
        )}


          {/* Send Button with paper airplane */}
          <div className="mt-8 flex justify-end relative z-30">
            <button 
            type="submit"
            disabled={loading}
            className="bg-[#FFB71C] hover:bg-yellow-500 hover:text-sky-950 text-white py-3 px-8 rounded font-medium cursor-pointer"
            >
              {loading ? (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ) : 'Send Message'}
            </button>
          </div>
          {/* <div className=" absolute hidden md:block md:-bottom-[85px] lg:right-[94px]  xl:right-24 xl:-bottom-12  z-10">
            <img
              src={`${process.env.PUBLIC_URL}/assets/ContactUs/letter_send.png`}
              alt="Aeroplane IMg"
            />


          </div> */}

<div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-80" style={{display: showAirplane ? 'flex' : 'none'}}>
  <DotLottieReact
    src="https://lottie.host/dd0b4e5d-ca0e-4cfc-98f4-498d5826677d/viJAnKlRss.lottie"
    loop
    autoplay
    style={{ width: '80vw', height: '80vh', maxWidth: '500px', maxHeight: '500px' }}
  />
</div>
          </form>
        </div>
       
      </div>
      
    </div>
  );
};

export default ContactUs;
