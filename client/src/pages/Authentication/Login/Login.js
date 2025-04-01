import React from 'react';
import { Facebook } from 'lucide-react';
import authContext from '../../../context/auth/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import OTPVerificationModal from '../Signup/otpVerificationModal';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
const [tempUserId, setTempUserId] = useState('');
const [userEmail, setUserEmail] = useState('');

  const navigate = useNavigate();
  const AuthContext = useContext(authContext);
  const { login, socialLogin, error: authError, isAuthenticated, clearErrors } = AuthContext;

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



  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      toast.success('Login successful!');
      // Login automatically redirects to home page due to useEffect with isAuthenticated
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

const handleGoogleLogin = async () => {
  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Get user information
    const user = result.user;
    const userData = {
      name: user.displayName,
      email: user.email,
      uid: user.uid,
      provider: 'google',
      photoURL: user.photoURL
    };
    
    // Call socialLogin function
    const loginResponse = await socialLogin(userData);
    
    // Check if user is existing
    if (loginResponse.existingUser) {
      toast.info('Welcome back! You logged in with your existing Google account.');
    } else if (loginResponse.needsPhoneVerification) {
      setTempUserId(loginResponse.tempUserId);
      setUserEmail(loginResponse.email || userData.email);
      setShowOtpModal(true);
      toast.info('Please verify your phone number to complete registration');
    } else {
      toast.success('Successfully signed in with Google!');
    }
  } catch (error) {
    console.error('Google login error:', error);
    
    if (error.response?.status === 403) {
      toast.error('Verification required to continue. Please complete the verification process.');
    } else if (error.response?.status === 400) {
      toast.error('Invalid information provided. Please try again.');
    } else {
      toast.error('Google login failed. Please try again.');
    }
  }
};

  // Handle OTP verification modal close
const handleCloseOtpModal = () => {
  setShowOtpModal(false);
};

// Handle OTP verification success
const handleOtpVerificationSuccess = () => {
  setShowOtpModal(false);
  toast.success('Account verification complete! Welcome to Preplings!');
};

  return (
    <div className="min-h-screen flex flex-col mt-2 lg:flex-row bg-gray-50">
      {/* Left side - Hero section */}
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

      {/* Right side - Login form */}
      <div className="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome back!</h2>

          <p className="text-sm text-center mb-6">
            Don't have an account? <Link to='/signup' className="text-blue-500 font-bold underline hover:no-underline">Sign up</Link>
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 text-sm hover:bg-gray-50 transition-colors"  onClick={handleGoogleLogin}>
              <div className="w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </div>
              <span className="font-medium" >Continue with Google</span>
            </button>

            <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 text-sm hover:bg-gray-50 transition-colors">
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
                value={email}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Enter your email"
              />
            </div>



            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ?
                    <EyeOff className="h-5 w-5 text-gray-400" /> :
                    <Eye className="h-5 w-5 text-gray-400" />
                  }
                </button>
              </div>
              <div className="text-right mt-1">
                <Link to='/forgotPassword' className="text-sm font-medium text-black hover:underline">Forgot password?</Link>
              </div>
            </div>
            <div className="text-sm text-gray-700 mb-4">
              By continuing, you agree to our <Link to='/termsofServices' className="text-black font-bold hover:underline">Terms of Service</Link> and <Link to='/privacyPolicy' className="text-black font-bold hover:underline">Privacy Policy</Link>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      <OTPVerificationModal
        isOpen={showOtpModal}
        onClose={handleCloseOtpModal}
        email={userEmail}
        activationToken={tempUserId}
        onVerifySuccess={handleOtpVerificationSuccess}
        onResendOTP={() => {}}
        isSocialSignup={true}
      />
    </div>
  );
};

export default Login;