"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, ThumbsUp, ThumbsDown, Heart, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";

interface GlassProduct {
  id: string;
  name: string;
  brand: string;
  price: string;
  imageUrl: string;
  allImages: string[];
  productUrl: string;
  category: string;
  isFavorite: boolean;
}

export default function TryOnResult() {
  const router = useRouter();
  const [product, setProduct] = useState<GlassProduct | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      // Load product data from localStorage to get the ID
      const storedProduct = localStorage.getItem('selectedGlassProduct');
      if (storedProduct) {
        try {
          const productData = JSON.parse(storedProduct);
          
          // Fetch fresh data from API
          try {
            const response = await axios.get(`/api/glasses/${productData.id}`);
            const freshProduct = response.data;
            setProduct(freshProduct);
            setIsLiked(freshProduct.isFavorite || false);
          } catch (error) {
            console.error('Error fetching product details:', error);
            // Fallback to stored data if API fails
            setProduct(productData);
            setIsLiked(productData.isFavorite || false);
          }
        } catch (error) {
          console.error('Error parsing product data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, []);

  const handleTryAnother = () => {
    router.push("/products");
  };

  const handleToggleFavorite = async () => {
    if (!product || isLiking) return;

    setIsLiking(true);
    try {
      await axios.post('/api/glasses/favorites/toggle', {
        glassesId: product.id
      });
      
      // Toggle the liked state after successful API call
      setIsLiked(!isLiked);
      
      // Update product state
      setProduct(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
      
      console.log('Favorite toggled successfully');
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleReaction = (reaction: string) => {
    if (reaction === 'like' || reaction === 'love') {
      handleToggleFavorite();
    } else {
      console.log(`Reaction: ${reaction}`);
    }
  };

  const handleShare = () => {
    console.log("Share clicked");
  };

  // Get the display image (prioritize D_45 or use first image)
  const getDisplayImage = () => {
    if (!product) return null;
    
    const d45Image = product.allImages?.find(img => img.includes('D_45'));
    return d45Image || product.allImages?.[0] || product.imageUrl;
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

      {/* Main Content - Full Width Image */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {/* Full Size Image Display */}
        <div className="relative w-full bg-white" style={{ height: 'calc(100vh - 56px - 280px)' }}>
          {getDisplayImage() ? (
            <img
              src={getDisplayImage()!}
              alt={product?.name || "Glass product"}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Your photo + glasses overlay</p>
              </div>
            </div>
          )}
          
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200 z-10"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Bottom Content Area */}
        <div className="bg-white px-4 py-4 pb-20 border-t border-gray-200">
          {/* Product Info */}
          {product && (
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">{product.name}</h2>
              <p className="text-sm text-gray-600">{product.brand}</p>
              <p className="text-base font-semibold text-gray-900 mt-1">{product.price}</p>
            </div>
          )}

          {/* Reaction Buttons */}
          <div className="flex justify-center space-x-12 mb-4">
            <button
              onClick={() => handleReaction("like")}
              disabled={isLiking}
              className="flex flex-col items-center space-y-1 hover:opacity-70 transition-opacity duration-200 disabled:opacity-50"
            >
              <div className={`w-12 h-12 border rounded-full flex items-center justify-center transition-colors duration-200 ${
                isLiked ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200'
              }`}>
                <ThumbsUp className={`w-5 h-5 ${isLiked ? 'text-blue-600' : 'text-gray-700'}`} />
              </div>
              <span className="text-xs font-medium text-gray-700">Like</span>
            </button>

            <button
              onClick={() => handleReaction("dislike")}
              className="flex flex-col items-center space-y-1 hover:opacity-70 transition-opacity duration-200"
            >
              <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center">
                <ThumbsDown className="w-5 h-5 text-gray-700" />
              </div>
              <span className="text-xs font-medium text-gray-700">Dislike</span>
            </button>

            <button
              onClick={() => handleReaction("love")}
              disabled={isLiking}
              className="flex flex-col items-center space-y-1 hover:opacity-70 transition-opacity duration-200 disabled:opacity-50"
            >
              <div className={`w-12 h-12 border rounded-full flex items-center justify-center transition-colors duration-200 ${
                isLiked ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-200'
              }`}>
                <Heart className={`w-5 h-5 ${isLiked ? 'text-red-600 fill-current' : 'text-gray-700'}`} />
              </div>
              <span className="text-xs font-medium text-gray-700">Love</span>
            </button>
          </div>

          {/* Try Another Pair Button */}
          <button
            onClick={handleTryAnother}
            className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-lg"
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
