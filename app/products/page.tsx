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
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";

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
  isFavorite: boolean;
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
  const [selectedProduct, setSelectedProduct] = useState<GlassProduct | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);

  // API state
  const [products, setProducts] = useState<GlassProduct[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    // Only fetch on initial load
    fetchProducts(1, false);
  }, []);

  const fetchProducts = async (
    page: number,
    append: boolean = false,
    search: string = ""
  ) => {
    try {
      setIsLoading(true);
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await axios.get(
        `/api/glasses?sortBy=name&sortOrder=ASC&page=${page}&limit=20${searchParam}`
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
      setIsLoading(false);
    }
  };

  const handleTryOn = async (product: GlassProduct) => {
    setSelectedProduct(product);
    setModalImageIndex(0); // Reset to first image
    setShowTryOnModal(true);
    
    // Save try-on to backend
    try {
      await axios.post('/api/tryon/save', {
        glassesId: product.id
      });
      console.log(`Try on saved for ${product.name}`);
    } catch (error) {
      console.error('Error saving try-on:', error);
    }
  };

  const handleCloseModal = () => {
    setShowTryOnModal(false);
    setSelectedProduct(null);
    setModalImageIndex(0);
  };

  const handleModalNextImage = () => {
    if (selectedProduct && selectedProduct.allImages) {
      setModalImageIndex(
        (prev) => (prev + 1) % selectedProduct.allImages.length
      );
    }
  };

  const handleModalPrevImage = () => {
    if (selectedProduct && selectedProduct.allImages) {
      setModalImageIndex(
        (prev) =>
          (prev - 1 + selectedProduct.allImages.length) %
          selectedProduct.allImages.length
      );
    }
  };

  const handleSaveLook = () => {
    console.log("Save look clicked");
    handleCloseModal();
  };

  const handleShare = () => {
    console.log("Share +50 pts clicked");
    handleCloseModal();
  };

  const handleSeeDetails = async () => {
    if (!selectedProduct) return;

    try {
      // Fetch full product details
      const response = await axios.get(`/api/glasses/${selectedProduct.id}`);
      const productDetails = response.data;

      // Store product details in localStorage to pass to try-on result page
      localStorage.setItem(
        "selectedGlassProduct",
        JSON.stringify(productDetails)
      );

      handleCloseModal();
      router.push("/try-on-result");
    } catch (error) {
      console.error("Error fetching product details:", error);
      // Fallback: use current product data if API fails
      localStorage.setItem(
        "selectedGlassProduct",
        JSON.stringify(selectedProduct)
      );
      handleCloseModal();
      router.push("/try-on-result");
    }
  };

  const handleToggleFavorite = async (glassesId: string, index: number) => {
    try {
      // Call the API first
      await axios.post('/api/glasses/favorites/toggle', {
        glassesId: glassesId
      });
      
      // Update UI only after successful API call
      setProducts(prevProducts => 
        prevProducts.map((product, i) => 
          i === index 
            ? { ...product, isFavorite: !product.isFavorite }
            : product
        )
      );
      
      console.log('Favorite toggled successfully');
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const [activeCategory, setActiveCategory] = useState("Gentle Monster");

  const handleLoadMore = async () => {
    if (pagination?.hasNext && !isLoading) {
      // Save current scroll position
      const scrollPosition = window.scrollY;

      const nextPage = currentPage + 1;
      await fetchProducts(nextPage, true);
      setCurrentPage(nextPage);

      // Restore scroll position after a brief delay to allow DOM update
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);
    }
  };

  const handleNextImage = (productId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages,
    }));
  };

  const handlePrevImage = (productId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

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
  const frameShapes = [
    "Round",
    "Square",
    "Oval",
    "Cat Eye",
    "Aviator",
    "Rectangle",
    "Wayfarer",
    "Clubmaster",
  ];
  const priceRanges = [
    "Under $100",
    "$100 - $200",
    "$200 - $300",
    "$300 - $500",
    "Over $500",
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
              Glasses Categories
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
                    placeholder="Search glasses..."
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
            onClick={() => handleCategoryChange("Gentle Monster")}
            className={`font-medium pb-2 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base ${
              activeCategory === "Gentle Monster"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Gentle Monster
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
              {/* Frame Shape Dropdown */}
              <div className="relative flex-1">
                <button
                  onClick={() => handleDropdownToggle("frameShape")}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  <span>Frame Shape</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === "frameShape" && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {frameShapes.map((shape) => (
                      <button
                        key={shape}
                        onClick={() => {
                          console.log(`Selected frame shape: ${shape}`);
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {shape}
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
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {products.map((product, productIndex) => {
                // Get all available images
                const availableImages =
                  product.allImages && product.allImages.length > 0
                    ? product.allImages
                    : [product.imageUrl];

                // Prioritize D_45 image as the first image
                const d45Index = availableImages.findIndex((img) =>
                  img?.includes("D_45")
                );
                if (d45Index > 0) {
                  // Move D_45 image to the front
                  const d45Image = availableImages[d45Index];
                  availableImages.splice(d45Index, 1);
                  availableImages.unshift(d45Image);
                }

                const currentIndex = currentImageIndex[product.id] || 0;
                const displayImage = availableImages[currentIndex];
                const hasMultipleImages = availableImages.length > 1;

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="relative group">
                      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrevImage(
                                product.id,
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
                              handleNextImage(
                                product.id,
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

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(product.id, productIndex);
                        }}
                        className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Heart 
                          className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-200 ${
                            product.isFavorite 
                              ? 'text-red-600 fill-current' 
                              : 'text-gray-600'
                          }`} 
                        />
                      </button>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {product.brand}
                      </p>
                      <div className="flex justify-between items-center mt-1 sm:mt-2">
                        <span className="font-bold text-gray-900 text-sm sm:text-base">
                          {product.price}
                        </span>
                      </div>
                      <button
                        onClick={() => handleTryOn(product)}
                        className="w-full mt-2 sm:mt-3 bg-black text-white py-2 sm:py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 text-xs sm:text-sm"
                      >
                        Try On
                      </button>
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
                  disabled={isLoading}
                  className="bg-gray-100 text-gray-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading
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

      {/* Bottom Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-400 p-3 sm:p-4">
        <div className="text-center">
          <p className="text-yellow-900 font-medium text-sm sm:text-base">
            Earn points, unlock premium try-ons ✨ 250 pts
          </p>
        </div>
      </div>

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

      {/* Try On Modal */}
      {showTryOnModal && selectedProduct && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 relative shadow-2xl">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 z-10"
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
                  {selectedProduct.name}
                </p>
              </div>

              {/* Product Image with Navigation */}
              <div className="relative group">
                <div className="w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  {selectedProduct.allImages &&
                  selectedProduct.allImages.length > 0 ? (
                    <>
                      <img
                        src={selectedProduct.allImages[modalImageIndex]}
                        alt={`${selectedProduct.name} - Image ${
                          modalImageIndex + 1
                        }`}
                        className="w-full h-full object-cover"
                      />

                      {/* Navigation Buttons - Only show if multiple images */}
                      {selectedProduct.allImages.length > 1 && (
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
                            {selectedProduct.allImages.map((_, index) => (
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
                className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
              >
                Save Look
              </button>
              <button
                onClick={handleShare}
                className="flex-1 bg-green-500 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 text-sm sm:text-base"
              >
                Share +50 pts
              </button>
            </div>

            {/* See Details Link */}
            <div className="text-center">
              <button
                onClick={handleSeeDetails}
                className="text-gray-600 hover:text-gray-800 font-medium text-sm sm:text-base"
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
