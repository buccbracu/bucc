"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
}

export default function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary via API route
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "event_banners");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (data.secure_url) {
        onUploadComplete(data.secure_url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`);
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg appearance-none cursor-pointer hover:border-gray-400 focus:outline-none dark:bg-gray-800 dark:border-gray-600">
          {preview ? (
            <img src={preview} alt="Preview" className="h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500">
                {isUploading ? "Uploading..." : "Click to upload banner image"}
              </span>
            </div>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
      <p className="text-xs text-gray-500">
        Recommended size: 1200x300px. Max file size: 5MB
      </p>
    </div>
  );
}
