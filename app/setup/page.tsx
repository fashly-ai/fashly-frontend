"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";

interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  height: string | null;
  weight: number | null;
  weightUnit: string | null;
  profileImageUrl: string | null;
  phoneNumber: string | null;
  gender: string | null;
  bio: string | null;
  location: string | null;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function QuickSetup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get<ProfileData>('/api/profile');
      const profile = response.data;
      
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email);
      setHeight(profile.height || "");
      setWeight(profile.weight?.toString() || "");
      setWeightUnit(profile.weightUnit || "kg");
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      await axios.put('/api/profile', {
        firstName,
        lastName,
        height: height || null,
        weight: weight ? parseFloat(weight) : null,
        weightUnit,
      });
      
      // Navigate to earn points page
      router.push("/earn-points");
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Navigate to earn points page
    router.push("/earn-points");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-2 sm:mr-3 p-1 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900">Quick Setup</h1>
              <p className="text-xs sm:text-sm text-gray-600">Just the basics to get started.</p>
            </div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-xs sm:text-sm font-medium">1</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 pb-32 sm:pb-36 overflow-y-auto">
        {/* Basic Info Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mr-2 sm:mr-3">Basic Info</h2>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Optional</span>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {/* First Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                disabled={isFetching}
              />
            </div>

            {/* Last Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                disabled={isFetching}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
              <input
                type="email"
                value={email}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm sm:text-base"
                readOnly
              />
            </div>

            {/* Height and Weight Fields */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Height</label>
                <div className="relative">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="170"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 sm:pr-12 text-sm sm:text-base"
                    disabled={isFetching}
                  />
                  <span className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm text-gray-500">cm</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Weight</label>
                <div className="relative">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="65"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 sm:pr-12 text-sm sm:text-base"
                    disabled={isFetching}
                  />
                  <span className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm text-gray-500">kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Selfie Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mr-2 sm:mr-3">Upload Selfie</h2>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Required</span>
          </div>
          
          {/* Photo Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-gray-400 transition-colors duration-200 cursor-pointer">
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm sm:text-base text-gray-600 font-medium">Add Your Photo</p>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-3 sm:mt-4 p-3 bg-blue-50 rounded-lg flex items-start">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-xs sm:text-sm text-blue-700">For best results: Natural light, clear face, no sunglasses</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:p-6">
        <div className="max-w-sm sm:max-w-md mx-auto space-y-2 sm:space-y-3">
          <button
            onClick={handleContinue}
            disabled={isLoading || isFetching}
            className="w-full bg-gray-800 text-white py-3 sm:py-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Continue"}
          </button>
          <button
            onClick={handleSkip}
            disabled={isLoading}
            className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Help Button */}
      <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-10">
        <button className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200 shadow-lg">
          <span className="text-white font-bold text-sm sm:text-lg">?</span>
        </button>
      </div>
    </div>
  );
}
