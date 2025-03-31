import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import authContext from '../../../context/auth/authContext';
const Signup = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    languageId: '',
    learningGoal: '',
    phoneNumber: ''
  });
  const [isGoalDropdownOpen, setIsGoalDropdownOpen] = useState(false);
  const learningGoals = ["Casual", "Professional", "Exam Prep"];
  const [error, setError] = useState('');

  const navigate = useNavigate();


  const auth = useContext(authContext);
  const {
    register,
    socialLogin,
    error: authError,
    isAuthenticated,
    clearErrors,
    languages,
    fetchAllLanguages
  } = auth;

  // Fetch languages on component mount
  useEffect(() => {
    fetchAllLanguages();
  }, []);

  useEffect(() => {
    // If already authenticated, redirect to homepage
    if (isAuthenticated) {
      navigate('/');
    }

    if (authError) {
      setError(authError);
      clearErrors();
    }
  }, [isAuthenticated, authError, navigate, clearErrors]);

  // Update language ID when a language is selected
  useEffect(() => {
    if (selectedLanguage) {
      // Find the language object with the matching name
      const languageObj = languages.find(lang => lang.name === selectedLanguage);
      if (languageObj) {
        setFormData({ ...formData, languageId: languageObj._id });
      }
    }
  }, [selectedLanguage, languages]);


  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
    } else {
      register(formData);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleGoogleLogin = () => {
    // Handle Google login
    const userData = {
      provider: 'google',
      // Add other required fields from Google response
    };
    socialLogin(userData);
  };

  const handleFacebookLogin = () => {
    // Handle Facebook login
    const userData = {
      provider: 'facebook',
      // Add other required fields from Facebook response
    };
    socialLogin(userData);
  };


  return (
    <div className="min-h-screen flex flex-col mt-2 lg:flex-row bg-gray-50">
      {/* Left side - Hero section - Similar to login page structure */}
      <div className="relative w-full lg:w-3/5 bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('assets/Authentication/A_image.png')",
            opacity: "0.8"
          }}>
        </div>

        <div className="relative z-10 p-8 lg:p-12 xl:p-16 h-full flex flex-col justify-center">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-700 mb-4">
            Master the new Language
          </h1>

          <p className="text-md lg:text-lg text-gray-600 mb-10">
            Access personalized exam preparation, live classes and record
            courses to master the language
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-black text-white rounded-full p-2 mr-3">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-gray-700 font-medium">Exam Preparation materials</span>
            </div>

            <div className="flex items-center">
              <div className="bg-black text-white rounded-full p-2 mr-3">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-gray-700 font-medium">Live interactive classes</span>
            </div>

            <div className="flex items-center">
              <div className="bg-black text-white rounded-full p-2 mr-3">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-gray-700 font-medium">Recorded courses library</span>
            </div>
          </div>

          <div className="mt-10 bg-white p-6 rounded-lg shadow-md max-w-sm">
            <h3 className="text-xl font-semibold text-gray-800">Special Launch Offer</h3>
            <div className="text-2xl font-bold text-red-600 my-2">30% OFF</div>
            <p className="text-gray-600">Limited time offer for new users</p>
          </div>
        </div>
      </div>

      {/* Right side - Sign Up form */}
      <div className="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-2xl font-bold text-center mb-1">Welcome!</h2>
          <h3 className="text-lg font-semibold text-center mb-2">Create your account</h3>

          <p className="text-sm text-center mb-6">
            Already have an account? <a onClick={handleLoginClick} className="text-blue-500 font-bold underline hover:no-underline cursor-pointer">Login</a>
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Which language do you want to learn?</label>
            <div className="relative">
              <button
                type="button"
                className="w-full text-left bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedLanguage || 'Select the language you want to learn'}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                  {languages.map((language) => (
                    <div
                      key={language._id}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                      onClick={() => {
                        setSelectedLanguage(language.name);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {language.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">


            {/* Google Login button div */}
            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 text-sm hover:bg-gray-50 transition-colors"
              onClick={handleGoogleLogin}

            >
              <div className="w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </div>
              <span className="font-medium">Continue with Google</span>
            </button>

            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 text-sm hover:bg-gray-50 transition-colors"
              onClick={handleFacebookLogin}>
              <div className="w-5 h-5 flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span className="font-medium">Continue with Facebook</span>
            </button>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">Or sign up with email</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email"
                type="email"
                onChange={onChange}
                value={formData.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                onChange={onChange}
                value={formData.password}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
            {/* New */}
            <div className="mb-6">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                id="mobile"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Enter your Mobile"
              />
            </div>

            {/* New */}
            <div className="mb-6">
              <label htmlFor="lgoal" className="block text-sm font-medium text-gray-700 mb-2">Learning Goal</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full text-left bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none"
                  onClick={() => setIsGoalDropdownOpen(!isGoalDropdownOpen)}
                >
                  {formData.learningGoal || 'Select your learning goal'}
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </span>
                </button>

                {isGoalDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                    {learningGoals.map((goal) => (
                      <div
                        key={goal}
                        className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                        onClick={() => {
                          setFormData({ ...formData, learningGoal: goal });
                          setIsGoalDropdownOpen(false);
                        }}
                      >
                        {goal}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md transition-colors"
            >
              Sign Up
            </button>

            <p className="mt-4 text-xs text-center text-gray-500">
              By continuing, you agree to our <a href="#" className="text-black font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-black font-bold hover:underline">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;