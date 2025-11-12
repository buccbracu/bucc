"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ExternalLink, Tag, Sparkles, Users } from "lucide-react";
import EventModal from "./EventModal";
import BannerModal from "./BannerModal";
import type { EventBanner } from "@/lib/db/schema/eventBanners";
import type { Event as PostgresEvent } from "@/lib/db/schema/events";

// Union type for both event types
type Event = EventBanner | PostgresEvent;

interface EventsTimelineProps {
  events: Event[];
}

// Type guard to check if event is EventBanner
function isEventBanner(event: Event): event is EventBanner {
  return 'targetUrl' in event && 'imageUrl' in event;
}

// Type guard to check if event is PostgresEvent
function isPostgresEvent(event: Event): event is PostgresEvent {
  return 'venue' in event && !('targetUrl' in event);
}

export default function EventsTimeline({ events }: EventsTimelineProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "ongoing" | "completed">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeEventIndex, setActiveEventIndex] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<PostgresEvent | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<EventBanner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  const now = new Date();
  
  const getEventStatusType = (event: Event) => {
    let eventDate: Date;
    let eventEndDate: Date | null = null;

    if (isEventBanner(event)) {
      eventDate = event.eventDate ? new Date(event.eventDate) : new Date(event.createdAt);
      eventEndDate = event.eventEndDate ? new Date(event.eventEndDate) : null;
    } else {
      eventDate = new Date(event.startingDate);
      eventEndDate = new Date(event.endingDate);
    }
    
    if (eventEndDate && now >= eventDate && now <= eventEndDate) {
      return "ongoing";
    }
    if (eventDate >= now) {
      return "upcoming";
    }
    return "completed";
  };
  
  const sortedEvents = [...events].sort((a, b) => {
    const statusA = getEventStatusType(a);
    const statusB = getEventStatusType(b);
    
    let dateA: number;
    let dateB: number;

    if (isEventBanner(a)) {
      dateA = a.eventDate ? new Date(a.eventDate).getTime() : new Date(a.createdAt).getTime();
    } else {
      dateA = new Date(a.startingDate).getTime();
    }

    if (isEventBanner(b)) {
      dateB = b.eventDate ? new Date(b.eventDate).getTime() : new Date(b.createdAt).getTime();
    } else {
      dateB = new Date(b.startingDate).getTime();
    }
    
    // Priority: ongoing > upcoming > completed
    const statusPriority = { ongoing: 0, upcoming: 1, completed: 2 };
    
    if (statusA !== statusB) {
      return statusPriority[statusA] - statusPriority[statusB];
    }
    
    // Within same status:
    // - Ongoing: sort by end date (ending soonest first)
    // - Upcoming: sort by start date (soonest first)
    // - Completed: sort by date (most recent first)
    if (statusA === "ongoing") {
      let endA: number;
      let endB: number;

      if (isEventBanner(a)) {
        endA = a.eventEndDate ? new Date(a.eventEndDate).getTime() : dateA;
      } else {
        endA = new Date(a.endingDate).getTime();
      }

      if (isEventBanner(b)) {
        endB = b.eventEndDate ? new Date(b.eventEndDate).getTime() : dateB;
      } else {
        endB = new Date(b.endingDate).getTime();
      }

      return endA - endB;
    } else if (statusA === "upcoming") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  const filteredEvents = sortedEvents.filter((event) => {
    // Filter by status
    if (filter !== "all") {
      const status = getEventStatusType(event);
      if (filter !== status) return false;
    }
    
    // Filter by category
    if (selectedCategory) {
      const category = isEventBanner(event) ? event.category : event.type;
      if (category !== selectedCategory) return false;
    }
    
    return true;
  });

  // Get unique categories
  const categories = Array.from(
    new Set(
      events.map((e) => (isEventBanner(e) ? e.category : e.type)).filter(Boolean)
    )
  );

  // Track scroll position and update active event
  useEffect(() => {
    const handleScroll = () => {
      const viewportMiddle = window.innerHeight / 2 + window.scrollY;
      
      let closestIndex = 0;
      let closestDistance = Infinity;

      eventRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const elementMiddle = rect.top + window.scrollY + rect.height / 2;
          const distance = Math.abs(viewportMiddle - elementMiddle);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      setActiveEventIndex(closestIndex);
    };

    handleScroll(); // Initial call
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [filteredEvents.length]);

  const formatDate = (date: Date | null) => {
    if (!date) return "TBA";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getEventStatus = (event: Event) => {
    let eventDate: Date;
    let eventEndDate: Date | null = null;

    if (isEventBanner(event)) {
      eventDate = event.eventDate ? new Date(event.eventDate) : new Date(event.createdAt);
      eventEndDate = event.eventEndDate ? new Date(event.eventEndDate) : null;
    } else {
      eventDate = new Date(event.startingDate);
      eventEndDate = new Date(event.endingDate);
    }
    
    if (eventEndDate && now >= eventDate && now <= eventEndDate) {
      return { label: "Ongoing", color: "bg-blue-500" };
    }
    if (eventDate >= now) {
      return { label: "Upcoming", color: "bg-green-500" };
    }
    return { label: "Completed", color: "bg-gray-500" };
  };

  return (
    <div className="w-full px-4 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Events Timeline
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our journey through workshops, competitions, and community events
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

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                selectedCategory === null
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 text-sm rounded-full transition-all ${
                  selectedCategory === category
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line - Desktop */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-border hidden md:block" />
          
          {/* Vertical Line - Mobile */}
          <div className="absolute left-4 top-0 w-0.5 h-full bg-border md:hidden" />

          {/* Events */}
          <div className="space-y-12">
            {filteredEvents.map((event, index) => {
              const isLeft = index % 2 === 0;
              const status = getEventStatusType(event);
              const isActive = index === activeEventIndex;

              return (
                <div
                  key={event.id}
                  ref={(el) => { eventRefs.current[index] = el; }}
                  className={`relative flex items-center ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  } flex-col gap-8 transition-all duration-300`}
                >
                  {/* Active Line Segment - Desktop */}
                  {isActive && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-primary to-primary hidden md:block z-[5] animate-pulse" />
                  )}
                  
                  {/* Active Line Segment - Mobile */}
                  {isActive && (
                    <div className="absolute left-4 top-0 w-0.5 h-full bg-gradient-to-b from-primary via-primary to-primary md:hidden z-[5] animate-pulse" />
                  )}

                  {/* Timeline Dot - Desktop */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 rounded-full border-4 border-background z-10 hidden md:block shadow-lg transition-all duration-300 ${
                    isActive 
                      ? "w-8 h-8 bg-primary ring-4 ring-primary/30" 
                      : "w-6 h-6 bg-primary/60"
                  }`} />
                  
                  {/* Timeline Dot - Mobile */}
                  <div className={`absolute left-4 transform -translate-x-1/2 rounded-full border-2 border-background z-10 md:hidden shadow-lg transition-all duration-300 ${
                    isActive 
                      ? "w-5 h-5 bg-primary ring-2 ring-primary/30" 
                      : "w-4 h-4 bg-primary/60"
                  }`} />

                  {/* Content */}
                  <div className={`w-full md:w-[calc(50%-3rem)] pl-12 md:pl-0 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                    {isEventBanner(event) ? (
                      <div
                        className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                        onClick={() => {
                          setSelectedBanner(event);
                          setIsBannerModalOpen(true);
                        }}
                      >
                        {/* Banner Image */}
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {status === "ongoing" && (
                            <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                              Ongoing Now
                            </div>
                          )}
                          {status === "upcoming" && (
                            <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                              Upcoming
                            </div>
                          )}
                        </div>
                        {/* Event Details */}
                        <div className="p-6">
                          {/* Status and Tags Row */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {/* Status Badge */}
                            <span className={`${getEventStatus(event).color} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                              {getEventStatus(event).label}
                            </span>
                            
                            {/* Exclusive Badge */}
                            {event.isExclusive && (
                              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Exclusive
                              </span>
                            )}
                            
                            {/* Category Badge */}
                            {event.category && (
                              <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full font-semibold">
                                {event.category}
                              </span>
                            )}
                          </div>

                          <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>

                          {event.description && (
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {event.description}
                            </p>
                          )}

                          {/* Tags */}
                          {event.tags && event.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {event.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                                >
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(event.eventDate)}</span>
                              {event.eventEndDate && (
                                <span>- {formatDate(event.eventEndDate)}</span>
                              )}
                            </div>

                            {event.location && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>

                          <Link
                            href={event.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                          >
                            Learn More
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsModalOpen(true);
                        }}
                      >
                        <div className="relative h-64 overflow-hidden">
                          {event.featuredImage ? (
                            <Image
                              src={event.featuredImage}
                              alt={event.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                              <Calendar className="w-20 h-20 text-primary/40" />
                            </div>
                          )}
                          {status === "ongoing" && (
                            <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                              Ongoing Now
                            </div>
                          )}
                          {status === "upcoming" && (
                            <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                              Upcoming
                            </div>
                          )}
                        </div>

                        {/* Event Details */}
                        <div className="p-6">
                        {/* Status and Tags Row */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {/* Status Badge */}
                          <span className={`${getEventStatus(event).color} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                            {getEventStatus(event).label}
                          </span>
                          
                          {/* Exclusive Badge */}
                          {isEventBanner(event) && event.isExclusive && (
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Exclusive
                            </span>
                          )}
                          
                          {/* Category Badge */}
                          {isEventBanner(event) && event.category && (
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full font-semibold">
                              {event.category}
                            </span>
                          )}
                          
                          {/* Type Badge for Postgres Events */}
                          {isPostgresEvent(event) && (
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full font-semibold">
                              {event.type}
                            </span>
                          )}
                        </div>

                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>

                        {event.description && (
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        {/* Tags */}
                        {isEventBanner(event) && event.tags && event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {event.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                              >
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-col gap-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {isEventBanner(event) ? (
                              <>
                                <span>{formatDate(event.eventDate)}</span>
                                {event.eventEndDate && (
                                  <span>- {formatDate(event.eventEndDate)}</span>
                                )}
                              </>
                            ) : (
                              <span>
                                {formatDate(new Date(event.startingDate))} - {formatDate(new Date(event.endingDate))}
                              </span>
                            )}
                          </div>

                          {isEventBanner(event) && event.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          )}

                          {isPostgresEvent(event) && (
                            <>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{event.venue}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>{event.allowedMembers}</span>
                              </div>
                            </>
                          )}
                        </div>

                        {isEventBanner(event) && (
                          <Link
                            href={event.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                          >
                            Learn More
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Spacer for alignment */}
                  <div className="hidden md:block w-[calc(50%-3rem)]" />
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

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {/* Banner Modal */}
      {selectedBanner && (
        <BannerModal
          banner={selectedBanner}
          isOpen={isBannerModalOpen}
          onClose={() => {
            setIsBannerModalOpen(false);
            setSelectedBanner(null);
          }}
        />
      )}
    </div>
  );
}
