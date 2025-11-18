"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  Settings,
  Camera,
  Heart,
  ShoppingBag,
  HelpCircle,
  Trash2,
  Minus,
  Plus,
  Edit,
  Shield,
  Download,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  height: number | null;
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

interface GlassProduct {
  id: string;
  name: string;
  productUrl: string;
  imageUrl: string;
  allImages: string[];
  brand: string;
  category: string;
  price: string;
  availability: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}

interface Pagination {
  total: number;
  page: string;
  limit: string;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface TryOnHistory {
  id: string;
  glasses: GlassProduct;
  createdAt: string;
  updatedAt: string;
}

interface SavedTryOnHistory {
  id: string;
  userId: string;
  glassId: string;
  glasses: GlassProduct;
  prompt: string;
  negativePrompt: string;
  seed: number;
  resultImageUrl: string;
  promptId: string;
  filename: string;
  processingTime: number;
  imageSize: number;
  savedTryOn: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("try-ons");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<GlassProduct[]>([]);
  const [favoritesPagination, setFavoritesPagination] = useState<Pagination | null>(null);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);
  const [tryOnHistory, setTryOnHistory] = useState<TryOnHistory[]>([]);
  const [tryOnPagination, setTryOnPagination] = useState<Pagination | null>(null);
  const [isTryOnLoading, setIsTryOnLoading] = useState(false);
  const [savedTryOns, setSavedTryOns] = useState<SavedTryOnHistory[]>([]);
  const [savedTryOnsPagination, setSavedTryOnsPagination] = useState<Pagination | null>(null);
  const [isSavedTryOnsLoading, setIsSavedTryOnsLoading] = useState(false);
  const [savedTryOnImageIndex, setSavedTryOnImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const [showTryOnModal, setShowTryOnModal] = useState(false);
  const [selectedGlass, setSelectedGlass] = useState<GlassProduct | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isTryOnProcessing, setIsTryOnProcessing] = useState(false);
  const [tryOnImage, setTryOnImage] = useState<string | null>(null);
  const [tryOnError, setTryOnError] = useState<string | null>(null);
  const [tryOnHistoryId, setTryOnHistoryId] = useState<string | null>(null);
  const [isSavingLook, setIsSavingLook] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchFavoritesCount = async () => {
      try {
        const response = await axios.get('/api/glasses/favorites/my?page=1&limit=1');
        setFavoritesPagination(response.data.pagination);
      } catch (error) {
        console.error('Error fetching favorites count:', error);
      }
    };

    const fetchTryOnCount = async () => {
      try {
        const response = await axios.get('/api/tryon/history?page=1&limit=1');
        setTryOnPagination(response.data.pagination);
      } catch (error) {
        console.error('Error fetching try-on count:', error);
      }
    };

