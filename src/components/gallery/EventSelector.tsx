"use client";

import { useState } from "react";
import type { Event } from "@/lib/db/schema/events";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface EventSelectorProps {
  events: Event[];
  selectedEventId: string | null;
  onSelectEvent: (eventId: string) => void;
}

export function EventSelector({ events, selectedEventId, onSelectEvent }: EventSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="relative mb-8">
      <Button
        variant="outline"
        className="w-full sm:w-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar className="w-4 h-4 mr-2" />
        {selectedEvent ? selectedEvent.title : "Select an Event"}
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full sm:w-96 bg-background border rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
          {events.map((event) => (
            <button
              key={event.id}
              className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors ${
                selectedEventId === event.id ? "bg-accent" : ""
              }`}
              onClick={() => {
                onSelectEvent(event.id);
                setIsOpen(false);
              }}
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(event.startingDate).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
