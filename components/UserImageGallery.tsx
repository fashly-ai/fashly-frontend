"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, Check, Star, Upload, Plus, X } from "lucide-react";
import axios from "@/lib/axios";

interface UserImage {
  id: string;
  userId: string;
  imageUrl: string;
  gcsKey: string;
  description: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserImageGalleryProps {
  onDefaultImageChange?: (imageUrl: string) => void;
}

export default function UserImageGallery({ onDefaultImageChange }: UserImageGalleryProps) {
  const [images, setImages] = useState<UserImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<UserImage[]>("/api/user-images");
      // Sort by default first, then by creation date
      const sorted = response.data.sort((a, b) => {
        if (a.isDefault) return -1;
        if (b.isDefault) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setImages(sorted);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImage = async (file: File) => {
    setIsUploading(true);
    setUploadProgress("Preparing upload...");
    setError(null);

    try {
      // Step 1: Get presigned URL
      setUploadProgress("Getting upload URL...");
      const presignedResponse = await axios.post("/api/s3/presigned-upload-url", {
        fileName: file.name,
        fileType: file.type,
      });

      const { uploadUrl, downloadUrl, key } = presignedResponse.data;
      const fileUrl = downloadUrl || uploadUrl.split("?")[0];

      // Step 2: Upload to GCS
      setUploadProgress("Uploading image...");
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      // Step 3: Save to database via new API
      setUploadProgress("Saving to database...");
      const saveResponse = await axios.post<UserImage>("/api/user-images", {
        imageUrl: fileUrl,
        gcsKey: key,
        description: null,
        isDefault: images.length === 0, // First image is auto-default
      });

      // Update local state
      const newImage = saveResponse.data;
      setImages((prev) => [newImage, ...prev]);

      // Notify parent if this is the default image
      if (newImage.isDefault && onDefaultImageChange) {
        onDefaultImageChange(newImage.imageUrl);
      }

      setShowUploadModal(false);
      setUploadProgress("");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setError(error.response?.data?.message || error.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetDefault = async (imageId: string) => {
    setSettingDefaultId(imageId);
    setError(null);

    try {
      await axios.patch("/api/user-images/default", { imageId });

      // Update local state
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isDefault: img.id === imageId,
        }))
      );

      // Notify parent of new default image
      const newDefaultImage = images.find((img) => img.id === imageId);
      if (newDefaultImage && onDefaultImageChange) {
        onDefaultImageChange(newDefaultImage.imageUrl);
      }
    } catch (error: any) {
      console.error("Error setting default:", error);
      setError(error.response?.data?.message || "Failed to set default image");
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setDeletingId(imageId);
    setError(null);

    try {
      await axios.delete(`/api/user-images/${imageId}`);

      // Remove from local state
      const deletedImage = images.find((img) => img.id === imageId);
      const wasDefault = deletedImage?.isDefault;
      
      setImages((prev) => {
        const remaining = prev.filter((img) => img.id !== imageId);
        
        // If we deleted the default and there are remaining images,
        // the backend auto-assigns a new default, so fetch fresh data
        if (wasDefault && remaining.length > 0) {
          fetchImages();
        }
        
        return remaining;
      });

      // If the default was deleted and there are remaining images, notify parent
      if (wasDefault && images.length > 1) {
        const newDefault = images.find((img) => img.id !== imageId);
        if (newDefault && onDefaultImageChange) {
          onDefaultImageChange(newDefault.imageUrl);
        }
      }
    } catch (error: any) {
      console.error("Error deleting image:", error);
      setError(error.response?.data?.message || "Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10MB");
      return;
    }

    handleUploadImage(file);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-gray-900">Your Photos</h4>
          <p className="text-sm text-gray-600">
            {images.length === 0
              ? "Upload your first photo for virtual try-on"
              : `${images.length} photo${images.length > 1 ? "s" : ""} • Default marked with ⭐`}
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          disabled={isUploading}
          className="px-3 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 animate-spin text-gray-700" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{uploadProgress}</p>
              <div className="mt-2 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                <div className="h-full bg-gray-900 rounded-full animate-pulse" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {images.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-600 mb-4">No photos yet</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            Upload Your First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative group rounded-lg overflow-hidden border-2 ${
                image.isDefault ? "border-gray-900 shadow-lg" : "border-gray-200"
              }`}
            >
              {/* Image */}
              <div className="aspect-[3/4] bg-gray-100">
                <img
                  src={image.imageUrl}
                  alt={image.description || "User photo"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Default Badge */}
              {image.isDefault && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center space-x-1 shadow-lg">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Default</span>
                </div>
              )}

              {/* Action Buttons - Show on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200">
                <div className="absolute bottom-0 left-0 right-0 p-2 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {!image.isDefault && (
                    <button
                      onClick={() => handleSetDefault(image.id)}
                      disabled={settingDefaultId === image.id}
                      className="w-full px-2 py-1.5 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded flex items-center justify-center space-x-1 disabled:opacity-50"
                    >
                      {settingDefaultId === image.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <Star className="w-3 h-3" />
                          <span>Set as Default</span>
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(image.id)}
                    disabled={deletingId === image.id || images.length === 1}
                    className="w-full px-2 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={images.length === 1 ? "Cannot delete the only image" : "Delete image"}
                  >
                    {deletingId === image.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Upload New Photo</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="hidden"
                  id="image-upload-input"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Click to select image
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </label>
            </div>

            <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-700">
                💡 <strong>Tips:</strong> Natural lighting, full body visible, stand 6ft from camera
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

