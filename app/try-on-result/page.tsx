"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, ThumbsUp, ThumbsDown, Heart, HelpCircle } from "lucide-react";

export default function TryOnResult() {
  const router = useRouter();

  const handleTryAnother = () => {
    router.push("/products");
  };

  const handleReaction = (reaction: string) => {
    console.log(`Reaction: ${reaction}`);
  };

  const handleShare = () => {
    console.log("Share clicked");
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-2 sm:mr-3 p-1 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
          </button>
          <h1 className="text-base sm:text-lg font-bold text-gray-900">Try On Result</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 px-3 sm:px-4 py-4 sm:py-6 flex flex-col">
        {/* Image Placeholder */}
        <div className="relative mb-6 sm:mb-8">
          <div className="w-full aspect-[4/5] max-h-60 sm:max-h-72 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <div className="text-center text-gray-500">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs sm:text-sm font-medium">Your photo + glasses overlay</p>
            </div>
          </div>
          
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
          >
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>
        </div>

        {/* Reaction Buttons */}
        <div className="flex justify-center space-x-8 sm:space-x-16 mb-6 sm:mb-8">
          <button
            onClick={() => handleReaction("like")}
            className="flex flex-col items-center space-y-1 sm:space-y-2 hover:opacity-70 transition-opacity duration-200"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
              <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">Like</span>
          </button>

          <button
            onClick={() => handleReaction("dislike")}
            className="flex flex-col items-center space-y-1 sm:space-y-2 hover:opacity-70 transition-opacity duration-200"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
              <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">Dislike</span>
          </button>

          <button
            onClick={() => handleReaction("love")}
            className="flex flex-col items-center space-y-1 sm:space-y-2 hover:opacity-70 transition-opacity duration-200"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">Love</span>
          </button>
        </div>

        {/* Try Another Pair Button */}
        <div className="text-center">
          <button
            onClick={handleTryAnother}
            className="w-full bg-gray-800 text-white py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-lg text-sm sm:text-base"
          >
            Try Another Pair
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex w-full">
          {/* Try On - Left Half */}
          <button className="flex-1 flex flex-col items-center justify-center space-y-1 py-2">
            <div className="w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xs font-semibold text-gray-900">Try On</span>
          </button>

          {/* Profile - Right Half */}
          <button 
            onClick={() => router.push("/profile")}
            className="flex-1 flex flex-col items-center justify-center space-y-1 py-2"
          >
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
