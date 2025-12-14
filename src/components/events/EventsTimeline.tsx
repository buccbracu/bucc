"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ExternalLink, Tag, Sparkles, Users, Clock, ArrowRight } from "lucide-react";
import EventModal from "./EventModal";
import BannerModal from "./BannerModal";

// MongoDB document types
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
  tags?: string[];
  category?: string;
  isExclusive?: boolean;
  createdAt: Date;
};

type MongoEvent = {
  id: string;
  title: string;
  venue: string;
  description: string;
  featuredImage?: string;
  type: string;
  startingDate: Date;
  endingDate: Date;
  allowedMembers: string;
  allowedDepartments?: string[];
  allowedDesignations?: string[];
  notes?: string;
};

// Union type for both event types
type Event = EventBanner | MongoEvent;

interface EventsTimelineProps {
  events: Event[];
}

// Type guard to check if event is EventBanner
function isEventBanner(event: Event): event is EventBanner {
  return "targetUrl" in event && "imageUrl" in event;
}

// Type guard to check if event is MongoEvent
function isMongoEvent(event: Event): event is MongoEvent {
  return "venue" in event && !("targetUrl" in event);
}

export default function EventsTimeline({ events }: EventsTimelineProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "ongoing" | "completed">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<MongoEvent | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<EventBanner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

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
    if (filter !== "all") {
      const status = getEventStatusType(event);
      if (filter !== status) return false;
    }

    if (selectedCategory) {
      const category = isEventBanner(event) ? event.category : event.type;
      if (category !== selectedCategory) return false;
    }

    return true;
  });

  // Get unique categories
  const categories = Array.from(
    new Set(
      events.map((e) => (isEventBanner(e) ? e.category : e.type)).filter((cat): cat is string => Boolean(cat))
    )
  );

  const formatDate = (date: Date | null) => {
    if (!date) return "TBA";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getMonthYear = (date: Date | null) => {
    if (!date) return { month: "TBA", year: "" };
    const d = new Date(date);
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }),
      year: d.getFullYear().toString(),
    };
  };

  return (
    <div className="w-full px-4 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="mb-4 bg-gradient-to-r from-[#1f4864] to-[#127cc1] bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl">
            Events Timeline
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our journey through workshops, competitions, and community events
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {(["all", "ongoing", "upcoming", "completed"] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                filter === filterOption
                  ? "bg-gradient-to-r from-[#1f4864] to-[#127cc1] text-white shadow-lg shadow-[#127cc1]/30"
                  : "bg-card text-foreground border border-border hover:border-[#127cc1] hover:shadow-md"
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)} {filterOption === "all" ? "Events" : ""}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-14">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === null
                  ? "bg-[#127cc1] text-white shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Categories
            </button>
            {categories.map((category, idx) => (
              <button
                key={`category-${category}-${idx}`}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-[#127cc1] text-white shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Modern Timeline */}
        <div className="relative space-y-8">
          {filteredEvents.map((event, index) => {
            const status = getEventStatusType(event);
            const dateInfo = isEventBanner(event)
              ? getMonthYear(event.eventDate)
              : getMonthYear(new Date(event.startingDate));

            return (
              <div
                key={`event-${event.id}-${index}`}
                className="group relative"
              >
                {/* Connecting Line */}
                {index < filteredEvents.length - 1 && (
                  <div className="absolute left-[60px] top-[120px] w-0.5 h-[calc(100%+2rem)] bg-gradient-to-b from-[#127cc1]/60 via-[#127cc1]/30 to-transparent md:left-[80px]" />
                )}

                <div className="flex gap-6 md:gap-8">
                  {/* Date Badge */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-[120px] h-[120px] md:w-[160px] md:h-[120px] rounded-2xl bg-gradient-to-br from-[#1f4864] to-[#127cc1] p-[2px] shadow-lg group-hover:shadow-xl transition-shadow">
                      <div className="w-full h-full rounded-2xl bg-background flex flex-col items-center justify-center">
                        <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#1f4864] to-[#127cc1] bg-clip-text text-transparent">
                          {dateInfo.month}
                        </span>
                        <span className="text-sm md:text-base text-muted-foreground font-semibold">
                          {dateInfo.year}
                        </span>
                        {/* Status Indicator */}
                        <div className="mt-2">
                          {status === "ongoing" && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-500">
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                              Live
                            </span>
                          )}
                          {status === "upcoming" && (
                            <span className="text-xs font-bold text-green-500">Upcoming</span>
                          )}
                          {status === "completed" && (
                            <span className="text-xs font-semibold text-muted-foreground">Completed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Card */}
                  <div className="flex-1 min-w-0">
                    {isEventBanner(event) ? (
                      <div
                        onClick={() => {
                          setSelectedBanner(event);
                          setIsBannerModalOpen(true);
                        }}
                        className="bg-card border border-border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer group/card"
                      >
                        <div className="md:flex">
                          {/* Image Section */}
                          <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden">
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              fill
                              className="object-cover group-hover/card:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/20 to-transparent" />
                            
                            {/* Floating Badges */}
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                              {event.isExclusive && (
                                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  Exclusive
                                </span>
                              )}
                              {event.category && (
                                <span className="bg-[#127cc1] text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg backdrop-blur-sm">
                                  {event.category}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="md:w-3/5 p-6 md:p-8">
                            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground group-hover/card:bg-gradient-to-r group-hover/card:from-[#1f4864] group-hover/card:to-[#127cc1] group-hover/card:bg-clip-text group-hover/card:text-transparent transition-all duration-300">
                              {event.title}
                            </h3>

                            {event.description && (
                              <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                                {event.description}
                              </p>
                            )}

                            {/* Tags */}
                            {event.tags && event.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-6">
                                {event.tags.slice(0, 4).map((tag, idx) => (
                                  <span
                                    key={`banner-tag-${event.id}-${idx}`}
                                    className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full font-medium"
                                  >
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                  </span>
                                ))}
                                {event.tags.length > 4 && (
                                  <span className="text-xs text-muted-foreground px-3 py-1.5">
                                    +{event.tags.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Event Info */}
                            <div className="space-y-3 mb-6">
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="p-2 rounded-lg bg-[#127cc1]/10">
                                  <Calendar className="w-4 h-4 text-[#127cc1]" />
                                </div>
                                <span className="font-medium">
                                  {formatDate(event.eventDate)}
                                  {event.eventEndDate && ` - ${formatDate(event.eventEndDate)}`}
                                </span>
                              </div>

                              {event.location && (
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <div className="p-2 rounded-lg bg-[#127cc1]/10">
                                    <MapPin className="w-4 h-4 text-[#127cc1]" />
                                  </div>
                                  <span className="font-medium">{event.location}</span>
                                </div>
                              )}
                            </div>

                            {/* CTA */}
                            <Link
                              href={event.targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 text-[#127cc1] hover:text-[#1f4864] font-semibold transition-colors group/link"
                            >
                              Learn More
                              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsModalOpen(true);
                        }}
                        className="bg-card border border-border rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer group/card"
                      >
                        <div className="md:flex">
                          {/* Image Section */}
                          <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden">
                            {event.featuredImage ? (
                              <Image
                                src={event.featuredImage}
                                alt={event.title}
                                fill
                                className="object-cover group-hover/card:scale-105 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#127cc1]/10 via-[#1f4864]/5 to-[#127cc1]/10">
                                <Calendar className="w-20 h-20 text-[#127cc1]/30" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/20 to-transparent" />
                            
                            {/* Floating Badge */}
                            <div className="absolute top-4 left-4">
                              <span className="bg-[#127cc1] text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg backdrop-blur-sm">
                                {event.type}
                              </span>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="md:w-3/5 p-6 md:p-8">
                            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground group-hover/card:bg-gradient-to-r group-hover/card:from-[#1f4864] group-hover/card:to-[#127cc1] group-hover/card:bg-clip-text group-hover/card:text-transparent transition-all duration-300">
                              {event.title}
                            </h3>

                            {event.description && (
                              <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                                {event.description}
                              </p>
                            )}

                            {/* Event Info */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="p-2 rounded-lg bg-[#127cc1]/10">
                                  <Calendar className="w-4 h-4 text-[#127cc1]" />
                                </div>
                                <span className="font-medium">
                                  {formatDate(new Date(event.startingDate))} - {formatDate(new Date(event.endingDate))}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="p-2 rounded-lg bg-[#127cc1]/10">
                                  <MapPin className="w-4 h-4 text-[#127cc1]" />
                                </div>
                                <span className="font-medium">{event.venue}</span>
                              </div>

                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="p-2 rounded-lg bg-[#127cc1]/10">
                                  <Users className="w-4 h-4 text-[#127cc1]" />
                                </div>
                                <span className="font-medium">{event.allowedMembers}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <Calendar className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">No events found for this filter.</p>
          </div>
        )}
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
