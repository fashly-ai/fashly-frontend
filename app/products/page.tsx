"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Heart,
  User,
  HelpCircle,
  ChevronDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Bell,
  CheckCircle,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";
import { useTryOnSocket, TryOnJobUpdate, TryOnJob } from "@/lib/useTryOnSocket";
import ImageUpload from "@/components/ImageUpload";

// History data from the API
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

interface ClothingProduct {
  id: string;
  name: string;
  brand: string;
  clothingType: string; // "upper" or "lower"
  description: string;
  price: number | null | undefined;
  currency: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  additionalImages: string[] | null;
  color: string;
  sizes: string[];
  material: string;
  category: string;
  season: string;
  style: string;
  tags: string[];
  productUrl: string | null;
  sku: string | null;
  isActive: boolean;
  inStock: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  total: number;
  page: string;
  limit: string;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function Products() {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTryOnModal, setShowTryOnModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ClothingProduct | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);

  // API state
  const [products, setProducts] = useState<ClothingProduct[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Selection state for outfit builder - now supports any items
  const [selectedItems, setSelectedItems] = useState<ClothingProduct[]>([]);
  const [currentTryOnItems, setCurrentTryOnItems] = useState<ClothingProduct[]>([]);

  // Try-on state
  const [isTryOnProcessing, setIsTryOnProcessing] = useState(false);
  const [tryOnImage, setTryOnImage] = useState<string | null>(null);
  const [tryOnError, setTryOnError] = useState<string | null>(null);
  const [tryOnHistoryId, setTryOnHistoryId] = useState<string | null>(null);
  
  // User profile state
  const [userDefaultImage, setUserDefaultImage] = useState<string | null>(null);
  const [showImageWarningModal, setShowImageWarningModal] = useState(false);
  const [isSavingLook, setIsSavingLook] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  // Try-on notification state
  const [tryOnNotification, setTryOnNotification] = useState<{
    show: boolean;
    job: TryOnJob | null;
    historyData: TryOnHistoryData | null;
  }>({ show: false, job: null, historyData: null });

  // Handle try-on job completed - fetch full history data
  const handleJobCompleted = useCallback(async (data: TryOnJobUpdate) => {
    console.log("🎉 Try-on completed!", data);
    
    // Get outfit info from active jobs before it's removed
    const outfitInfo = activeJobs.get(data.jobId)?.outfitInfo;
    
    // Store history ID for viewing
    if (data.historyId) {
      localStorage.setItem("tryOnHistoryId", data.historyId);
      
      try {
        // Fetch full history data from API
        console.log("📡 Fetching history data for:", data.historyId);
        const historyResponse = await axios.get(`/api/fashn/history/${data.historyId}`);
        const historyData: TryOnHistoryData = historyResponse.data;
        
        console.log("📦 History data received:", historyData);
        
        // Store full history data
        localStorage.setItem("tryOnHistoryData", JSON.stringify(historyData));
        if (historyData.resultImageUrl) {
          localStorage.setItem("tryOnResultImage", historyData.resultImageUrl);
        }
        
        // Show notification with full data
        setTryOnNotification({
          show: true,
          job: {
            jobId: data.jobId,
            status: data.status,
            progress: 100,
            resultImageUrl: historyData.resultImageUrl,
            historyId: data.historyId,
            processingTime: historyData.processingTime || data.processingTime,
            outfitInfo,
          },
          historyData,
        });
        
        showToast("✨ Your try-on is ready!", "success");
      } catch (error) {
        console.error("Error fetching history data:", error);
        
        // Fallback to WebSocket data if API fails
        if (data.resultImageUrl) {
          localStorage.setItem("tryOnResultImage", data.resultImageUrl);
        }
        
        setTryOnNotification({
          show: true,
          job: {
            jobId: data.jobId,
            status: data.status,
            progress: 100,
            resultImageUrl: data.resultImageUrl,
            historyId: data.historyId,
            processingTime: data.processingTime,
            outfitInfo,
          },
          historyData: null,
        });
        
        showToast("✨ Your try-on is ready!", "success");
      }
    } else {
      // No history ID, use WebSocket data directly
      if (data.resultImageUrl) {
        localStorage.setItem("tryOnResultImage", data.resultImageUrl);
      }
      
      setTryOnNotification({
        show: true,
        job: {
          jobId: data.jobId,
          status: data.status,
          progress: 100,
          resultImageUrl: data.resultImageUrl,
          historyId: data.historyId,
          processingTime: data.processingTime,
          outfitInfo,
        },
        historyData: null,
      });
      
      showToast("✨ Your try-on is ready!", "success");
    }
  }, []);

  // Handle try-on job failed
  const handleJobFailed = useCallback((data: TryOnJobUpdate) => {
    console.error("❌ Try-on failed:", data.errorMessage);
    showToast(data.errorMessage || "Try-on failed. Please try again.", "error");
  }, []);

  // Initialize WebSocket connection
  const {
    isConnected,
    activeJobs,
    completedJobs,
    activeJobCount,
    hasActiveJobs,
    addJob,
    clearCompletedJob,
  } = useTryOnSocket({
    onJobCompleted: handleJobCompleted,
    onJobFailed: handleJobFailed,
  });

  useEffect(() => {
    // Only fetch on initial load
    fetchProducts(1, false);
    fetchUserDefaultImage();
  }, []);
  
  const fetchUserDefaultImage = async () => {
    try {
      const response = await axios.get('/api/user-images/default');
      if (response.data && response.data.imageUrl) {
        setUserDefaultImage(response.data.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching default image:', error);
      // User might not have a default image yet
      setUserDefaultImage(null);
    }
  };

  const fetchProducts = async (
    page: number,
    append: boolean = false,
    search: string = ""
  ) => {
    try {
      // Use different loading states for initial load vs pagination
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await axios.get(
        `/api/clothes?sortBy=createdAt&sortOrder=DESC&page=${page}&limit=40${searchParam}`
      );

      if (append) {
        // Append new products to existing list
        setProducts((prev) => [...prev, ...response.data.data]);
      } else {
        // Replace products (initial load or search)
        setProducts(response.data.data);
      }

      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      if (append) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  // Helper function to get the currently displayed image for a product
  const getCurrentImageForProduct = (product: ClothingProduct) => {
    const availableImages = [
      product.imageUrl,
      ...(product.additionalImages || [])
    ].filter(Boolean);
    const currentIndex = currentImageIndex[product.id] || 0;
    return availableImages[currentIndex] || product.imageUrl;
  };

  // Add or remove item from selection
  const handleToggleItem = (product: ClothingProduct) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((item) => item.id === product.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  // Try on with selected items
  const handleTryOn = async () => {
    // Check if user has a default image
    if (!userDefaultImage) {
      setShowImageWarningModal(true);
      return;
    }

    if (selectedItems.length === 0) {
      showToast("Please select at least one item to try on", "error");
      return;
    }

    // Get the currently displayed images for each selected item
    const garmentUrls = selectedItems.map((item) => getCurrentImageForProduct(item));

    // Store outfit info for later (for display in notifications)
    const outfitInfo = {
      items: selectedItems.map((item, idx) => ({
        name: item.name,
        price: item.price ?? undefined,
        imageUrl: garmentUrls[idx],
      })),
    };

    // Store outfit data for result page
    localStorage.setItem("selectedOutfit", JSON.stringify({
      items: selectedItems,
    }));

    try {
      // Prepare the outfit data for the queue API using new format
      const tryOnData = {
        garmentUrls: garmentUrls,
        category: "auto",
        mode: "quality",
        saveToHistory: true,
      };

      console.log("🔄 Submitting try-on job:", tryOnData);

      // Call the queue API
      const response = await axios.post("/api/fashn/tryon/queue", tryOnData);
      const jobId = response.data.jobId;

      console.log("✅ Try-on job queued:", jobId);

      // Add job to tracking with outfit info
      addJob(jobId, outfitInfo);

      // Show success toast
      showToast("🎨 Try-on queued! You'll be notified when it's ready.", "success");

      // Clear selections after queuing
      setSelectedItems([]);
    } catch (error: any) {
      console.error("❌ Try-on error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to start try-on. Please try again.";

      showToast(errorMessage, "error");
    }
  };

  const handleCloseModal = () => {
    setShowTryOnModal(false);
    setModalImageIndex(0);
    setTryOnImage(null);
    setTryOnError(null);
    setTryOnHistoryId(null);
  };


  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleSaveLook = async () => {
    if (!tryOnHistoryId || !tryOnImage) {
      console.log("No try-on to save");
      handleCloseModal();
      return;
    }

    setIsSavingLook(true);
    try {
      // Call the new API to update saved status
      await axios.patch(
        `/api/fashn/history/${tryOnHistoryId}/saved`,
        {
          isSaved: true,
        }
      );

      showToast("Look saved successfully!", "success");
      handleCloseModal();
    } catch (error: any) {
      console.error("Error saving look:", error);
      showToast(
        error.response?.data?.message || "Failed to save look. Please try again.",
        "error"
      );
    } finally {
      setIsSavingLook(false);
    }
  };

  const handleShare = () => {
    if (tryOnImage) {
      // Share the try-on image
      console.log("Sharing try-on image");
      // You can implement actual share logic here
    }
    console.log("Share +50 pts clicked");
    handleCloseModal();
  };

  const handleSeeDetails = async () => {
    handleCloseModal();
    
    // Navigate to result page with history ID
    if (tryOnHistoryId) {
      router.push(`/try-on-result/${tryOnHistoryId}`);
    } else {
      // Fallback - should not happen normally
      router.push("/products");
    }
  };

  // Handle viewing completed try-on notification
  const handleViewTryOnResult = () => {
    if (tryOnNotification.job) {
      const historyId = tryOnNotification.historyData?.id || tryOnNotification.job.historyId;
      
      // Clear the notification
      setTryOnNotification({ show: false, job: null, historyData: null });
      clearCompletedJob(tryOnNotification.job.jobId);
      
      // Navigate to result page with history ID
      if (historyId) {
        router.push(`/try-on-result/${historyId}`);
      }
    }
  };

  // Dismiss notification
  const handleDismissNotification = () => {
    if (tryOnNotification.job) {
      clearCompletedJob(tryOnNotification.job.jobId);
    }
    setTryOnNotification({ show: false, job: null, historyData: null });
  };

  const handleToggleFavorite = async (clothingId: string, index: number) => {
    try {
      // Call the API first
      await axios.post("/api/clothes/favorites/toggle", {
        clothingId: clothingId,
      });

      // Update UI only after successful API call
      setProducts((prevProducts) =>
        prevProducts.map((product, i) =>
          i === index
            ? { ...product, isFavorite: !product.isFavorite }
            : product
        )
      );

      console.log("Favorite toggled successfully");
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const [activeCategory, setActiveCategory] = useState("All");

  const handleLoadMore = async () => {
    if (pagination?.hasNext && !isLoadingMore) {
      const nextPage = currentPage + 1;
      await fetchProducts(nextPage, true, searchQuery);
      setCurrentPage(nextPage);
    }
  };

  const handleNextImage = useCallback((productId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages,
    }));
  }, []);

  const handlePrevImage = useCallback((productId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages,
    }));
  }, []);

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleRecentlyTried = (brand: string) => {
    console.log(`Selected ${brand}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Fetch products with search query
      setCurrentPage(1);
      fetchProducts(1, false, searchQuery);
    } else {
      // Reset to show all products
      setCurrentPage(1);
      fetchProducts(1, false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Auto-search as user types (debounced by React's natural re-render)
    if (value.trim()) {
      setCurrentPage(1);
      fetchProducts(1, false, value);
    } else {
      // If search is cleared, show all products
      setCurrentPage(1);
      fetchProducts(1, false);
    }
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery("");
      // Reset to show all products
      setCurrentPage(1);
      fetchProducts(1, false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    console.log(`Selected category: ${category}`);
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
    setActiveDropdown(null); // Close any open dropdowns when toggling filters
  };

  // Mock data for dropdowns
  const clothingStyles = [
    "casual",
    "formal",
    "sports",
    "outdoor",
    "classic",
    "sporty",
    "athletic",
    "elegant",
  ];
  const priceRanges = [
    "Under $50",
    "$50 - $100",
    "$100 - $150",
    "$150 - $200",
    "Over $200",
  ];
  const sortOptions = [
    "Most Popular",
    "Price: Low to High",
    "Price: High to Low",
    "Newest",
    "Best Rated",
  ];

  // Mock recently tried brands
  const recentlyTried = [
    { name: "Ray-Ban", fullName: "Ray-Ban" },
    { name: "Gentle Mon...", fullName: "Gentle Monster" },
    { name: "Tom Ford", fullName: "Tom Ford" },
    { name: "Prada", fullName: "Prada" },
    { name: "Oakley", fullName: "Oakley" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-2 sm:mr-3 p-1 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-gray-900">
              Clothing Categories
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 relative">
            {showSearch ? (
              <div className="relative">
                <div className="flex items-center bg-white rounded-lg shadow-sm">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      } else if (e.key === "Escape") {
                        handleSearchToggle();
                      }
                    }}
                    placeholder="Search clothing..."
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500 rounded-l-lg text-sm sm:text-base"
                    autoFocus
                  />
                  <button
                    onClick={handleSearch}
                    className="p-2 sm:p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-r-lg transition-colors duration-200"
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleSearchToggle}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex space-x-4 sm:space-x-6 mb-4 sm:mb-6 overflow-x-auto">
          <button
            onClick={() => handleCategoryChange("All")}
            className={`font-medium pb-2 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base ${
              activeCategory === "All"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleCategoryChange("upper")}
            className={`font-medium pb-2 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base ${
              activeCategory === "upper"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Upper Body
          </button>
          <button
            onClick={() => handleCategoryChange("lower")}
            className={`font-medium pb-2 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base ${
              activeCategory === "lower"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Lower Body
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div>
          {/* Filters Toggle Button */}
          <button
            onClick={handleFilterToggle}
            className="flex items-center space-x-2 mb-4 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors duration-200"
          >
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Filters</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Filter Buttons - Conditionally Shown */}
          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Style Dropdown */}
              <div className="relative flex-1">
                <button
                  onClick={() => handleDropdownToggle("style")}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  <span>Style</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === "style" && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {clothingStyles.map((style) => (
                      <button
                        key={style}
                        onClick={() => {
                          console.log(`Selected style: ${style}`);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg capitalize"
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Dropdown */}
              <div className="relative flex-1">
                <button
                  onClick={() => handleDropdownToggle("price")}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  <span>Price</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === "price" && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {priceRanges.map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          console.log(`Selected price range: ${range}`);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative flex-1">
                <button
                  onClick={() => handleDropdownToggle("sort")}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  <span>Most Popular</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === "sort" && (
                  <div className="absolute top-full right-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          console.log(`Selected sort option: ${option}`);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recently Tried Section */}

      {/* Product Grid */}
      <div className="px-4 sm:px-6 pb-20 sm:pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading products...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {products.map((product, productIndex) => {
                // Get all available images
                // Combine main image and additional images
                const availableImages = [
                  product.imageUrl,
                  ...(product.additionalImages || [])
                ].filter(Boolean);

                const currentIndex = currentImageIndex[product.id] || 0;
                const displayImage = availableImages[currentIndex];
                const hasMultipleImages = availableImages.length > 1;

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-slide-up hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="relative group">
                      <div className="aspect-[2/3] bg-gray-100 flex items-center justify-center overflow-hidden relative">
                        {displayImage ? (
                          <>
                            <img
                              key={displayImage}
                              src={displayImage}
                              alt={product.name}
                              className="w-full h-full object-contain transition-opacity duration-150"
                              loading="eager"
                              onLoad={(e) => {
                                // Preload adjacent images when current image loads
                                const nextIdx = (currentIndex + 1) % availableImages.length;
                                const prevIdx = (currentIndex - 1 + availableImages.length) % availableImages.length;
                                if (availableImages[nextIdx]) {
                                  const nextImg = new Image();
                                  nextImg.src = availableImages[nextIdx];
                                }
                                if (availableImages[prevIdx]) {
                                  const prevImg = new Image();
                                  prevImg.src = availableImages[prevIdx];
                                }
                              }}
                            />
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs sm:text-sm">
                            No Image
                          </span>
                        )}
                      </div>

                      {/* Image Navigation Buttons */}
                      {hasMultipleImages && (
                        <>
                          <button
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrevImage(
                                product.id,
                                availableImages.length
                              );
                            }}
                            className="absolute left-0.5 top-1/2 transform -translate-y-1/2 p-0.5 bg-white/90 rounded-full shadow-md hover:bg-white transition-all duration-150 opacity-0 group-hover:opacity-100 active:scale-95 z-10"
                          >
                            <ChevronLeft className="w-3 h-3 text-gray-800" />
                          </button>
                          <button
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNextImage(
                                product.id,
                                availableImages.length
                              );
                            }}
                            className="absolute right-0.5 top-1/2 transform -translate-y-1/2 p-0.5 bg-white/90 rounded-full shadow-md hover:bg-white transition-all duration-150 opacity-0 group-hover:opacity-100 active:scale-95 z-10"
                          >
                            <ChevronRight className="w-3 h-3 text-gray-800" />
                          </button>

                          {/* Image Indicator Dots */}
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                            {availableImages.map((_, index) => (
                              <div
                                key={index}
                                className={`w-1 h-1 rounded-full transition-all duration-200 ${
                                  index === currentIndex
                                    ? "bg-white w-2"
                                    : "bg-white/50"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(product.id, productIndex);
                        }}
                        className="absolute top-1.5 right-1.5 p-1 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Heart
                          className={`w-3 h-3 transition-colors duration-200 ${
                            product.isFavorite
                              ? "text-red-600 fill-current"
                              : "text-gray-600"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="p-2 sm:p-3">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                        {product.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-600 truncate">
                        {product.brand}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-bold text-gray-900 text-xs sm:text-sm">
                          ${product.price ? product.price.toFixed(2) : '0.00'}
                        </span>
                      </div>
                      {selectedItems.some((item) => item.id === product.id) ? (
                        <button
                          onClick={() => handleToggleItem(product)}
                          className="w-full mt-1.5 sm:mt-2 bg-gray-800 text-white py-1.5 sm:py-2 rounded-md font-medium hover:bg-gray-700 transition-colors duration-200 text-[10px] sm:text-xs"
                        >
                          ✓ Selected
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleItem(product)}
                          className="w-full mt-1.5 sm:mt-2 bg-black text-white py-1.5 sm:py-2 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200 text-[10px] sm:text-xs"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {pagination?.hasNext && (
              <div className="text-center mt-6 sm:mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-gray-100 text-gray-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                >
                  {isLoadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoadingMore
                    ? "Loading..."
                    : `Load More (${
                        pagination.total - products.length
                      } remaining)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Banner - Selected Items */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 shadow-lg">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 flex-1 overflow-x-auto">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={handleClearSelection}
                  className="text-xs text-gray-500 hover:text-red-600 underline"
                >
                  Clear
                </button>
              </div>
              <div className="flex items-center space-x-2 overflow-x-auto">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2 bg-gray-50 px-2 py-1.5 rounded-lg shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-gray-900 truncate max-w-[80px]">{item.name}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleItem(item);
                      }}
                      className="text-gray-500 hover:text-red-600 p-0.5"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleTryOn}
              className="bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap ml-3"
            >
              Try On
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-16 sm:bottom-20 right-4 sm:right-6 flex flex-col space-y-2 sm:space-y-3">
        <button
          onClick={() => router.push("/profile")}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
        <button className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200">
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] animate-fade-in">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <p className="font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Active Try-On Jobs Badge */}
      {hasActiveJobs && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[55]">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20">
            <div className="relative">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-yellow-900">
                {activeJobCount}
              </span>
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Creating your look...</p>
              <p className="text-xs text-white/80">We'll notify you when ready</p>
            </div>
          </div>
        </div>
      )}

      {/* Try-On Completed Notification - Full Screen Modal */}
      {tryOnNotification.show && tryOnNotification.job && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleDismissNotification}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
            {/* Celebration Header */}
            <div className="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 px-6 py-5 text-center relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
              
              {/* Close button */}
              <button
                onClick={handleDismissNotification}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              {/* Success icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-3 shadow-lg">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1">
                ✨ Your Look is Ready!
              </h2>
              <p className="text-white/90 text-sm">
                Your virtual try-on has been generated
              </p>
            </div>
            
            {/* Preview Content */}
            <div className="p-6">
              {/* Large Preview Image */}
              {tryOnNotification.job.resultImageUrl && (
                <div className="mb-5 rounded-2xl overflow-hidden bg-gradient-to-b from-gray-100 to-gray-50 shadow-inner">
                  <img
                    src={tryOnNotification.job.resultImageUrl}
                    alt="Try-on result"
                    className="w-full h-72 object-contain"
                  />
                </div>
              )}
              
              {/* Outfit Info Cards */}
              {tryOnNotification.job.outfitInfo?.items && tryOnNotification.job.outfitInfo.items.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 mb-5">
                  {tryOnNotification.job.outfitInfo.items.map((item: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {item.name}
                        </p>
                        {item.price && (
                          <p className="text-sm text-emerald-600 font-semibold">
                            ${item.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : tryOnNotification.historyData?.garmentUrls && tryOnNotification.historyData.garmentUrls.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 mb-5">
                  {tryOnNotification.historyData.garmentUrls.map((garmentUrl: string, idx: number) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                      <img
                        src={garmentUrl}
                        alt={`Garment ${idx + 1}`}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          Item {idx + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Processing Time Badge */}
              {tryOnNotification.job.processingTime && (
                <div className="flex justify-center mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Processed in {(tryOnNotification.job.processingTime / 1000).toFixed(1)}s
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleViewTryOnResult}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.98]"
                >
                  View Full Result →
                </button>
                <button
                  onClick={handleDismissNotification}
                  className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Try On Modal */}
      {showTryOnModal && (
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
                  Your try-on with
                </p>
                <p className="text-lg sm:text-xl font-semibold text-gray-900">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}
                </p>
                <div className="text-sm text-gray-600 space-y-1 max-h-20 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <p key={item.id}>
                      {item.name} - ${item.price ? item.price.toFixed(2) : '0.00'}
                    </p>
                  ))}
                </div>
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
                        <p className="text-xs sm:text-sm font-medium">
                          {tryOnError}
                        </p>
                      </div>
                    </div>
                  ) : tryOnImage ? (
                    // Try-On Result Image
                    <img
                      src={tryOnImage}
                      alt="Try on result for your outfit"
                      className="w-full h-full object-contain"
                    />
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
                          Processing your outfit...
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
                disabled={isTryOnProcessing || isSavingLook}
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center justify-center gap-2"
              >
                {isSavingLook && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSavingLook ? "Saving..." : "Save Look"}
              </button>
              <button
                onClick={handleShare}
                disabled={true}
                className="flex-1 bg-green-500 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-500"
              >
                Share +50 pts
              </button>
            </div>

            {/* See Details Link */}
            <div className="text-center">
              <button
                onClick={handleSeeDetails}
                disabled={isTryOnProcessing || isSavingLook}
                className="text-gray-600 hover:text-gray-800 font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-gray-600"
              >
                See Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Warning Modal */}
      {showImageWarningModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowImageWarningModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Photo Required
            </h3>

            {/* Description */}
            <p className="text-center text-gray-600 mb-6">
              To use virtual try-on, please upload a full-body photo of yourself. This helps us show you how clothes will look on you!
            </p>

            {/* Upload Section */}
            <div className="mb-6">
              <ImageUpload
                onUploadSuccess={(imageUrl) => {
                  setUserDefaultImage(imageUrl);
                  setShowImageWarningModal(false);
                  showToast("✅ Photo uploaded! You can now try on clothes.", "success");
                }}
              />
            </div>

            {/* Or Link to Settings */}
            <div className="text-center">
              <button
                onClick={() => {
                  setShowImageWarningModal(false);
                  router.push("/profile?tab=settings");
                }}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Or upload later in Profile Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
