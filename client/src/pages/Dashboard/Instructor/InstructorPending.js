import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../../context/auth/authContext';

const InstructorPending = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6">
          <h1 className="text-2xl font-bold text-white">Instructor Application Status</h1>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-yellow-100 rounded-full p-3">
              {/* Clock Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center mb-4">Your Application is Pending Review</h2>

          <p className="text-gray-600 mb-6 text-center">
            Thank you for applying to become an instructor at Preplings! Your application is currently being reviewed by our team.
            You'll receive an email notification once a decision has been made.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Application Details:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><span className="font-medium">Name:</span> {user?.name}</li>
              <li><span className="font-medium">Email:</span> {user?.email}</li>
              <li>
                <span className="font-medium">Application Date:</span> {
                  user?.instructorProfile?.applicationDate
                    ? new Date(user.instructorProfile.applicationDate).toLocaleDateString()
                    : 'Not available'
                }
              </li>
              <li>
                <span className="font-medium">Status:</span>
                <span className="inline-flex items-center ml-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Our team reviews your application (typically within 2-3 business days)</li>
              <li>You'll receive an email notification with the decision</li>
              <li>If approved, you'll gain access to the instructor dashboard</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              to="/courses"
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Courses
            </Link>
            <Link
              to="/"
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorPending;
