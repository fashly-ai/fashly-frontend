"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  Settings,
  Camera,
  Heart,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  Trash2,
  Minus,
  Plus,
  Edit,
  Shield,
  Download,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("try-ons");

  const handleBack = () => {
    router.push("/products");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleTryOn = () => {
    router.push("/products");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-3 p-1 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Profile</h1>
              <p className="text-xs text-gray-600">123123 • 250 pts</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">2</span>
              </div>
            </div>
            <Settings className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="px-4 py-4 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">123123</h2>
        <p className="text-sm text-gray-600 mb-3">user@example.com</p>

        <div className="flex justify-center space-x-6">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">11</div>
            <div className="text-xs text-gray-600">Try-ons</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">3</div>
            <div className="text-xs text-gray-600">Liked</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">250</div>
            <div className="text-xs text-gray-600">Points</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => handleTabChange("try-ons")}
            className={`flex-1 flex flex-col items-center py-2 ${
              activeTab === "try-ons"
                ? "border-b-2 border-gray-900"
                : "border-b-2 border-transparent"
            }`}
          >
            <Camera
              className={`w-4 h-4 mb-1 ${
                activeTab === "try-ons" ? "text-gray-900" : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                activeTab === "try-ons" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Try-ons
            </span>
          </button>

          <button
            onClick={() => handleTabChange("likes")}
            className={`flex-1 flex flex-col items-center py-2 ${
              activeTab === "likes"
                ? "border-b-2 border-gray-900"
                : "border-b-2 border-transparent"
            }`}
          >
            <Heart
              className={`w-4 h-4 mb-1 ${
                activeTab === "likes" ? "text-gray-900" : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                activeTab === "likes" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Likes
            </span>
          </button>

          <button
            onClick={() => handleTabChange("style")}
            className={`flex-1 flex flex-col items-center py-2 ${
              activeTab === "style"
                ? "border-b-2 border-gray-900"
                : "border-b-2 border-transparent"
            }`}
          >
            <Sparkles
              className={`w-4 h-4 mb-1 ${
                activeTab === "style" ? "text-gray-900" : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                activeTab === "style" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Style
            </span>
          </button>

          <button
            onClick={() => handleTabChange("cart")}
            className={`flex-1 flex flex-col items-center py-2 ${
              activeTab === "cart"
                ? "border-b-2 border-gray-900"
                : "border-b-2 border-transparent"
            }`}
          >
            <ShoppingBag
              className={`w-4 h-4 mb-1 ${
                activeTab === "cart" ? "text-gray-900" : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                activeTab === "cart" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Cart
            </span>
          </button>

          <button
            onClick={() => handleTabChange("settings")}
            className={`flex-1 flex flex-col items-center py-2 ${
              activeTab === "settings"
                ? "border-b-2 border-gray-900"
                : "border-b-2 border-transparent"
            }`}
          >
            <Settings
              className={`w-4 h-4 mb-1 ${
                activeTab === "settings" ? "text-gray-900" : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                activeTab === "settings" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Settings
            </span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4 py-3 pb-20">
        {activeTab === "try-ons" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900">
                Recent Try-ons
              </h3>
              <button className="text-xs text-gray-600 hover:text-gray-900">
                View all
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Try-on Card 1 */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg
                      className="w-6 h-6 mx-auto mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-xs">Try-on Photo</p>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500 mb-1">Ray-Ban</p>
                  <p className="text-xs font-semibold text-gray-900 mb-2">
                    Wayfarer Classic
                  </p>
                  <div className="flex space-x-1">
                    <button className="flex-1 border border-gray-300 text-gray-700 py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-50">
                      Share
                    </button>
                    <button className="flex-1 bg-gray-900 text-white py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-800">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Try-on Card 2 */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg
                      className="w-6 h-6 mx-auto mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-xs">Try-on Photo</p>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500 mb-1">Gentle Monster</p>
                  <p className="text-xs font-semibold text-gray-900 mb-2">
                    Oversized Square
                  </p>
                  <div className="flex space-x-1">
                    <button className="flex-1 border border-gray-300 text-gray-700 py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-50">
                      Share
                    </button>
                    <button className="flex-1 bg-gray-900 text-white py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-800">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Try-on Card 3 */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg
                      className="w-6 h-6 mx-auto mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-xs">Try-on Photo</p>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500 mb-1">Oakley</p>
                  <p className="text-xs font-semibold text-gray-900 mb-2">
                    Sport Shield
                  </p>
                  <div className="flex space-x-1">
                    <button className="flex-1 border border-gray-300 text-gray-700 py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-50">
                      Share
                    </button>
                    <button className="flex-1 bg-gray-900 text-white py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-800">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Try-on Card 4 */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg
                      className="w-6 h-6 mx-auto mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-xs">Try-on Photo</p>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500 mb-1">Tom Ford</p>
                  <p className="text-xs font-semibold text-gray-900 mb-2">
                    Aviator Classic
                  </p>
                  <div className="flex space-x-1">
                    <button className="flex-1 border border-gray-300 text-gray-700 py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-50">
                      Share
                    </button>
                    <button className="flex-1 bg-gray-900 text-white py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-800">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Try-on Card 5 */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg
                      className="w-6 h-6 mx-auto mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-xs">Try-on Photo</p>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500 mb-1">Prada</p>
                  <p className="text-xs font-semibold text-gray-900 mb-2">
                    Linea Rossa
                  </p>
                  <div className="flex space-x-1">
                    <button className="flex-1 border border-gray-300 text-gray-700 py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-50">
                      Share
                    </button>
                    <button className="flex-1 bg-gray-900 text-white py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-800">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Try-on Card 6 */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg
                      className="w-6 h-6 mx-auto mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-xs">Try-on Photo</p>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500 mb-1">Gucci</p>
                  <p className="text-xs font-semibold text-gray-900 mb-2">
                    GG0061S
                  </p>
                  <div className="flex space-x-1">
                    <button className="flex-1 border border-gray-300 text-gray-700 py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-50">
                      Share
                    </button>
                    <button className="flex-1 bg-gray-900 text-white py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-800">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "likes" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Liked Glasses</h3>
              <button className="text-xs text-gray-600 hover:text-gray-900">
                Clear all
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Liked Item 1 */}
              <div className="bg-gray-50 rounded-lg p-3 flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Ray-Ban</p>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Wayfarer Classic</p>
                  <p className="text-sm font-bold text-gray-900">$154</p>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <button className="p-1">
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </button>
                  <button className="p-1">
                    <ShoppingCart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Liked Item 2 */}
              <div className="bg-gray-50 rounded-lg p-3 flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Gentle Monster</p>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Oversized Square</p>
                  <p className="text-sm font-bold text-gray-900">$320</p>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <button className="p-1">
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </button>
                  <button className="p-1">
                    <ShoppingCart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Liked Item 3 */}
              <div className="bg-gray-50 rounded-lg p-3 flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Prada</p>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Butterfly</p>
                  <p className="text-sm font-bold text-gray-900">$450</p>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <button className="p-1">
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </button>
                  <button className="p-1">
                    <ShoppingCart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "style" && (
          <div className="space-y-4">
            {/* Style Recommendations */}
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">Face Shape Analysis</h4>
                  <p className="text-xs text-gray-600 mb-2">Based on your uploaded photo.</p>
                  <p className="text-sm text-gray-700 mb-3">
                    Your oval face shape suits most frame styles. Bold statement pieces will complement your features perfectly.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Cat-eye</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Aviator</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Square</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Style Occasions */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-3">Style Occasions</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Professional</p>
                    <p className="text-xs text-gray-600">Clean lines, classic shapes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Casual</p>
                    <p className="text-xs text-gray-600">Relaxed frames, fun colors</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Statement</p>
                    <p className="text-xs text-gray-600">Bold shapes, unique details</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Now */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Trending Now</h4>
                  <p className="text-xs text-gray-600">Discover what's popular</p>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {activeTab === "cart" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Shopping Cart (3)</h3>
              <button className="text-xs text-red-600 hover:text-red-800">
                Clear all
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              {/* Cart Item 1 */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Ray-Ban</p>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Wayfarer Classic</p>
                  <p className="text-sm font-bold text-gray-900">$154</p>
                </div>
                <div className="flex items-center space-x-2 mr-3">
                  <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Minus className="w-3 h-3 text-gray-600" />
                  </button>
                  <span className="text-sm font-medium text-gray-900 w-6 text-center">1</span>
                  <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                <button className="p-1">
                  <Trash2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Cart Item 2 */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Tom Ford</p>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Pilot Frame</p>
                  <p className="text-sm font-bold text-gray-900">$450</p>
                </div>
                <div className="flex items-center space-x-2 mr-3">
                  <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Minus className="w-3 h-3 text-gray-600" />
                  </button>
                  <span className="text-sm font-medium text-gray-900 w-6 text-center">1</span>
                  <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                <button className="p-1">
                  <Trash2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Cart Item 3 */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Gentle Monster</p>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Oversized Square</p>
                  <p className="text-sm font-bold text-gray-900">$320</p>
                </div>
                <div className="flex items-center space-x-2 mr-3">
                  <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Minus className="w-3 h-3 text-gray-600" />
                  </button>
                  <span className="text-sm font-medium text-gray-900 w-6 text-center">1</span>
                  <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Plus className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                <button className="p-1">
                  <Trash2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal (3 items)</span>
                  <span className="font-medium text-gray-900">$924</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">$924</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors duration-200">
              <ShoppingCart className="w-5 h-5" />
              <span>Checkout</span>
            </button>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Manage your profile and preferences</p>
              </div>
              <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                <Edit className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </button>
            </div>

            {/* Profile Photo Section */}
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Profile Photo</h4>
              <p className="text-sm text-gray-600 mb-3">Your photo enables virtual try-on experiences</p>
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Not uploaded</p>
                  <p className="text-sm text-gray-600">Upload a photo to enable virtual try-on features.</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Personal Information</h4>
              <p className="text-sm text-gray-600 mb-3">Your details for a personalized experience.</p>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Display Name</label>
                  <p className="text-sm text-gray-900 mt-1">123123</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Account Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <p className="text-sm text-gray-900 mt-1">user@example.com</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Height</label>
                    <p className="text-sm text-gray-900 mt-1">Not set</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Weight</label>
                    <p className="text-sm text-gray-900 mt-1">Not set</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Privacy & Security</h4>
              <p className="text-sm text-gray-600 mb-3">Control your data and privacy settings</p>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-1">Data Protection</h5>
                    <p className="text-sm text-gray-700 mb-2">
                      Your photo and personal information are encrypted and stored securely. We never share your data without explicit consent.
                    </p>
                    <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                      View Privacy Policy
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 rounded-lg px-2">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Download My Data</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              
              <button className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 rounded-lg px-2">
                <div className="flex items-center space-x-3">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-600">Delete Account</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex w-full">
          {/* Try On - Left Half */}
          <button
            onClick={handleTryOn}
            className="flex-1 flex flex-col items-center justify-center space-y-1 py-2"
          >
            <div className="w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xs font-medium text-gray-600">Try On</span>
          </button>

          {/* Profile - Right Half */}
          <button className="flex-1 flex flex-col items-center justify-center space-y-1 py-2">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-gray-900">Profile</span>
          </button>
        </div>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-12 right-3 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
        <HelpCircle className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
