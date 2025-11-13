"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllEventsWithGalleryCounts } from "@/actions/events";
import { getEventGalleries } from "@/actions/eventGalleries";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { EventCard } from "@/components/gallery/EventCard";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Images, Search } from "lucide-react";
import type { Event } from "@/lib/db/schema/events";
import type { EventGallery } from "@/lib/db/schema/eventGalleries";

export default function Gallery() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [images, setImages] = useState<EventGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryCount, setGalleryCount] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadEvents() {
      const result = await getAllEventsWithGalleryCounts(false);
      if (result.success && result.data) {
        // Filter events that should show in gallery
        const visibleEvents = result.data.filter(
          (event: any) => event.showInGallery !== false
        );
        setEvents(visibleEvents);

        // Extract counts from the data
        const counts: Record<string, number> = {};
        visibleEvents.forEach((event: any) => {
          counts[event.id] = event.galleryCount || 0;
        });
        setGalleryCount(counts);
      }
      setLoading(false);
    }
    loadEvents();
  }, []);

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

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    // Scroll to gallery section
    document.getElementById("gallery-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBackToEvents = () => {
    setSelectedEventId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && events.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-140px)]">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  // Filter events based on search query
  const filteredEvents = events.filter((event) => {
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query) ||
      event.type.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-140px)]">
      {!selectedEventId ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Event Gallery</h1>
            <p className="text-muted-foreground">
              Browse photos from our events. Click on any event to view its gallery.
            </p>
          </div>

          {/* Search Bar */}
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
            {filteredEvents.map((event) => {
              const imageCount = galleryCount[event.id] || 0;

              return (
                <EventCard
                  key={event.id}
                  event={event}
                  imageCount={imageCount}
                  onClick={() => handleEventClick(event.id)}
                />
              );
            })}
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
              <p className="text-muted-foreground">No events available yet.</p>
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
                    <span>{new Date(selectedEvent.startingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedEvent.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Images className="w-4 h-4" />
                    <span>{images.length} {images.length === 1 ? "photo" : "photos"}</span>
                  </div>
                </div>
              </div>
            ) : null;
          })()}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading gallery...</p>
            </div>
          ) : (
            <GalleryGrid images={images} />
          )}
        </div>
      )}
    </div>
  );
}
