"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Share2, Heart, Bookmark, Loader2, Clock, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";

// History data from the API for clothing try-on
interface TryOnHistoryData {
  id: string;
  modelImageUrl: string;
  garmentUrls?: string[];  // New format
  upperGarmentUrl?: string;  // Legacy format
  lowerGarmentUrl?: string;  // Legacy format
  resultImageUrl: string;
  predictionId: string;
  processingTime: number;
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TryOnResultPage() {
  const router = useRouter();
  const params = useParams();
  const historyId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<TryOnHistoryData | null>(null);
  const [isSavingLook, setIsSavingLook] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!historyId) {
        setError("No history ID provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/fashn/history/${historyId}`);
        const data: TryOnHistoryData = response.data;
        setHistoryData(data);
      } catch (err: any) {
        console.error('Error fetching history data:', err);
        setError(err.response?.data?.message || 'Failed to load try-on result');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryData();
  }, [historyId]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleShare = () => {
    const url = `${window.location.origin}/try-on-result/${historyId}`;
    navigator.clipboard.writeText(url);
    setToast({ message: "Link copied!", type: 'success' });
  };

  const handleSaveLook = async () => {
    if (!historyId || !historyData) return;

    if (historyData.isSaved) {
      setToast({ message: "Already saved!", type: 'success' });
      return;
    }

    setIsSavingLook(true);
    try {
      await axios.patch(`/api/fashn/history/${historyId}/saved`, { isSaved: true });
      setHistoryData({ ...historyData, isSaved: true });
      setToast({ message: "Look saved! ✨", type: 'success' });
    } catch (error: any) {
      setToast({ message: 'Failed to save', type: 'error' });
    } finally {
      setIsSavingLook(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-t-violet-500 rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-500 mt-4 font-medium">Loading your look...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !historyData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        <div className="px-4 py-3 flex items-center">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">😕</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
            <p className="text-gray-500 mb-6">{error || "We couldn't find this try-on"}</p>
            <button
              onClick={() => router.push("/products")}
              className="bg-violet-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200"
            >
              Try Something New
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(historyData.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span className="font-semibold text-gray-900">Your Look</span>
          </div>
          
          <button 
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="aspect-[3/4] max-h-[60vh] mx-auto">
          <img
            src={historyData.resultImageUrl}
            alt="Try-on result"
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Floating Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isLiked ? 'bg-red-500 scale-110' : 'bg-white hover:scale-105'
          }`}
        >
          <Heart className={`w-6 h-6 ${isLiked ? 'text-white fill-white' : 'text-gray-600'}`} />
        </button>

        {/* Saved Badge */}
        {historyData.isSaved && (
          <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
            <Bookmark className="w-3 h-3 fill-current" />
            Saved
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-5">
        {/* Outfit Items */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Outfit Details</p>
          <div className="space-y-2">
            {/* New format: garmentUrls array */}
            {historyData.garmentUrls && historyData.garmentUrls.length > 0 ? (
              historyData.garmentUrls.map((garmentUrl, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-xl p-2 border border-gray-100">
                  <img
                    src={garmentUrl}
                    alt={`Garment ${index + 1}`}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Item {index + 1}</p>
                    <p className="text-xs text-gray-500">Garment</p>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Legacy format: upper/lower */}
                {historyData.upperGarmentUrl && (
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-2 border border-gray-100">
                    <img
                      src={historyData.upperGarmentUrl}
                      alt="Top"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Top</p>
                      <p className="text-xs text-gray-500">Upper garment</p>
                    </div>
                  </div>
                )}
                {historyData.lowerGarmentUrl && (
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-2 border border-gray-100">
                    <img
                      src={historyData.lowerGarmentUrl}
                      alt="Bottom"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Bottom</p>
                      <p className="text-xs text-gray-500">Lower garment</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Info Pills */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-600">{(historyData.processingTime / 1000).toFixed(1)}s</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
            <span className="text-xs text-gray-600">{formattedDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSaveLook}
            disabled={isSavingLook || historyData.isSaved}
            className={`w-full py-3.5 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
              historyData.isSaved 
                ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isSavingLook ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Bookmark className={`w-5 h-5 ${historyData.isSaved ? 'fill-current' : ''}`} />
            )}
            {historyData.isSaved ? "Saved" : "Save Look"}
          </button>
          
          <button
            onClick={() => router.push("/products")}
            className="w-full py-3.5 rounded-2xl font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            Try Another Look
          </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-3">
        <div className="flex justify-around">
          <button 
            onClick={() => router.push("/products")}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-600" />
            </div>
            <span className="text-xs font-medium text-gray-600">Try On</span>
          </button>
          
          <button 
            onClick={() => router.push("/profile")}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600">Profile</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className={`px-5 py-3 rounded-full shadow-lg font-medium text-sm ${
            toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-500 text-white'
          }`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
