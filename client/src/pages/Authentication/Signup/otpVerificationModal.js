
import React, { useState, useEffect, useRef,useContext } from 'react';
import { XCircle } from 'lucide-react';
import AuthContext from '../../../context/auth/authContext';
const OTPVerificationModal = ({ isOpen, onClose, email, activationToken, onVerifySuccess, onResendOTP,isSocialSignup = false }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  const auth = useContext(AuthContext);
  // Focus on first input when modal opens
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  // Handle OTP input change
  const handleChange = (index, e) => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Take only the first digit
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };


  // const handleVerify = async () => {
  //   const otpString = otp.join('');
  //   if (otpString.length !== 6) {
  //     setError('Please enter the 6-digit OTP');
  //     return;
  //   }

  //   setIsLoading(true);
  //   setError('');

  //   try {
  //     if (isSocialSignup) {
  //       // For social signup, we need to send the complete parameters the backend expects
  //       await auth.completeSocialRegistration({
  //         tempUserId: activationToken,
  //         otp: otpString,
  //         phoneNumber: email, // If the email field is actually being used for phone number
  //       });
  //     } else {
  //       // Call regular verification
  //       await onVerifySuccess(email, otpString, activationToken);
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };




  // // Handle resend OTP
  // const handleResendOTP = async () => {
  //   setTimer(60);
  //   setError('');

  //   try {
  //     if (isSocialSignup) {
  //       // Call social resend OTP
  //       await auth.resendGooglePhoneOTP({
  //         tempUserId: activationToken,
  //         phoneNumber: email
  //       });
  //     } else {
  //       // Call regular resend OTP
  //       await onResendOTP(email, activationToken);
  //     }
  //   } catch (err) {
  //     setError(err.message || 'Failed to resend OTP. Please try again.');
  //   }
  // };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isSocialSignup) {
        // Social login verification (Google)
        await auth.completeSocialRegistration({
          tempUserId: activationToken,
          otp: otpString,
          phoneNumber: email // The email field is used for phone in social signup
        });

        // Close modal and show success notification
        onClose();
        onVerifySuccess && onVerifySuccess();
      } else {
        // Regular email/password verification
        await onVerifySuccess(email, otpString, activationToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP with proper flow detection
  const handleResendOTP = async () => {
    setTimer(60);
    setError('');

    try {
      if (isSocialSignup) {
        // Social login resend
        await auth.resendGooglePhoneOTP({
          tempUserId: activationToken,
          phoneNumber: email
        });
      } else {
        // Regular registration resend
        await onResendOTP(email, activationToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Verify your Email</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XCircle size={24} />
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            We've sent a 6-digit verification code to <span className="font-medium">{email}</span>.
            Enter the code below to confirm your email address.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-center gap-2 sm:gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                maxLength={1}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading || otp.join('').length !== 6}
            className={`w-full py-3 rounded-md font-medium text-white
              ${isLoading || otp.join('').length !== 6
                ? 'bg-yellow-300 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-600'}`}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Didn't receive a code?{' '}
              {timer > 0 ? (
                <span className="font-medium">Resend in {timer}s</span>
              ) : (
                <button
                  onClick={handleResendOTP}
                  className="text-yellow-600 font-medium hover:text-yellow-700"
                >
                  Resend OTP
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;