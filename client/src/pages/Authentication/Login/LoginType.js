import React from 'react';

const LoginType = () => {
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
      <div className="relative z-10 flex flex-col items-center justify-center w-full py-16">
        <div className="relative bg-yellow-400 bg-opacity-80 p-8 w-full max-w-md mx-auto rounded-t-2xl rounded-bl-2xl">
          {/* Gray circle */}
          <div className="absolute top-1/2 right-8 w-24 h-24 bg-gray-500 rounded-full opacity-60 -mt-12 z-10"></div>
          
          {/* Black corner shape - partial circle */}
          <div className="absolute bottom-0 right-0 overflow-hidden z-20">
            <div className="relative w-48 h-48 -bottom-24 -right-24">
              <div className="absolute w-full h-full bg-black rounded-full opacity-80"></div>
            </div>
          </div>
          
          {/* Login Buttons */}
          <div className="flex m-5 flex-col space-y-12 px-6 py-6 relative z-30">
            <button
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded"
            >
              Login as Student
            </button>
            
            <button
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded"
            >
              Login as Instructor
            </button>
            
            <button
              className="w-full py-3 bg-black hover:bg-gray-800 text-white font-medium rounded"
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