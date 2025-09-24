"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function SignUp() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/setup");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
        <div className="flex items-center">
          <button className="mr-2 sm:mr-3 p-1 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
          </button>
          <h1 className="text-base sm:text-lg font-bold text-gray-900">Sign Up</h1>
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
            onClick={handleContinue}
            className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">G</span>
            </div>
            <span className="text-sm sm:text-base text-gray-900 font-medium text-left">Continue with Google</span>
          </button>

          {/* Facebook */}
          <button 
            onClick={handleContinue}
            className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">f</span>
            </div>
            <span className="text-sm sm:text-base text-gray-900 font-medium text-left">Continue with Facebook</span>
          </button>

          {/* Email */}
          <button 
            onClick={handleContinue}
            className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">@</span>
            </div>
            <span className="text-sm sm:text-base text-gray-900 font-medium text-left">Continue with Email</span>
          </button>
        </div>

        {/* Login Link */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-sm sm:text-base text-gray-600">
            Already have an account?{" "}
            <button 
              onClick={handleContinue}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Log in
            </button>
          </p>
        </div>
      </div>

      {/* Help Button */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6">
        <button className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">
          <span className="text-white font-bold text-sm sm:text-lg">?</span>
        </button>
      </div>
    </div>
  );
}
