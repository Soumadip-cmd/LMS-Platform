import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../../../context/auth/authContext";
import OTPVerificationModal from "./otpVerificationModal";
import { toast } from "react-toastify";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";
import firebaseApp from "../../../utlils/firebase.js";
const Signup = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    languageId: "",
    learningGoal: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isGoalDropdownOpen, setIsGoalDropdownOpen] = useState(false);
  const learningGoals = ["Casual", "Professional", "Exam Prep"];
  const [error, setError] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [activationToken, setActivationToken] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [isCountryCodeDropdownOpen, setIsCountryCodeDropdownOpen] =
    useState(false);
  const [filteredCountryCodes, setFilteredCountryCodes] = useState(null);

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();

        // Extract the country codes and sort them
        const codes = data
          .filter((country) => country.idd.root) // Some countries might not have dial codes
          .map((country) => ({
            code: `${country.idd.root}${
              country.idd.suffixes ? country.idd.suffixes[0] : ""
            }`,
            country: country.name.common,
            flag: country.flags.png,
          }))
          .sort((a, b) => a.country.localeCompare(b.country));

        setCountryCodes(codes);

        // Set default country code if needed (e.g., to India)
        const india = codes.find((item) => item.country === "India");
        if (india) {
          setSelectedCountryCode(india.code);
        }
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };

    fetchCountryCodes();
  }, []);
  const navigate = useNavigate();

  const auth = useContext(AuthContext);
  const {
    register,
    socialLogin,
    verifyOTPAndRegister,
    resendGooglePhoneOTP,
    resendOTP,
    error: authError,
    isAuthenticated,
    clearErrors,
    languages,
    fetchAllLanguages,
  } = auth;

  // Fetch languages on component mount
  useEffect(() => {
    fetchAllLanguages();
  }, []);

  useEffect(() => {
    // If already authenticated, redirect to homepage
    if (isAuthenticated) {
      navigate("/");
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
      const languageObj = languages.find(
        (lang) => lang.name === selectedLanguage
      );
      if (languageObj) {
        setFormData({ ...formData, languageId: languageObj._id });
      }
    }
  }, [selectedLanguage, languages]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.languageId || !formData.learningGoal || !formData.phoneNumber) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      // Combine country code with phone number
      const combinedPhoneNumber = selectedCountryCode + formData.phoneNumber;

      // Create modified formData with the combined phone number
      const modifiedFormData = {
        ...formData,
        phoneNumber: combinedPhoneNumber,
      };

      // Call register with modified formData
      const response = await register(modifiedFormData);

      if (response.success) {
        toast.info(
          "Verification code sent to your email. Please verify your account."
        );
        setActivationToken(response.activationToken);
        setRegisteredEmail(formData.email);
        setIsOtpModalOpen(true);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleVerifyOTP = async (email, otp, activationToken) => {
    try {
      console.log('Verifying OTP in Signup.js:', { email, otp, activationToken });

      // Validate inputs
      if (!email || !otp || !activationToken) {
        const errorMsg = 'Missing required verification information';
        console.error(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Call verifyOTPAndRegister from auth context
      const response = await auth.verifyOTPAndRegister({ email, otp, activationToken });
      console.log('OTP verification successful:', response);

      // Show success toast
      toast.success("Registration successful! You can now login.");

      // Close the modal and redirect to login page on success
      setIsOtpModalOpen(false);
      navigate("/auth/login");
    } catch (err) {
      console.error('OTP verification error in Signup.js:', err);

      // Handle specific error cases
      let errorMessage;
      if (err.response?.status === 400 && err.response?.data?.message?.includes('expired')) {
        errorMessage = 'Verification code has expired. Please request a new code.';
      } else if (err.response?.status === 400 && err.response?.data?.message?.includes('invalid')) {
        errorMessage = 'Invalid verification code. Please check and try again.';
      } else {
        errorMessage = err.response?.data?.message || "OTP verification failed. Please try again.";
      }

      toast.error(errorMessage);
      throw err; // Rethrow error to be handled in the OTP modal component
    }
  };

  // Function to handle resend OTP
  const handleResendOTP = async (email, activationToken) => {
    try {
      console.log('Attempting to resend OTP for:', { email, activationToken });

      // Validate email
      if (!email) {
        const errorMsg = 'Missing email address';
        console.error(errorMsg);
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Call resendOTP from auth context
      const response = await auth.resendOTP({ email, activationToken });

      // If we received a new activation token, update it
      if (response.activationToken) {
        console.log('Updating activation token:', response.activationToken);
        setActivationToken(response.activationToken);
      }

      // Show success message
      toast.success('Verification code resent successfully!');
      console.log('OTP resent successfully:', response);

      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to resend verification code';
      console.error('Resend OTP error:', err);
      toast.error(errorMsg);

      // If the error indicates we need to restart registration, redirect to signup
      if (errorMsg.includes('start registration again')) {
        toast.info('Please start the registration process again.');
        setTimeout(() => {
          setIsOtpModalOpen(false);
          // Clear form data to start fresh
          setFormData({
            name: '',
            email: '',
            password: '',
            phoneNumber: '',
            languageId: '',
            learningGoal: ''
          });
        }, 2000);
      }

      throw err;
    }
  };

  const handleLoginClick = () => {
    navigate("/auth/login");
  };



  const handleGoogleLogin = async () => {
    try {
      const auth = getAuth(firebaseApp);
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        uid: result.user.uid,
        provider: "google",
        photoURL: result.user.photoURL,
      };

      try {
        const response = await socialLogin(userData);

        // Check if this is an existing user
        if (response.existingUser) {
          toast.info(
            "This email is already registered. Please login with Google instead."
          );
          // Redirect to login page after a short delay
          setTimeout(() => navigate("/auth/login"), 2000);
          return;
        }

        // New user registration flow
        if (response && response.needsPhoneVerification) {
          console.log("Phone verification needed, opening modal with:", {
            tempUserId: response.tempUserId,
            email: response.email,
          });
          setActivationToken(response.tempUserId);
  setRegisteredEmail(response.email);
  setIsOtpModalOpen(true);

          toast.info(
            "Please verify your phone number to complete registration"
          );
        } else {
          // User signed in successfully
          toast.success("Google login successful!");
          // Redirect to home page
          setTimeout(() => navigate("/"), 1500);
        }
      } catch (error) {
        // Check specifically for already registered errors
        if (error.response?.status === 403) {
          if (error.response?.data?.needsPhoneVerification) {
            // User exists but needs to complete phone verification
            console.log(
              "Phone verification needed from error response:",
              error.response.data
            );
            toast.info(
              "Please verify your phone number to complete registration."
            );
            setActivationToken(error.response.data.tempUserId);
            setRegisteredEmail(error.response.data.email);
            setIsOtpModalOpen(true);
          } else {
            // User exists and should login instead
            toast.info(
              "This email is already registered. Please login with Google instead."
            );
            setTimeout(() => navigate("/auth/login"), 2000);
          }
        } else if (
          error.response?.status === 409 ||
          (error.response?.data?.message &&
            error.response?.data?.message.includes("already exists"))
        ) {
          // Explicit "already exists" error
          toast.info(
            "This email is already registered. Please login with Google instead."
          );
          setTimeout(() => navigate("/auth/login"), 2000);
        } else {
          // General error handling
          console.error("Backend error:", error);
          toast.error(
            "Signup failed: " +
              (error.response?.data?.message ||
                error.message ||
                "Please try again")
          );
        }
      }
    } catch (error) {
      // Firebase popup error handling
      console.error("Google login full error:", error);

      // Check for specific Firebase errors
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "An account already exists with the same email address but different sign-in credentials. Sign in using the original provider."
        );
      } else if (error.code === "auth/popup-closed-by-user") {
        toast.info(
          "Google sign-in was cancelled. Please try again if you want to continue."
        );
      } else if (error.code === "auth/cancelled-popup-request") {
        // No need to show error for this case
        console.log("Popup request cancelled");
      } else {
        toast.error(
          "Google signup failed: " + (error.message || "Please try again")
        );
      }
    }
  };

  const handleFacebookLogin = () => {
    // Handle Facebook login
    const userData = {
      provider: "facebook",
      // Add other required fields from Facebook response
    };
    socialLogin(userData);
  };

  return (
    <div className="min-h-screen flex flex-col mt-2 lg:flex-row bg-gray-50">
      {/* Left side - Hero section - Similar to login page structure */}
      <div className="relative w-full lg:w-3/5 bg-gradient-to-br from-gray-100 to-gray-300">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/assets/Authentication/A_image.png)`,
            opacity: "0.8",
          }}
        ></div>

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
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-gray-700 font-medium">
                Exam Preparation materials
              </span>
            </div>

            <div className="flex items-center">
              <div className="bg-black text-white rounded-full p-2 mr-3">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-gray-700 font-medium">
                Live interactive classes
              </span>
            </div>

            <div className="flex items-center">
              <div className="bg-black text-white rounded-full p-2 mr-3">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-gray-700 font-medium">
                Recorded courses library
              </span>
            </div>
          </div>

          <div className="mt-10 bg-white p-6 rounded-lg shadow-md max-w-sm">
            <h3 className="text-xl font-semibold text-gray-800">
              Special Launch Offer
            </h3>
            <div className="text-2xl font-bold text-red-600 my-2">30% OFF</div>
            <p className="text-gray-600">Limited time offer for new users</p>
          </div>
        </div>
      </div>

      {/* Right side - Sign Up form */}
      <div className="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-2xl font-bold text-center mb-1">Welcome!</h2>
          <h3 className="text-lg font-semibold text-center mb-2">
            Create your account
          </h3>

          <p className="text-sm text-center mb-6">
            Already have an account?{" "}
            <Link
              to='/auth/login'
              className="text-blue-500 font-bold underline hover:no-underline cursor-pointer"
            >
              Login
            </Link>
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which language do you want to learn? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                className={`w-full text-left bg-white border ${!formData.languageId && error ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span
                  className={
                    selectedLanguage ? "text-gray-900" : "text-gray-400"
                  }
                >
                  {selectedLanguage || "Select the language you want to learn"}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </span>
              </button>
              {!formData.languageId && error && (
                <p className="text-red-500 text-xs mt-1">Please select a language</p>
              )}

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

          <div className="mb-6">
              <label
                htmlFor="lgoal"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Learning Goal <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  className={`w-full text-left bg-white border ${!formData.learningGoal && error ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none`}
                  onClick={() => setIsGoalDropdownOpen(!isGoalDropdownOpen)}
                >
                  <span
                    className={
                      formData.learningGoal ? "text-gray-900" : "text-gray-400"
                    }
                  >
                    {formData.learningGoal || "Select your learning goal"}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </span>
                </button>
                {!formData.learningGoal && error && (
                  <p className="text-red-500 text-xs mt-1">Please select a learning goal</p>
                )}

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

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Google Login button div */}
            <button
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 text-sm hover:bg-gray-50 transition-colors"
              onClick={handleGoogleLogin}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <span className="font-medium">Continue with Google</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 text-sm hover:bg-gray-50 transition-colors"
              onClick={handleFacebookLogin}
            >
              <div className="w-5 h-5 flex items-center justify-center text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span className="font-medium">Continue with Facebook</span>
            </button>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">
              Or sign up with email
            </span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={onChange}
                value={formData.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={onChange}
                value={formData.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={onChange}
                value={formData.password}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Enter your password"
              />
            </div> */}

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={onChange}
                  value={formData.password}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Enter your password"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            {/* New */}

            {/* <div className="mb-6">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="flex">

                <div className="relative w-1/3 mr-2">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    onClick={() => setIsCountryCodeDropdownOpen(!isCountryCodeDropdownOpen)}
                  >
                    <span>{selectedCountryCode}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {isCountryCodeDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-60 bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                      {countryCodes.map((item) => (
                        <div
                          key={item.code}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-2 hover:bg-gray-100"
                          onClick={() => {
                            setSelectedCountryCode(item.code);
                            setIsCountryCodeDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            {item.flag && <img src={item.flag} className="w-5 h-3 mr-2" alt={item.country} />}
                            <span className="font-medium">{item.code}</span>
                            <span className="ml-2 text-gray-500 text-xs truncate">{item.country}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>


                <input
                  id="mobile"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={onChange}
                  className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div> */}

            <div className="mb-6">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                {/* Country code dropdown */}
                <div className="relative w-1/3 mr-2">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    onClick={() =>
                      setIsCountryCodeDropdownOpen(!isCountryCodeDropdownOpen)
                    }
                  >
                    <span>{selectedCountryCode}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {isCountryCodeDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-72 bg-white shadow-lg rounded-md py-1 text-base overflow-hidden focus:outline-none sm:text-sm">
                      {/* Search input */}
                      <div className="px-3 py-2 border-b border-gray-200">
                        <input
                          type="text"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          placeholder="Search country..."
                          onChange={(e) => {
                            const searchTerm = e.target.value
                              .toLowerCase()
                              .trim();

                            // More lenient search that matches partial words
                            const filteredCodes = countryCodes.filter(
                              (item) =>
                                item.country
                                  .toLowerCase()
                                  .includes(searchTerm) ||
                                item.code.toLowerCase().includes(searchTerm) ||
                                // Add a specific check for Pakistan (or other common countries)
                                (searchTerm === "pakista" &&
                                  item.country.toLowerCase() === "pakistan")
                            );

                            // If no results found with exact match, do a more fuzzy search
                            if (filteredCodes.length === 0) {
                              const fuzzyFilteredCodes = countryCodes.filter(
                                (item) =>
                                  item.country
                                    .toLowerCase()
                                    .indexOf(
                                      searchTerm.substring(
                                        0,
                                        Math.max(searchTerm.length - 1, 1)
                                      )
                                    ) >= 0
                              );
                              setFilteredCountryCodes(fuzzyFilteredCodes);
                            } else {
                              setFilteredCountryCodes(filteredCodes);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Country list */}
                      <div className="max-h-60 overflow-y-auto">
                        {(filteredCountryCodes || countryCodes).map((item) => (
                          <div
                            key={item.code}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-2 hover:bg-gray-100"
                            onClick={() => {
                              setSelectedCountryCode(item.code);
                              setIsCountryCodeDropdownOpen(false);
                              setFilteredCountryCodes(null); // Reset filtered results
                            }}
                          >
                            <div className="flex items-center">
                              {item.flag && (
                                <img
                                  src={item.flag}
                                  className="w-5 h-3 mr-2"
                                  alt={item.country}
                                />
                              )}
                              <span className="font-medium">{item.code}</span>
                              <span className="ml-2 text-gray-500 text-xs truncate">
                                {item.country}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone number input */}
                <input
                  id="mobile"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={onChange}
                  className="w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>
            {/* New */}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md transition-colors"
            >
              Sign Up
            </button>

            <p className="mt-4 text-xs text-center text-gray-500">
              By continuing, you agree to our{" "}
              <Link
                to="/legal/terms-of-service"
                className="text-black font-bold hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/legal/privacy-policy"
                className="text-black font-bold hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Otp Modal for verify the email and mobile after register to avoid duplicate and redundate value */}
      <OTPVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        email={registeredEmail}
        activationToken={activationToken}
        onVerifySuccess={handleVerifyOTP}
        onResendOTP={handleResendOTP}
        isSocialSignup={false}
      />
    </div>
  );
};

export default Signup;