    fetchProfile();
    fetchFavoritesCount();
    fetchTryOnCount();
  }, []);

  useEffect(() => {
    if (activeTab === 'likes') {
      fetchFavorites();
    } else if (activeTab === 'try-ons') {
      fetchTryOnHistory();
      fetchSavedTryOns();
    }
  }, [activeTab]);

  const fetchFavorites = async () => {
    setIsFavoritesLoading(true);
    try {
      const response = await axios.get('/api/glasses/favorites/my?page=1&limit=50');
      setFavorites(response.data.data);
      setFavoritesPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsFavoritesLoading(false);
    }
  };

  const fetchTryOnHistory = async () => {
    setIsTryOnLoading(true);
    try {
      const response = await axios.get('/api/tryon/history?page=1&limit=50');
      setTryOnHistory(response.data.data);
      setTryOnPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching try-on history:', error);
    } finally {
      setIsTryOnLoading(false);
    }
  };

  const fetchSavedTryOns = async () => {
    setIsSavedTryOnsLoading(true);
    try {
      const response = await axios.get('/api/glass-tryon-history?savedTryOn=true&page=1&limit=20');
      setSavedTryOns(response.data.data);
      setSavedTryOnsPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching saved try-ons:', error);
    } finally {
      setIsSavedTryOnsLoading(false);
    }
  };

  const handleToggleFavorite = async (glassesId: string) => {
    try {
      await axios.post('/api/glasses/favorites/toggle', {
        glassesId: glassesId
      });
      
      setFavorites(prevFavorites => 
        prevFavorites.filter(fav => fav.id !== glassesId)
      );
      
      setFavoritesPagination(prev => 
        prev ? { ...prev, total: prev.total - 1 } : null
      );
      
      console.log('Favorite removed successfully');
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleBack = () => {
    router.push("/products");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleTryOn = () => {
    router.push("/products");
  };

  const handleSavedTryOnNextImage = (itemId: string, totalImages: number) => {
    setSavedTryOnImageIndex((prev) => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % totalImages,
    }));
  };

  const handleSavedTryOnPrevImage = (itemId: string, totalImages: number) => {
    setSavedTryOnImageIndex((prev) => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  const handleTryAgain = async (glass: GlassProduct) => {
    setSelectedGlass(glass);
    setModalImageIndex(0);
    setTryOnImage(null);
    setTryOnError(null);
    setTryOnHistoryId(null);
    setShowTryOnModal(true);
    setIsTryOnProcessing(true);
    
    try {
      // Call ComfyUI API to process the glass
      const response = await axios.post('/api/comfyui/process-glass', {
        glassId: glass.id,
        prompt: "person wearing stylish eyeglasses, professional portrait, clear face, natural lighting",
        negativePrompt: "blurry, low quality, distorted, cropped face, partial face",
        seed: 42
      });

      if (response.data.resultImageUrl) {
        setTryOnImage(response.data.resultImageUrl);
        setTryOnHistoryId(response.data.id);
      } else {
        setTryOnError("Failed to generate try-on image");
      }

      // Save try-on to backend (old flow)
      try {
        await axios.post('/api/tryon/save', {
          glassesId: glass.id
        });
        console.log(`Try on saved for ${glass.name}`);
      } catch (error) {
        console.error('Error saving try-on:', error);
      }

      // Refresh saved try-ons list after generating new one
      fetchSavedTryOns();
    } catch (error: any) {
      console.error('Error processing try-on:', error);
      setTryOnError(error.response?.data?.message || "Failed to process try-on. Please try again.");
    } finally {
      setIsTryOnProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setShowTryOnModal(false);
    setSelectedGlass(null);
    setModalImageIndex(0);
    setTryOnImage(null);
    setTryOnError(null);
    setTryOnHistoryId(null);
    setIsSavingLook(false);
  };

  const handleSaveLook = async () => {
    if (!tryOnHistoryId) {
      console.error('No try-on history ID available');
      return;
    }

    setIsSavingLook(true);
    try {
      await axios.put(`/api/glass-tryon-history/${tryOnHistoryId}/saved-status`, {
        savedTryOn: true
      });
      
      // Show success feedback
      console.log('Look saved successfully!');
      
      // Refresh the saved try-ons list
      fetchSavedTryOns();
      
      // Close modal after successful save
      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving look:', error);
      alert(error.response?.data?.message || 'Failed to save look. Please try again.');
    } finally {
      setIsSavingLook(false);
    }
  };

  const handleModalNextImage = () => {
    if (selectedGlass && selectedGlass.allImages) {
      setModalImageIndex(
        (prev) => (prev + 1) % selectedGlass.allImages.length
      );
    }
  };

  const handleModalPrevImage = () => {
    if (selectedGlass && selectedGlass.allImages) {
      setModalImageIndex(
        (prev) =>
          (prev - 1 + selectedGlass.allImages.length) %
          selectedGlass.allImages.length
      );
    }
  };

  return (
    <div className="bg-white pb-24">
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
              <p className="text-xs text-gray-600">
                {profile?.firstName || 'User'} • 250 pts
              </p>
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
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          {profile?.fullName || profile?.firstName || 'User'}
        </h2>
        <p className="text-sm text-gray-600 mb-3">{profile?.email || 'user@example.com'}</p>

          <div className="flex justify-center space-x-6">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {savedTryOnsPagination?.total || 0}
              </div>
              <div className="text-xs text-gray-600">Try-ons</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {favoritesPagination?.total || 0}
              </div>
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
      <div className="px-4 py-3">
        {activeTab === "try-ons" && (
          <div>
            {/* Saved Try-ons Section */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900">
                Saved Try-ons {savedTryOnsPagination && `(${savedTryOnsPagination.total})`}
              </h3>
            </div>

            {isSavedTryOnsLoading ? (
              <div className="text-center py-8 text-gray-500">Loading saved try-ons...</div>
            ) : savedTryOns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No saved try-ons yet</div>
            ) : (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {savedTryOns.map((item) => {
                  // Create array with try-on result first, then glass images
                  const d45Image = item.glasses.allImages?.find(img => img.includes('D_45'));
                  const glassDisplayImage = d45Image || item.glasses.allImages?.[0] || item.glasses.imageUrl;
                  
                  const availableImages = [
                    item.resultImageUrl, // Try-on result image first
                    glassDisplayImage   // Glass product image second
                  ].filter(Boolean);

                  const currentIndex = savedTryOnImageIndex[item.id] || 0;
                  const displayImage = availableImages[currentIndex];
                  const hasMultipleImages = availableImages.length > 1;
                  
                  return (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="relative group">
                        <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden">
                          {displayImage ? (
                            <img 
                              src={displayImage} 
                              alt={item.glasses.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
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
                          )}
                        </div>

                        {/* Image Navigation Buttons */}
                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSavedTryOnPrevImage(
                                  item.id,
                                  availableImages.length
                                );
                              }}
                              className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 p-1 sm:p-1.5 bg-white/80 rounded-full shadow-sm hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-800" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSavedTryOnNextImage(
                                  item.id,
                                  availableImages.length
                                );
                              }}
                              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 p-1 sm:p-1.5 bg-white/80 rounded-full shadow-sm hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-800" />
                            </button>

                            {/* Image Indicator Dots */}
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                              {availableImages.map((_, index) => (
                                <div
                                  key={index}
                                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                    index === currentIndex
                                      ? "bg-white w-3"
                                      : "bg-white/50"
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-gray-500 mb-1">{item.glasses.brand}</p>
                        <p className="text-xs font-semibold text-gray-900 mb-2">
                          {item.glasses.name}
                        </p>
                        <div className="flex space-x-1">
                          <button className="flex-1 border border-gray-300 text-gray-700 py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-50">
                            Share
                          </button>
                          <button 
                            onClick={() => handleTryAgain(item.glasses)}
                            className="flex-1 bg-gray-900 text-white py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-800"
                          >
                            Try Again
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "likes" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">
                Liked Glasses {favoritesPagination && `(${favoritesPagination.total})`}
              </h3>
            </div>
            
            {isFavoritesLoading ? (
              <div className="text-center py-8 text-gray-500">Loading favorites...</div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No liked glasses yet</div>
            ) : (
              <div className="space-y-3">
                {favorites.map((item) => {
                  const d45Image = item.allImages?.find(img => img.includes('D_45'));
                  const displayImage = d45Image || item.allImages?.[0] || item.imageUrl;
                  
                  return (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-3 flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                        {displayImage ? (
                          <img 
                            src={displayImage} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">{item.brand}</p>
                        <p className="text-sm font-semibold text-gray-900 mb-1">{item.name}</p>
                        <p className="text-sm font-bold text-gray-900">{item.price}</p>
                      </div>
                      <div className="flex flex-col items-center space-y-3">
                        <button 
                          onClick={() => handleToggleFavorite(item.id)}
                          className="p-1"
                        >
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                        </button>
                        <button className="p-1">
                          <ShoppingCart className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                  <p className="text-sm text-gray-900 mt-1">
                    {profile?.fullName || profile?.firstName || 'Not set'}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Account Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <p className="text-sm text-gray-900 mt-1">{profile?.email || 'Not set'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Height</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {profile?.height ? `${profile.height} cm` : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Weight</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {profile?.weight ? `${profile.weight} ${profile.weightUnit || 'kg'}` : 'Not set'}
                    </p>
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

      {/* Try On Modal */}
      {showTryOnModal && selectedGlass && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              disabled={isTryOnProcessing || isSavingLook}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 z-10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-400"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Selfie Preview */}
            <div className="mb-4 sm:mb-6">
              <div className="text-center mb-3 sm:mb-4">
                <p className="text-base sm:text-lg text-gray-600 mb-1 sm:mb-2">
                  Your selfie with
                </p>
                <p className="text-lg sm:text-xl font-semibold text-gray-900">
                  {selectedGlass.name}
                </p>
              </div>

              {/* Product Image with Navigation / Try-On Result */}
              <div className="relative group">
                <div className="w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  {isTryOnProcessing ? (
                    // Loading State
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 text-gray-600 animate-spin" />
                        <p className="text-sm sm:text-base font-medium text-gray-700">
                          Generating your try-on...
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          This may take a few moments
                        </p>
                      </div>
                    </div>
                  ) : tryOnError ? (
                    // Error State
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-red-600 px-4">
                        <svg
                          className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-xs sm:text-sm font-medium">{tryOnError}</p>
                      </div>
                    </div>
                  ) : tryOnImage ? (
                    // Try-On Result Image
                    <img
                      src={tryOnImage}
                      alt={`Try on result for ${selectedGlass.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : selectedGlass.allImages &&
                    selectedGlass.allImages.length > 0 ? (
                    <>
                      <img
                        src={selectedGlass.allImages[modalImageIndex]}
                        alt={`${selectedGlass.name} - Image ${
                          modalImageIndex + 1
                        }`}
                        className="w-full h-full object-cover"
                      />

                      {/* Navigation Buttons - Only show if multiple images and not showing try-on */}
                      {selectedGlass.allImages.length > 1 && (
                        <>
                          <button
                            onClick={handleModalPrevImage}
                            className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 p-2 sm:p-2.5 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                          >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                          </button>
                          <button
                            onClick={handleModalNextImage}
                            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-2 sm:p-2.5 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                          >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                          </button>

                          {/* Image Indicator Dots */}
                          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {selectedGlass.allImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setModalImageIndex(index)}
                                className={`transition-all duration-200 rounded-full ${
                                  index === modalImageIndex
                                    ? "w-6 h-2 bg-white"
                                    : "w-2 h-2 bg-white/60 hover:bg-white/80"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <svg
                          className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-1 sm:mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-xs sm:text-sm">
                          Image will appear here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <button
                onClick={handleSaveLook}
                disabled={isTryOnProcessing || isSavingLook || !tryOnHistoryId}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center justify-center"
              >
                {isSavingLook ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Look'
                )}
              </button>
              <button
                onClick={handleCloseModal}
                disabled={isTryOnProcessing || isSavingLook}
                className="flex-1 bg-green-500 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-500"
              >
                Share +50 pts
              </button>
            </div>

            {/* See Details Link */}
            <div className="text-center">
              <button
                onClick={handleCloseModal}
                disabled={isTryOnProcessing || isSavingLook}
                className="text-gray-600 hover:text-gray-800 font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-600"
              >
                See Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
