"use client";

import { useState, useRef } from "react";
import { Loader2, Upload, X, Check } from "lucide-react";
import axios from "@/lib/axios";

interface ImageUploadProps {
  onUploadSuccess?: (imageUrl: string) => void;
  currentImageUrl?: string | null;
  className?: string;
  compact?: boolean;
}

export default function ImageUpload({
  onUploadSuccess,
  currentImageUrl,
  className = "",
  compact = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image size must be less than 10MB");
      return;
    }

    // Reset states
    setUploadError(null);
    setUploadSuccess(false);
    setIsUploading(true);
    setUploadProgress("Preparing upload...");

    // Create preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      // Step 1: Get presigned URL
      setUploadProgress("Getting upload URL...");
      const presignedResponse = await axios.post("/api/s3/presigned-upload-url", {
        fileName: file.name,
        fileType: file.type,
      });

      const { uploadUrl, downloadUrl, key } = presignedResponse.data;
      const fileUrl = downloadUrl || uploadUrl.split('?')[0]; // Use downloadUrl or extract base URL

      // Step 2: Upload to GCS using presigned URL
      setUploadProgress("Uploading image...");
      
      // Use native fetch for GCS upload to avoid axios interceptors
      // ONLY send Content-Type header - no extra headers allowed for presigned URLs
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText || uploadResponse.statusText}`);
      }

      // Step 3: Save to database using new multi-image API
      setUploadProgress("Saving to profile...");
      await axios.post("/api/user-images", {
        imageUrl: fileUrl,
        gcsKey: key,
        description: null,
        // First image will auto-default on backend
      });

      // Success!
      setUploadSuccess(true);
      setUploadProgress("Upload complete!");
      
      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(fileUrl);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
        setUploadProgress("");
      }, 3000);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to upload image. Please try again.";
      setUploadError(errorMessage);
      // Reset preview on error
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setUploadError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (compact) {
    // Compact view (for profile page) - just upload controls, no preview
    return (
      <div className={`relative ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col space-y-3">
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-1">
              {previewUrl ? 'Photo uploaded' : 'No photo uploaded'}
            </p>
            <p className="text-xs text-gray-600">
              {previewUrl ? 'Click to update your photo' : 'Upload a full body photo for virtual try-on'}
            </p>
          </div>
          
          <button
            onClick={handleClick}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>{previewUrl ? 'Change Photo' : 'Upload Photo'}</span>
              </>
            )}
          </button>
          
          {isUploading && (
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gray-900 rounded-full transition-all duration-300" style={{ width: '50%' }} />
              </div>
              <span className="text-xs text-gray-600 whitespace-nowrap">{uploadProgress}</span>
            </div>
          )}
          
          {uploadError && (
            <div className="p-2 bg-red-50 rounded text-xs text-red-700">
              {uploadError}
            </div>
          )}
          
          {uploadSuccess && (
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-medium">{uploadProgress}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full view (for setup page)
  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        // Preview mode - more compact
        <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden max-w-xs mx-auto">
          <div className="relative" style={{ maxHeight: '300px' }}>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              style={{ maxHeight: '300px' }}
            />
          </div>
          {!isUploading && (
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="w-10 h-10 mx-auto mb-2 animate-spin" />
                <p className="text-sm font-medium">{uploadProgress}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Upload prompt
        <button
          onClick={handleClick}
          disabled={isUploading}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-gray-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex flex-col items-center">
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mb-3 sm:mb-4 animate-spin" />
                <p className="text-sm sm:text-base text-gray-600 font-medium">
                  {uploadProgress}
                </p>
              </>
            ) : (
              <>
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-3 sm:mb-4"
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
                <p className="text-sm sm:text-base text-gray-600 font-medium mb-1">
                  Add Your Photo
                </p>
                <p className="text-xs text-gray-500">Click to browse or drag and drop</p>
              </>
            )}
          </div>
        </button>
      )}

      {/* Success message */}
      {uploadSuccess && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-center space-x-2">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700 font-medium">{uploadProgress}</p>
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="mt-3 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}

      {/* Tips */}
      {!previewUrl && !uploadError && (
        <div className="mt-3 sm:mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200 flex items-start">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <p className="text-xs sm:text-sm text-gray-700">
            💡 For best results: Natural light, clear face, stand 6ft from camera, full body visible
          </p>
        </div>
      )}
    </div>
  );
}

