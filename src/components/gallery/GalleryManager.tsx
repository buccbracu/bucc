"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Eye, EyeOff, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  uploadGalleryImage,
} from "@/actions/eventGalleries";

interface GalleryManagerProps {
  eventId: string;
  images: EventGallery[];
  onRefresh?: () => void;
}

export function GalleryManager({ eventId, images, onRefresh }: GalleryManagerProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setSuccessMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("eventId", eventId);
      formData.append("caption", caption);

      const result = await uploadGalleryImage(formData);

      if (result.success) {
        setCaption("");
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById("image") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        
        // Show success message
        setSuccessMessage("✅ Image uploaded successfully!");
        
        // Refresh the page data
        router.refresh();
        
        // Call parent refresh if provided
        if (onRefresh) {
          setTimeout(() => onRefresh(), 500);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(result.error || "Failed to upload image");
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage("Failed to upload image");
      setErrorDialogOpen(true);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setImageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;

    const result = await deleteEventGallery(imageToDelete);
    
    if (result.success) {
      setSuccessMessage("✅ Image deleted successfully!");
      router.refresh();
      if (onRefresh) {
        setTimeout(() => onRefresh(), 500);
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setErrorMessage(result.error || "Failed to delete image");
      setErrorDialogOpen(true);
    }
    
    setDeleteDialogOpen(false);
    setImageToDelete(null);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleGalleryStatus(id, !currentStatus);
    
    if (result.success) {
      const status = !currentStatus ? "active" : "inactive";
      setSuccessMessage(`✅ Image marked as ${status}!`);
      router.refresh();
      if (onRefresh) {
        setTimeout(() => onRefresh(), 500);
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setErrorMessage(result.error || "Failed to update status");
      setErrorDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
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
          <div>
            <Label htmlFor="image">Select Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
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
                  onClick={() => handleDeleteClick(image.id)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setErrorDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
