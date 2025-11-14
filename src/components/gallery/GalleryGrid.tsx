"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
type EventGallery = {
  id: string;
  imageUrl: string;
  caption?: string;
};

interface GalleryGridProps {
  images: EventGallery[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<EventGallery | null>(null);

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No images available in this gallery.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.imageUrl}
              alt={image.caption || "Gallery image"}
              fill
              className="object-cover transition-transform group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <Image
              src={selectedImage.imageUrl}
              alt={selectedImage.caption || "Gallery image"}
              fill
              className="object-contain"
              sizes="100vw"
            />
            {selectedImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-white text-center">
                {selectedImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
