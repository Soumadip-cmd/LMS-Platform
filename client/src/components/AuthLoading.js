// import React from 'react';

// const LoadingScreen = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <div className="relative flex flex-col items-center">
//         {/* Logo */}
//         <div className="mb-4">
//           <img 
//             src={`${process.env.PUBLIC_URL}/assets/logo.png`} 
//             alt="Preplings" 
//             className="h-16 w-auto"
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.style.display = 'none';
//             }}
//           />
//         </div>

//         {/* Main loading animation */}
//         <div className="flex space-x-2 mb-6">
//           <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//           <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//           <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//           <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
//         </div>

//         {/* Loading text */}
//         <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading your experience</h2>
//         <p className="text-sm text-gray-600 text-center max-w-xs">Preparing your personalized language learning journey..May be you are not authorized please Login with valid login detaiks</p>
        
//         {/* Progress bar (animated) */}
//         <div className="w-64 h-1 bg-gray-200 rounded-full mt-6 overflow-hidden">
//           <div className="h-full bg-yellow-500 rounded-full animate-progress"></div>
//         </div>
//       </div>
      
//       {/* Language icons (decorative) */}
//       <div className="mt-12 flex flex-wrap justify-center gap-4 max-w-md mx-auto">
//         <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-sm font-bold">EN</div>
//         <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-sm font-bold">FR</div>
//         <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 text-sm font-bold">DE</div>
//         <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 text-sm font-bold">ES</div>
//         <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-800 text-sm font-bold">ZH</div>
//       </div>
//     </div>
//   );
// };

// // Add this CSS to your global stylesheet or inline styles
// const globalStyles = `
// @keyframes progress {
//   0% { width: 10%; }
//   50% { width: 60%; }
//   100% { width: 90%; }
// }

// .animate-progress {
//   animation: progress 1.5s ease-in-out infinite;
// }
// `;

// const LoadingComponent = () => {
//   return (
//     <>
//       <style>{globalStyles}</style>
//       <LoadingScreen />
//     </>
//   );
// };

// export default LoadingComponent;

import React from 'react';
import { Link } from 'react-router-dom';

const LoadingScreen = ({ isAuthError = false }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="relative flex flex-col items-center">
        {/* Logo */}
        <div className="mb-4">
          <img 
            src={`${process.env.PUBLIC_URL}/assets/logo.png`} 
            alt="Preplings" 
            className="h-16 w-auto"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Main loading animation - only show if not an auth error */}
        {!isAuthError && (
          <div className="flex space-x-2 mb-6">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
          </div>
        )}

        {/* Loading or Error text */}
        {isAuthError ? (
          <>
            <div className="mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-sm text-gray-600 text-center max-w-xs mb-6">
              Please log in to access this area. Only authorized users can view this content.
            </p>
            <Link to="/auth/login" className="py-2 px-6 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md transition-colors">
              Log In
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading your experience</h2>
            <p className="text-sm text-gray-600 text-center max-w-xs">Preparing your personalized language learning journey</p>
            
            {/* Progress bar (animated) */}
            <div className="w-64 h-1 bg-gray-200 rounded-full mt-6 overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full animate-progress"></div>
            </div>
          </>
        )}
      </div>
      
      {/* Language icons (decorative) */}
      <div className="mt-12 flex flex-wrap justify-center gap-4 max-w-md mx-auto">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-sm font-bold">EN</div>
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-sm font-bold">FR</div>
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 text-sm font-bold">DE</div>
        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 text-sm font-bold">ES</div>
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-800 text-sm font-bold">ZH</div>
      </div>
    </div>
  );
};

// Add this CSS to your global stylesheet or inline styles
const globalStyles = `
@keyframes progress {
  0% { width: 10%; }
  50% { width: 60%; }
  100% { width: 90%; }
}

.animate-progress {
  animation: progress 1.5s ease-in-out infinite;
}
`;

const LoadingComponent = ({ isAuthError = false }) => {
  return (
    <>
      <style>{globalStyles}</style>
      <LoadingScreen isAuthError={isAuthError} />
    </>
  );
};

export default LoadingComponent;