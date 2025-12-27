"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    // Only run on client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        // User is authenticated, redirect to products
        router.push('/products');
      } else {
        // User is not authenticated, show landing page
        setIsChecking(false);
      }
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Show nothing while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const handleGetStarted = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative px-4 sm:px-6 lg:px-8">
      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl">
        {/* FASHLY Logo */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] mb-6 sm:mb-8 text-center">
          FASHLY
        </h1>
        
        {/* Tagline */}
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-12 sm:mb-16 text-center max-w-sm sm:max-w-md">
          Stop guessing, start fitting
        </p>
      </div>
      
      {/* Get Started Button */}
      <div className="pb-12 sm:pb-16 w-full max-w-sm sm:max-w-md">
        <button 
          onClick={handleGetStarted}
          className="bg-white w-full text-black px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6 rounded-full font-semibold text-lg sm:text-xl hover:bg-gray-100 transition-colors duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
