"use client";

import { useEffect, useState } from "react";
import EventsTimeline from "./EventsTimeline";

export default function EventsTimelineWrapper() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        console.log("Fetching events from /api/events...");
        const res = await fetch("/api/events", {
          cache: "no-store",
        });
        console.log("Response status:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched events:", data.length, "events");
          console.log("First event:", data[0]);
          setEvents(data);
        } else {
          setError(`Failed to fetch: ${res.status}`);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">No events found</p>
        </div>
      </div>
    );
  }

  console.log("Rendering EventsTimeline with", events.length, "events");
  return <EventsTimeline events={events} />;
}
