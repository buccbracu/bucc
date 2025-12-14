"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (url: string) => void;
  disabled?: boolean;
}

export function CloudinaryUploadWidget({
  onUploadSuccess,
  disabled = false,
}: CloudinaryUploadWidgetProps) {
  return (
    <CldUploadWidget
      uploadPreset="bucc_gallery"
      options={{
        folder: "bucc/gallery",
        maxFiles: 1,
        resourceType: "image",
      }}
      onSuccess={(result: any) => {
        if (result.event === "success") {
          onUploadSuccess(result.info.secure_url);
        }
      }}
    >
      {({ open }) => (
        <Button
          type="button"
          onClick={() => open()}
          disabled={disabled}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
      )}
    </CldUploadWidget>
  );
}
