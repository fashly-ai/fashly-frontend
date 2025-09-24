"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Heart, User, HelpCircle, ChevronDown, Filter } from "lucide-react";
import { useState } from "react";

export default function Products() {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showTryOnModal, setShowTryOnModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleTryOn = (product: string) => {
    setSelectedProduct(product);
    setShowTryOnModal(true);
    console.log(`Try on ${product}`);
  };

  const handleCloseModal = () => {
    setShowTryOnModal(false);
    setSelectedProduct("");
  };

  const handleSaveLook = () => {
    console.log("Save look clicked");
    handleCloseModal();
  };

  const handleShare = () => {
    console.log("Share +50 pts clicked");
    handleCloseModal();
  };

  const handleSeeDetails = () => {
    console.log("See details clicked");
    handleCloseModal();
    router.push("/try-on-result");
  };

  const [displayedProducts, setDisplayedProducts] = useState(4);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Brands");

  const handleLoadMore = () => {
    setDisplayedProducts(products.length);
    setHasLoadedMore(true);
    console.log("Load more products - showing all");
  };

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleRecentlyTried = (brand: string) => {
    console.log(`Selected ${brand}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log(`Searching for: ${searchQuery}`);
      setShowSearchSuggestions(false);
    } else {
      setShowSearchSuggestions(!showSearchSuggestions);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Show suggestions when typing, hide when empty
    setShowSearchSuggestions(value.length > 0);
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery("");
      setShowSearchSuggestions(false);
    }
  };

  const handleSearchSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSearchSuggestions(false);
    console.log(`Selected suggestion: ${suggestion}`);
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
  const frameShapes = ["Round", "Square", "Oval", "Cat Eye", "Aviator", "Rectangle", "Wayfarer", "Clubmaster"];
  const priceRanges = ["Under $100", "$100 - $200", "$200 - $300", "$300 - $500", "Over $500"];
  const sortOptions = ["Most Popular", "Price: Low to High", "Price: High to Low", "Newest", "Best Rated"];

  // Mock product data
  const products = [
    {
      id: 1,
      brand: "Oakley",
      model: "Sport Shield",
      price: 180,
      image: "Product Image"
    },
    {
      id: 2,
      brand: "Gucci",
      model: "Classic Round",
      price: 420,
      image: "Product Image"
    },
    {
      id: 3,
      brand: "Ray-Ban",
      model: "Aviator Classic",
      price: 154,
      image: "Product Image"
    },
    {
      id: 4,
      brand: "Prada",
      model: "Linea Rossa",
      price: 380,
      image: "Product Image"
    },
    {
      id: 5,
      brand: "Tom Ford",
      model: "Whitney",
      price: 520,
      image: "Product Image"
    },
    {
      id: 6,
      brand: "Gentle Monster",
      model: "Lang",
      price: 290,
      image: "Product Image"
    }
  ];

  // Mock recently tried brands
  const recentlyTried = [
    { name: "Ray-Ban", fullName: "Ray-Ban" },
    { name: "Gentle Mon...", fullName: "Gentle Monster" },
    { name: "Tom Ford", fullName: "Tom Ford" },
    { name: "Prada", fullName: "Prada" },
    { name: "Oakley", fullName: "Oakley" }
  ];

  // Mock search suggestions
  const searchSuggestions = [
    "Ray-Ban Aviator",
    "Gucci Sunglasses",
    "Round Frames",
    "Cat Eye Glasses",
    "Oakley Sport",
    "Tom Ford Whitney",
    "Prada Linea Rossa",
    "Gentle Monster Lang",
    "Square Frames",
    "Blue Lenses"
  ];

  // Filter suggestions based on search query
  const filteredSuggestions = searchQuery.length > 0 
    ? searchSuggestions.filter((suggestion) => 
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchSuggestions;

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
                      if (e.key === 'Enter') {
                        handleSearch();
                      } else if (e.key === 'Escape') {
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
                
                {/* Search Suggestions Dropdown */}
                {showSearchSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSuggestion(suggestion)}
                        className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
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
            onClick={() => handleCategoryChange("Brands")}
            className={`font-medium pb-2 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base ${
              activeCategory === "Brands" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Brands
          </button>
          <button 
            onClick={() => handleCategoryChange("Styles")}
            className={`font-medium pb-2 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base ${
              activeCategory === "Styles" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Styles
          </button>
          <button 
            onClick={() => handleCategoryChange("Colors")}
            className={`font-medium pb-2 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base ${
              activeCategory === "Colors" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Colors
          </button>
          <button 
            onClick={() => handleCategoryChange("Best for You")}
            className={`font-medium pb-2 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base ${
              activeCategory === "Best for You" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Best for You
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
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
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
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Recently Tried</h2>
        <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2">
          {recentlyTried.map((brand) => (
            <button 
              key={brand.fullName}
              onClick={() => handleRecentlyTried(brand.fullName)}
              className="bg-gray-200 border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 min-w-[80px] sm:min-w-[100px] text-center hover:bg-gray-300 transition-colors duration-200 flex-shrink-0"
            >
              <span className="text-xs sm:text-sm font-semibold text-gray-800">
                {brand.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 sm:px-6 pb-20 sm:pb-24">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {products.slice(0, displayedProducts).map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="relative">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-xs sm:text-sm">{product.image}</span>
                </div>
                <button className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors duration-200">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </button>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{product.brand}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{product.model}</p>
                <div className="flex justify-between items-center mt-1 sm:mt-2">
                  <span className="font-bold text-gray-900 text-sm sm:text-base">${product.price}</span>
                </div>
                <button
                  onClick={() => handleTryOn(`${product.brand} ${product.model}`)}
                  className="w-full mt-2 sm:mt-3 bg-black text-white py-2 sm:py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 text-xs sm:text-sm"
                >
                  Try On
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {!hasLoadedMore && (
          <div className="text-center mt-6 sm:mt-8">
            <button
              onClick={handleLoadMore}
              className="bg-gray-100 text-gray-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base"
            >
              Load More ({products.length - displayedProducts} remaining)
            </button>
          </div>
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
      {showTryOnModal && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-20 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg max-w-sm sm:max-w-md w-full p-4 sm:p-6 relative">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Selfie Preview */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="text-center mb-3 sm:mb-4">
                <p className="text-base sm:text-lg text-gray-600 mb-1 sm:mb-2">Your selfie with</p>
                <p className="text-lg sm:text-xl font-semibold text-gray-900">{selectedProduct}</p>
              </div>
              
              {/* Image Placeholder Square */}
              <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-1 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs sm:text-sm">Image will appear here</p>
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
