"use client";

import { useState, useEffect, useCallback, useMemo, useTransition, memo } from "react";
import dynamic from "next/dynamic";
import { getEventGalleries } from "@/actions/eventGalleries";
import { GalleryGridSkeleton } from "@/components/gallery/GalleryGridSkeleton";
import { EventCard } from "@/components/gallery/EventCard";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Images, Search } from "lucide-react";

const GalleryGrid = dynamic(() => import("@/components/gallery/GalleryGrid").then(mod => ({ default: mod.GalleryGrid })), {
  loading: () => <GalleryGridSkeleton />,
  ssr: false,
});

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
  category?: string;
};

type EventGallery = {
  id: string;
  eventId: string;
  imageUrl: string;
  caption?: string;
  isActive: boolean;
};

export default function GalleryClient({ initialEvents }: { initialEvents: EventBanner[] }) {
  const [events] = useState<EventBanner[]>(initialEvents);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [images, setImages] = useState<EventGallery[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadGallery() {
      if (!selectedEventId) return;

      setLoading(true);
      const result = await getEventGalleries(selectedEventId, false);
      if (result.success && result.data) {
        setImages(result.data);
      }
      setLoading(false);
    }
    loadGallery();
  }, [selectedEventId]);

  const handleEventClick = useCallback((eventId: string) => {
    startTransition(() => {
      setSelectedEventId(eventId);
      setTimeout(() => {
        document.getElementById("gallery-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });
  }, []);

  const handleBackToEvents = useCallback(() => {
    setSelectedEventId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filteredEvents = useMemo(() => events.filter((event) => {
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      (event.location && event.location.toLowerCase().includes(query)) ||
      (event.category && event.category.toLowerCase().includes(query)) ||
      (event.description && event.description.toLowerCase().includes(query))
    );
  }), [events, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-140px)]">
      {!selectedEventId ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Event Gallery</h1>
            <p className="text-muted-foreground">
              Browse photos from our events - completed, ongoing, and upcoming. Click on any event to view its gallery.
            </p>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search events by name, venue, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-2">
                Found {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                imageCount={0}
                onClick={() => handleEventClick(event.id)}
              />
            ))}
          </div>

          {filteredEvents.length === 0 && events.length > 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">No events found matching &quot;{searchQuery}&quot;</p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
          )}

          {events.length === 0 && (
            <div className="text-center py-12">
              <Images className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No events with galleries yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon for event photos!</p>
            </div>
          )}
        </>
      ) : (
        <div id="gallery-section">
          <button
            onClick={handleBackToEvents}
            className="mb-6 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            ← Back to Events
          </button>

          {(() => {
            const selectedEvent = events.find((e) => e.id === selectedEventId);
            return selectedEvent ? (
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{selectedEvent.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedEvent.eventDate ? new Date(selectedEvent.eventDate).toLocaleDateString() : 'Date TBA'}</span>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Images className="w-4 h-4" />
                    <span>{images.length} {images.length === 1 ? "photo" : "photos"}</span>
                  </div>
                </div>
              </div>
            ) : null;
          })()}

          {loading ? (
            <GalleryGridSkeleton />
          ) : (
            <GalleryGrid images={images} />
          )}
        </div>
      )}
    </div>
  );
}
