import React, { useState, useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../../context/auth/authContext";
import { useNavigate } from "react-router-dom";
const GetitNow = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 25,
    hours: 22,
    minutes: 34,
    seconds: 14,
  });
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/become-an-instructor');
  };

  const handleRegisterNow = () => {
    navigate('/auth/login');
  };
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const { fullName, email, phone } = formData;
  const auth = useContext(AuthContext);
  const { getItNow } = auth;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await getItNow(formData);
      setSuccess(true);
      // Clear form
      setFormData({ fullName: '', email: '', phone: '' });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              hours = 23;
              if (days > 0) {
                days -= 1;
              } else {
                clearInterval(timer);
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="flex flex-grow flex-col md:flex-row items-center justify-between w-full bg-[#EAF5FF] px-8 py-8 md:px-16">
        {/* Left Section */}
        <div className="w-full md:w-1/2 xl:w-1/3 mb-10 md:mb-0 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold md:mb-2">
            FREE Resources
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold md:mb-4">
            Learning German
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">for Beginner</h3>

          <p className="text-gray-600 mb-8">
            Learning new languages connect to the world and
            <br />
            become a global citizen with Preplings
          </p>

          {/* Timer */}
          <div className="flex space-x-8 justify-center md:justify-normal">
            <div className="flex flex-col items-center ">
              <span className="text-4xl font-bold text-blue-500">
                {timeLeft.days}
              </span>
              <span className="text-sm text-gray-500">DAYS</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-blue-500">
                {timeLeft.hours}
              </span>
              <span className="text-sm text-gray-500">HOURS</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-blue-500">
                {timeLeft.minutes}
              </span>
              <span className="text-sm text-gray-500">MINUTES</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-blue-500">
                {timeLeft.seconds}
              </span>
              <span className="text-sm text-gray-500">SECONDS</span>
            </div>
          </div>
        </div>

        {/* Middle Section - Book Image */}
        <div className="w-full md:w-0 xl:w-1/3 flex justify-center mb-10 md:mb-0  md:hidden xl:block">
          <img
            src="https://res.cloudinary.com/deg0l45uc/image/upload/v1753081751/Client/Group_68_trhkgq.png"
            alt="German Learning Book"
            className="w-auto h-auto"
          />
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 xl:w-1/3 max-w-md md:ml-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit}   className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={fullName}
                  onChange={onChange}
                  className="w-full py-3 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="w-full py-3 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none"
                  placeholder="Email"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={onChange}
                  className="w-full py-3 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none"
                  placeholder="Phone"
                />
              </div>

              <button
  type="submit"
  disabled={loading}
  className="w-full py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
>
  {loading ? 'Processing...' : 'Get It Now'}
</button>

{error && (
  <div className="text-red-500 text-sm mt-2">
    {error}
  </div>
)}

{success && (
  <div className="text-green-500 text-sm mt-2">
    Thank you! Your German learning resources have been sent to your email.
  </div>
)}
            </form>
          </div>
        </div>
        {/*  */}
      </div>


      {/* the become tutor part */}

      <div className="flex flex-col lg:flex-row gap-4 xl:gap-12 p-4 mx-auto md:mx-8 2xl:mx-12 mt-12">
      {/* Become An Instructor Card */}
      <div className="flex-1 bg-[#F3EDF0] rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Become An Instructor</h2>

          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0 md:mr-4 md:max-w-xs">
              <p className="text-gray-700 mb-6">
                Top instructors from around the world teach millions of students on Preplings
              </p>

              <button  onClick={handleButtonClick}  className="bg-[#1976D2] text-white py-2 px-6 rounded font-medium hover:bg-blue-700 transition-colors">
                Start teaching today
              </button>
            </div>

            {/* Hidden on desktop, shown on mobile as full width */}
            <div className="hidden sm:block md:mt-0">
              <img
                src="https://placehold.co/200x160"
                alt="Group of instructors"
                className="w-52 h-40 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full width image for mobile */}
        <div className="sm:hidden w-full h-48">
          <img
            src="https://placehold.co/400x240"
            alt="Group of instructors"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Transform Access Card */}
      <div className="flex-1 bg-[#F3EDF0] rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Transform Access To Education</h2>

          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0 md:mr-4 md:max-w-xs">
              <p className="text-gray-700 mb-6">
                Create an account to receive our newsletter.
                Course recommendations and promotions.
              </p>

              <button onClick={handleRegisterNow} className="bg-[#1976D2] text-white py-2 px-6 rounded font-medium hover:bg-blue-700 transition-colors">
                Register for free
              </button>
            </div>

            {/* Hidden on desktop, shown on mobile as full width */}
            <div className="hidden sm:block md:mt-0">
              <img
                src="https://placehold.co/160x120"
                alt="Education platform interface"
                className="w-40 h-32 object-cover rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Full width image for mobile */}
        <div className="sm:hidden w-full h-48">
          <img
            src="https://placehold.co/400x240"
            alt="Education platform interface"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default GetitNow;
