"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, Users, Tag } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  venue: string;
  description: string;
  featuredImage?: string;
  type: string;
  startingDate: string;
  endingDate: string;
  allowedMembers: string;
}

interface EventsListProps {
  events: Event[];
}

export default function EventsList({ events }: EventsListProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "ongoing" | "completed">("all");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const now = new Date();

  const getEventStatus = (event: Event) => {
    const startDate = new Date(event.startingDate);
    const endDate = new Date(event.endingDate);

    if (now >= startDate && now <= endDate) {
      return { type: "ongoing", label: "Ongoing", color: "bg-blue-500" };
    }
    if (startDate > now) {
      return { type: "upcoming", label: "Upcoming", color: "bg-green-500" };
    }
    return { type: "completed", label: "Completed", color: "bg-gray-500" };
  };

  const sortedEvents = [...events].sort((a, b) => {
    const statusA = getEventStatus(a);
    const statusB = getEventStatus(b);
    const dateA = new Date(a.startingDate).getTime();
    const dateB = new Date(b.startingDate).getTime();

    const statusPriority = { ongoing: 0, upcoming: 1, completed: 2 };

    if (statusA.type !== statusB.type) {
      return statusPriority[statusA.type as keyof typeof statusPriority] - statusPriority[statusB.type as keyof typeof statusPriority];
    }

    if (statusA.type === "completed") {
      return dateB - dateA;
    }
    return dateA - dateB;
  });

  const filteredEvents = sortedEvents.filter((event) => {
    if (filter !== "all") {
      const status = getEventStatus(event);
      if (filter !== status.type) return false;
    }

    if (selectedType && event.type !== selectedType) return false;

    return true;
  });

  const eventTypes = Array.from(new Set(events.map((e) => e.type)));

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full px-4 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            BUCC Events
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our workshops, competitions, and community events
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-full transition-all ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter("ongoing")}
            className={`px-6 py-2 rounded-full transition-all ${
              filter === "ongoing"
                ? "bg-blue-500 text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-6 py-2 rounded-full transition-all ${
              filter === "upcoming"
                ? "bg-green-500 text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-6 py-2 rounded-full transition-all ${
              filter === "completed"
                ? "bg-gray-500 text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Type Filter */}
        {eventTypes.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                selectedType === null
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Types
            </button>
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                  selectedType === type
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const status = getEventStatus(event);

            return (
              <div
                key={event._id}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  {event.featuredImage ? (
                    <Image
                      src={event.featuredImage}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <Calendar className="w-16 h-16 text-primary/40" />
                    </div>
                  )}
                  {status.type === "ongoing" && (
                    <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                      Ongoing
                    </div>
                  )}
                  {status.type === "upcoming" && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Upcoming
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="p-5">
                  {/* Status and Type */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`${status.color} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                      {status.label}
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full font-semibold">
                      {event.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {formatDate(event.startingDate)} - {formatDate(event.endingDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{event.allowedMembers}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No events found for this filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
