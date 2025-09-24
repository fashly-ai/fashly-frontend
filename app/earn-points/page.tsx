"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function EarnPoints() {
  const router = useRouter();

  const handleSkip = () => {
    // Navigate to products page
    router.push("/products");
  };

  const handleShare = (platform: string) => {
    // Handle sharing logic for each platform
    console.log(`Share on ${platform}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-3 p-1 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Earn Points</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-24">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">★</span>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Profile created successfully!
          </h2>
          <p className="text-gray-600 text-lg">
            Share Fashly with your friends to earn points and unlock exclusive
            features.
          </p>
        </div>

        {/* Points Banner */}
        <div className="bg-blue-50 rounded-lg p-4 mb-8 flex items-center">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <p className="text-blue-800 font-medium">
            Earn 50 points for each friend who joins!
          </p>
        </div>

        {/* Sharing Options */}
        <div className="space-y-4">
          {/* WhatsApp */}
          <button
            onClick={() => handleShare("WhatsApp")}
            className="w-full bg-green-500 text-white rounded-lg px-6 py-4 flex items-center justify-between hover:bg-green-600 transition-colors duration-200"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-green-500 font-bold text-lg">W</span>
              </div>
              <span className="font-medium">Share on WhatsApp</span>
            </div>
            <span className="text-green-100 font-medium">+50 pts</span>
          </button>

          {/* Instagram */}
          <button
            onClick={() => handleShare("Instagram")}
            className="w-full bg-white border-2 border-gray-300 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <span className="text-gray-900 font-medium">
                Share on Instagram
              </span>
            </div>
            <span className="text-gray-600 font-medium">+50 pts</span>
          </button>

          {/* Twitter */}
          <button
            onClick={() => handleShare("Twitter")}
            className="w-full bg-white border-2 border-gray-300 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </div>
              <span className="text-gray-900 font-medium">
                Share on Twitter
              </span>
            </div>
            <span className="text-gray-600 font-medium">+50 pts</span>
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleShare("Facebook")}
            className="w-full bg-white border-2 border-gray-300 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">f</span>
              </div>
              <span className="text-gray-900 font-medium">
                Share on Facebook
              </span>
            </div>
            <span className="text-gray-600 font-medium">+50 pts</span>
          </button>
        </div>

        {/* Skip Link */}
        <div className="text-center mt-12">
          <button
            onClick={handleSkip}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
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
