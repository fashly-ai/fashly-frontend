"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative">
      {/* Main content */}
      <div className="flex flex-col items-center justify-center flex-1 px-8">
        {/* FASHLY Logo */}
        <h1 className="text-6xl md:text-8xl font-bold tracking-[0.2em] mb-8 text-center">
          FASHLY
        </h1>
        
        {/* Tagline */}
        <p className="text-lg md:text-xl text-gray-300 mb-16 text-center max-w-md">
          Stop guessing, start fitting
        </p>
      </div>
      
      {/* Get Started Button */}
      <div className="pb-16">
        <button 
          onClick={handleGetStarted}
          className="bg-white w-[500px] text-black px-16 py-6 rounded-full font-semibold text-xl hover:bg-gray-100 transition-colors duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
