"use client";

import Image from "next/image";
import { Calendar, MapPin, Images } from "lucide-react";
type Event = {
  id: string;
  title: string;
  venue: string;
  description: string;
  featuredImage?: string;
  startingDate: Date;
  endingDate: Date;
  type: string;
};

type EventBanner = {
  id: string;
  title: string;
  imageUrl: string;
  eventDate: Date | null;
  location?: string;
};

interface EventCardProps {
  event: Event | EventBanner;
  imageCount: number;
  onClick: () => void;
}

// Type guard to check if event is EventBanner
function isEventBanner(event: Event | EventBanner): event is EventBanner {
  return 'imageUrl' in event;
}

export function EventCard({ event, imageCount, onClick }: EventCardProps) {
  const imageUrl = isEventBanner(event) ? event.imageUrl : event.featuredImage;
  const eventDate = isEventBanner(event) 
    ? (event.eventDate ? new Date(event.eventDate) : null)
    : new Date(event.startingDate);
  const location = isEventBanner(event) ? event.location : event.venue;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Images className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Images className="w-4 h-4" />
          {imageCount} {imageCount === 1 ? "photo" : "photos"}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          {eventDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{eventDate.toLocaleDateString()}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
