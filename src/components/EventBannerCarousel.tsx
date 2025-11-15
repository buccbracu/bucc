"use client";

import { useState, useEffect, memo } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { getTodayEvents } from "@/actions/events";
type EventBanner = {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  isActive: boolean;
  eventDate: Date | null;
  eventEndDate: Date | null;
  description?: string;
  location?: string;
  createdAt: Date;
};
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const EventBannerCarousel = memo(function EventBannerCarousel() {
  const pathname = usePathname();
  const [banners, setBanners] = useState<EventBanner[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [is404, setIs404] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function fetchBanners() {
      const result = await getTodayEvents();
      if (result.success && result.data) {
        setBanners(result.data);
      }
      setIsLoading(false);
    }
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    // Check if we're on a 404 page
    const check404 = () => {
      const notFoundContainer = document.querySelector('.not-found-container');
      const animated404Container = document.querySelector('.animated-404-container');
      setIs404(!!(notFoundContainer || animated404Container));
    };
    
    check404();
    const timer = setTimeout(check404, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  // Don't show banner on events page or 404 page
  if (pathname === "/events" || is404 || isLoading || banners.length === 0 || !isVisible) {
    return null;
  }

  const now = new Date();

  const getEventStatus = (banner: EventBanner) => {
    const startDate = banner.eventDate ? new Date(banner.eventDate) : new Date(banner.createdAt);
    const endDate = banner.eventEndDate ? new Date(banner.eventEndDate) : null;

    const isOngoing = endDate && now >= startDate && now <= endDate;
    const isUpcoming = startDate > now;

    return { isOngoing, isUpcoming };
  };

  return (
    <div className="relative w-full px-4 py-4">
      {/* Close button - Top Right */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-6 right-6 p-2 bg-black/60 text-white rounded-full z-30 backdrop-blur-sm hover:bg-black/80 transition-colors"
        aria-label="Close banner"
      >
        <X size={20} />
      </button>

      {/* Slide counter - Below close button */}
      {banners.length > 1 && (
        <div className="absolute top-16 right-6 px-3 py-1 bg-black/60 text-white text-sm rounded-full z-30 backdrop-blur-sm font-medium">
          {current}/{banners.length}
        </div>
      )}

      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {banners.map((banner, index) => {
              const { isOngoing, isUpcoming } = getEventStatus(banner);
              
              return (
                <CarouselItem key={banner.id}>
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
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        quality={85}
                        sizes="100vw"
                      />
                      {/* Gradient overlay */}
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
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          {banners.length > 1 && (
            <>
              <CarouselPrevious className="left-2 md:left-4" />
              <CarouselNext className="right-2 md:right-4" />
            </>
          )}
        </Carousel>
      </div>

      {/* Event counter and View All Events Link - Bottom */}
      <div className="mt-3 text-center">
        {banners.length > 1 && (
          <p className="text-sm text-muted-foreground mb-2">
            {banners.length} events happening today
          </p>
        )}
        <Link 
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          View All Events →
        </Link>
      </div>
    </div>
  );
});

export default EventBannerCarousel;
