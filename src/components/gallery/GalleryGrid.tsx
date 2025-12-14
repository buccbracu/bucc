"use client";

import { useState, useEffect, useRef, memo } from "react";
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

const LazyImage = memo(({ image, onClick }: { image: EventGallery; onClick: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      {isVisible && (
        <Image
          src={image.imageUrl}
          alt={image.caption || "Gallery image"}
          fill
          className={`object-cover transition-all duration-300 ${
            isLoaded ? "opacity-100 group-hover:scale-110" : "opacity-0"
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          quality={75}
        />
      )}
      {image.caption && isLoaded && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          {image.caption}
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = "LazyImage";

export function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<EventGallery | null>(null);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

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
          <LazyImage
            key={image.id}
            image={image}
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
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
              quality={90}
              priority
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
