"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, X, Mail } from "lucide-react";
import { useState } from "react";
import axios from "@/lib/axios";
import { setAuthToken, setUser } from "@/lib/auth";

export default function SignUp() {
  const router = useRouter();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = () => {
    router.push("/setup");
  };

  const handleEmailSubmit = async () => {
    if (!email) return;

    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post("/auth/sign-in", { email });

      if (response.status === 200 || response.status === 201) {
        setShowEmailModal(false);
        setShowOTPModal(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOTPKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }

    if (e.key === "Enter" && otp.every((digit) => digit !== "")) {
      handleOTPSubmit();
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Only accept digits
    const digits = pastedData.replace(/\D/g, "");

    if (digits.length === 6) {
      const newOtp = digits.split("");
      setOtp(newOtp);

      // Focus the last input
      const lastInput = document.getElementById("otp-5");
      lastInput?.focus();
    }
  };

  const handleOTPSubmit = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) return;

    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post("/auth/sign-in-verify", {
        email,
        code: otpString,
      });

      if (response.data.success) {
        // Store the access token
        setAuthToken(response.data.accessToken);

        // Store user data
        setUser(response.data.user);

        // Check if it's a new user
        if (response.data.isNewUser) {
          // Redirect to setup page for new users
          router.push("/setup");
        } else {
          // Redirect to products page for existing users
          router.push("/products");
        }
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
        <div className="flex items-center">
          <button className="mr-2 sm:mr-3 p-1 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
          </button>
          <h1 className="text-base sm:text-lg font-bold text-gray-900">
            Sign Up
          </h1>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-70px)] sm:min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
        {/* Welcome Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
          Welcome to Fashly
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 text-center max-w-sm sm:max-w-md">
          Choose how you'd like to continue
        </p>

        {/* Sign Up Options */}
        <div className="w-full max-w-sm sm:max-w-md space-y-3 sm:space-y-4">
          {/* Google */}
          <button
            disabled
            className="w-full bg-gray-100 border-2 border-gray-200 rounded-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3 cursor-not-allowed opacity-50"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">G</span>
            </div>
            <span className="text-sm sm:text-base text-gray-900 font-medium text-left">
              Continue with Google
            </span>
          </button>

          {/* Facebook */}
          <button
            disabled
            className="w-full bg-gray-100 border-2 border-gray-200 rounded-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3 cursor-not-allowed opacity-50"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">f</span>
            </div>
            <span className="text-sm sm:text-base text-gray-900 font-medium text-left">
              Continue with Facebook
            </span>
          </button>

          {/* Email */}
          <button
            onClick={() => setShowEmailModal(true)}
            className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">@</span>
            </div>
            <span className="text-sm sm:text-base text-gray-900 font-medium text-left">
              Continue with Email
            </span>
          </button>
        </div>

        {/* Login Link */}
        {/* <div className="mt-8 sm:mt-12 text-center">
          <p className="text-sm sm:text-base text-gray-600">
            Already have an account?{" "}
            <button 
              onClick={handleContinue}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Log in
            </button>
          </p>
        </div> */}
      </div>

      {/* Help Button */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6">
        <button className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">
          <span className="text-white font-bold text-sm sm:text-lg">?</span>
        </button>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Enter your email
              </h3>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setError("");
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                  onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                />
              </div>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setError("");
                }}
                className="flex-1 px-6 py-4 text-gray-700 bg-white border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailSubmit}
                disabled={!email || isLoading}
                className="flex-1 px-6 py-4 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Enter verification code
              </h3>
              <button
                onClick={() => {
                  setShowOTPModal(false);
                  setError("");
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-6">
                We've sent a 6-digit code to{" "}
                <span className="font-semibold text-gray-900">{email}</span>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Verification code
              </label>

              {/* 6 OTP Input Blocks */}
              <div className="flex justify-center gap-2 sm:gap-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    onPaste={handleOTPPaste}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <button
                onClick={handleEmailSubmit}
                className="mt-4 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Didn't receive code? Resend
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowOTPModal(false);
                  setShowEmailModal(true);
                  setError("");
                }}
                className="flex-1 px-6 py-4 text-gray-700 bg-white border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Back
              </button>
              <button
                onClick={handleOTPSubmit}
                disabled={otp.some((digit) => digit === "") || isLoading}
                className="flex-1 px-6 py-4 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
