"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllEventsWithGalleryCounts, toggleEventGalleryVisibility } from "@/actions/events";
import { getEventGalleries } from "@/actions/eventGalleries";
import { GalleryManager } from "@/components/gallery/GalleryManager";
import { EventCard } from "@/components/gallery/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Calendar, MapPin, Images, Settings, Search } from "lucide-react";
import type { Event } from "@/lib/db/schema/events";
import type { EventGallery } from "@/lib/db/schema/eventGalleries";

export default function GalleryDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [images, setImages] = useState<EventGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryCount, setGalleryCount] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadEvents() {
      const result = await getAllEventsWithGalleryCounts(true);
      if (result.success && result.data) {
        setEvents(result.data);
        
        // Extract counts from the data
        const counts: Record<string, number> = {};
        result.data.forEach((event: any) => {
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
      const result = await getEventGalleries(selectedEventId, true);
      if (result.success && result.data) {
        setImages(result.data);
      }
      setLoading(false);
    }
    loadGallery();
  }, [selectedEventId]);

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const handleBackToEvents = () => {
    setSelectedEventId(null);
    // Reload events to update counts
    router.refresh();
  };

  const handleCreateEvent = () => {
    router.push("/dashboard/events/create");
  };

  const handleRefreshGallery = async () => {
    if (!selectedEventId) return;
    
    // Reload gallery images
    const result = await getEventGalleries(selectedEventId, true);
    if (result.success && result.data) {
      setImages(result.data);
      
      // Immediately update the count for this event
      setGalleryCount(prev => ({
        ...prev,
        [selectedEventId]: result.data.length
      }));
    }
    
    // Reload events with counts
    const eventsResult = await getAllEventsWithGalleryCounts(true);
    if (eventsResult.success && eventsResult.data) {
      setEvents(eventsResult.data);
      
      // Update gallery counts from the query result
      const counts: Record<string, number> = {};
      eventsResult.data.forEach((event: any) => {
        counts[event.id] = event.galleryCount || 0;
      });
      setGalleryCount(counts);
    }
  };

  if (loading && events.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!selectedEventId ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manage Event Gallery</h1>
              <p className="text-muted-foreground">
                Select an event to manage its gallery or create a new event.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/gallery/settings")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button onClick={handleCreateEvent}>
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </div>
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
                Found {events.filter((event) => {
                  const query = searchQuery.toLowerCase();
                  return (
                    event.title.toLowerCase().includes(query) ||
                    event.venue.toLowerCase().includes(query) ||
                    event.type.toLowerCase().includes(query) ||
                    event.description.toLowerCase().includes(query)
                  );
                }).length} {events.filter((event) => {
                  const query = searchQuery.toLowerCase();
                  return (
                    event.title.toLowerCase().includes(query) ||
                    event.venue.toLowerCase().includes(query) ||
                    event.type.toLowerCase().includes(query) ||
                    event.description.toLowerCase().includes(query)
                  );
                }).length === 1 ? "event" : "events"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events
              .filter((event) => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  event.title.toLowerCase().includes(query) ||
                  event.venue.toLowerCase().includes(query) ||
                  event.type.toLowerCase().includes(query) ||
                  event.description.toLowerCase().includes(query)
                );
              })
              .map((event) => {
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

          {events.filter((event) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
              event.title.toLowerCase().includes(query) ||
              event.venue.toLowerCase().includes(query) ||
              event.type.toLowerCase().includes(query) ||
              event.description.toLowerCase().includes(query)
            );
          }).length === 0 && events.length > 0 && (
            <div className="text-center py-12 border rounded-lg">
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
            <div className="text-center py-12 border rounded-lg">
              <Images className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                No events available. Create an event to start adding gallery images.
              </p>
              <Button onClick={handleCreateEvent}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Event
              </Button>
            </div>
          )}
        </>
      ) : (
        <div>
          <button
            onClick={handleBackToEvents}
            className="mb-6 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            ← Back to Events
          </button>

          {(() => {
            const selectedEvent = events.find((e) => e.id === selectedEventId);
            
            const handleToggleVisibility = async (show: boolean) => {
              if (!selectedEvent) return;
              
              // Optimistically update local state
              setEvents(events.map(e => 
                e.id === selectedEvent.id 
                  ? { ...e, showInGallery: show }
                  : e
              ));
              
              const result = await toggleEventGalleryVisibility(selectedEvent.id, show);
              if (result.success) {
                router.refresh();
              } else {
                // Revert on error
                setEvents(events.map(e => 
                  e.id === selectedEvent.id 
                    ? { ...e, showInGallery: !show }
                    : e
                ));
                alert("Failed to update visibility");
              }
            };

            return selectedEvent ? (
              <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{selectedEvent.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(selectedEvent.startingDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedEvent.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Images className="w-4 h-4" />
                        <span>
                          {images.length} {images.length === 1 ? "photo" : "photos"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border rounded-lg p-3">
                    <Label htmlFor="gallery-visibility" className="text-sm">
                      Show in Gallery
                    </Label>
                    <Switch
                      checked={selectedEvent.showInGallery ?? true}
                      onCheckedChange={handleToggleVisibility}
                    />
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
            <GalleryManager 
              eventId={selectedEventId} 
              images={images} 
              onRefresh={handleRefreshGallery}
            />
          )}
        </div>
      )}
    </div>
  );
}
