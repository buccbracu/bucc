"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Eye, EyeOff, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type EventGallery = {
  id: string;
  eventId: string;
  imageUrl: string;
  caption?: string;
  isActive: boolean;
  order: string;
};
import {
  deleteEventGallery,
  toggleGalleryStatus,
  createEventGallery,
} from "@/actions/eventGalleries";
import { CloudinaryUploadWidget } from "./CloudinaryUploadWidget";

interface GalleryManagerWithWidgetProps {
  eventId: string;
  images: EventGallery[];
}

export function GalleryManagerWithWidget({
  eventId,
  images,
}: GalleryManagerWithWidgetProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");

  const handleUploadSuccess = async (imageUrl: string) => {
    setUploading(true);
    try {
      const result = await createEventGallery({
        eventId,
        imageUrl,
        caption: caption || undefined,
        isActive: true,
        order: "0",
      });

      if (result.success) {
        setCaption("");
        router.refresh();
      } else {
        alert(result.error || "Failed to save image");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    const result = await deleteEventGallery(id);
    if (result.success) {
      router.refresh();
    } else {
      alert("Failed to delete image");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleGalleryStatus(id, !currentStatus);
    if (result.success) {
      router.refresh();
    } else {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Upload New Image</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="caption">Caption (Optional)</Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter image caption"
              disabled={uploading}
            />
          </div>
          <CloudinaryUploadWidget
            onUploadSuccess={handleUploadSuccess}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-muted-foreground">Saving image...</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="border rounded-lg overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={image.imageUrl}
                alt={image.caption || "Gallery image"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="p-3 space-y-2">
              {image.caption && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {image.caption}
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleStatus(image.id, image.isActive)}
                >
                  {image.isActive ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Status: {image.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
