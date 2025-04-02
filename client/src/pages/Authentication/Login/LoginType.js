import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginType = () => {
  const navigate = useNavigate();

  // Navigation handlers with updated professional paths
  const handleStudentLogin = () => {
    navigate('/dashboard/student');
  };

  const handleInstructorLogin = () => {
    navigate('/dashboard/instructor');
  };

  const handleAdminLogin = () => {
    navigate('/dashboard/admin');
  };

  return (
    <div className="relative w-full flex justify-center items-center" style={{ minHeight: "calc(100vh - 128px)" }}>
      {/* Background Image with classroom students */}
      <div className="absolute inset-0 z-0">
        <img
          src="assets/Authentication/LoginTypebg.png"
          alt="classroom background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Login Container with Yellow Overlay */}
      <div className="relative z-0 flex flex-col items-center justify-center w-full py-16">
        <div className="relative bg-[#FFB71CC4] p-10 mx-auto rounded-t-2xl rounded-bl-2xl w-full max-w-[703px] max-h-[508px]">
          {/* Gray circle - EXACT ORIGINAL POSITIONING */}
          <div className="absolute bottom-[16px] right-[0px] md:right-[47px] size-32 md:size-52 bg-gray-500 rounded-full -mt-12 z-10"></div>
          
          {/* Black corner shape - partial circle - EXACT ORIGINAL POSITIONING */}
          <div className="absolute bottom-0 right-0 overflow-hidden z-20">
            <div className="relative size-52 md:size-[17rem] -bottom-24 -right-24">
              <div className="absolute w-full h-full bg-black rounded-full bottom-0 md:-right-[1px] -right-[28px]"></div>
            </div>
          </div>
          
          {/* Login Buttons - Responsive Width */}
          <div className="flex m-5 flex-col justify-center items-center space-y-20 p-2 md:p-6 relative z-30">
            <button
              className="w-full max-w-[320px] py-3 bg-[#00AB5B] hover:bg-green-600 text-white font-medium text-lg md:text-2xl rounded-lg"
              onClick={handleStudentLogin}
            >
              Login as Student
            </button>
            
            <button
              className="w-full max-w-[320px] py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium text-lg md:text-2xl rounded-lg"
              onClick={handleInstructorLogin}
            >
              Login as Instructor
            </button>
            
            <button
              className="w-full max-w-[320px] py-3 bg-black hover:bg-gray-800 text-white font-medium text-lg md:text-2xl rounded-lg"
              onClick={handleAdminLogin}
            >
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginType;