"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function QuickSetup() {
  const router = useRouter();

  const handleContinue = () => {
    // Navigate to earn points page
    router.push("/earn-points");
  };

  const handleSkip = () => {
    // Navigate to earn points page
    router.push("/earn-points");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-3 p-1 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Quick Setup</h1>
              <p className="text-sm text-gray-600">Just the basics to get started.</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">1</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-24">
        {/* Basic Info Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mr-3">Basic Info</h2>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Optional</span>
          </div>
          
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                placeholder="How should we call you?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value="user@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                readOnly
              />
            </div>

            {/* Height and Weight Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <div className="relative">
                  <input
                    type="text"
                    value="5'6&quot;"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 pr-12"
                    readOnly
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">ft/in</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                <div className="relative">
                  <input
                    type="text"
                    value="130"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 pr-12"
                    readOnly
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">lbs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Selfie Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mr-3">Upload Selfie</h2>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Required</span>
          </div>
          
          {/* Photo Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors duration-200 cursor-pointer">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-600 font-medium">Add Your Photo</p>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start">
            <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-sm text-blue-700">For best results: Natural light, clear face, no sunglasses</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <div className="max-w-md mx-auto space-y-3">
          <button
            onClick={handleContinue}
            className="w-full bg-gray-800 text-white py-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
          >
            Continue
          </button>
          <button
            onClick={handleSkip}
            className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors duration-200"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Help Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">
          <span className="text-white font-bold text-lg">?</span>
        </button>
      </div>
    </div>
  );
}
