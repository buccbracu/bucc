"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { getActiveEventBanner } from "@/actions/eventBanners";
import type { EventBanner } from "@/lib/db/schema/eventBanners";

export default function EventBanner() {
  const pathname = usePathname();
  const [banner, setBanner] = useState<EventBanner | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [is404, setIs404] = useState(false);

  useEffect(() => {
    async function fetchBanner() {
      const result = await getActiveEventBanner();
      if (result.success && result.data) {
        setBanner(result.data);
      }
      setIsLoading(false);
    }
    fetchBanner();
  }, []);

  useEffect(() => {
    // Check if we're on a 404 page by looking for the not-found containers
    const check404 = () => {
      const notFoundContainer = document.querySelector('.not-found-container');
      const animated404Container = document.querySelector('.animated-404-container');
      setIs404(!!(notFoundContainer || animated404Container));
    };
    
    check404();
    // Recheck after a short delay to handle dynamic content
    const timer = setTimeout(check404, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  // Don't show banner on events page or 404 page
  if (pathname === "/events" || is404 || isLoading || !banner || !isVisible) {
    return null;
  }

  const now = new Date();
  const startDate = banner.eventDate ? new Date(banner.eventDate) : new Date(banner.createdAt);
  const endDate = banner.eventEndDate ? new Date(banner.eventEndDate) : null;

  // Determine event status
  const isOngoing = endDate && now >= startDate && now <= endDate;
  const isUpcoming = startDate > now;

  return (
    <div className="relative w-full px-4 py-4">
      <div className="relative">
        <Link
          href={banner.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-md">
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Event Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{banner.title}</h2>
              {banner.location && (
                <p className="text-sm md:text-base opacity-90 mb-1">{banner.location}</p>
              )}
              {banner.description && (
                <p className="text-xs md:text-sm opacity-75 line-clamp-2">{banner.description}</p>
              )}
            </div>
            
            {isOngoing && (
              <div className="absolute top-6 left-6 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-10 animate-pulse">
                Ongoing Now
              </div>
            )}
            {!isOngoing && isUpcoming && (
              <div className="absolute top-6 left-6 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-10">
                Upcoming Event
              </div>
            )}
          </div>
        </Link>
        
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-10 right-10 p-2 bg-black/60 text-white rounded-full z-20 backdrop-blur-sm"
          aria-label="Close banner"
        >
          <X size={20} />
        </button>
      </div>

      {/* View All Events Link */}
      <div className="mt-3 text-center">
        <Link 
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          View All Events →
        </Link>
      </div>
    </div>
  );
}
