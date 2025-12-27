"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import ImageUpload from "@/components/ImageUpload";

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
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

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
      setProfileImageUrl(profile.profileImageUrl);
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
      
      // Navigate to products page
      router.push("/products");
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Navigate to products page
    router.push("/products");
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
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mr-2 sm:mr-3">Upload Full Body Photo</h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Required for Try-On</span>
          </div>
          
          <ImageUpload
            currentImageUrl={profileImageUrl}
            onUploadSuccess={(imageUrl) => {
              setProfileImageUrl(imageUrl);
              console.log("Image uploaded successfully:", imageUrl);
            }}
          />
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
