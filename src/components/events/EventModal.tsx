"use client";

import { X, Calendar, MapPin, Users, Tag, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
type Event = {
  id: string;
  title: string;
  venue: string;
  description: string;
  featuredImage?: string;
  eventUrl?: string;
  type: string;
  needAttendance?: boolean;
  startingDate: Date;
  endingDate: Date;
  allowedMembers: string;
  allowedDepartments?: string[];
  allowedDesignations?: string[];
  notes?: string;
};

interface EventModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!isOpen) return null;

  const now = new Date();
  const startDate = new Date(event.startingDate);
  const endDate = new Date(event.endingDate);

  const isOngoing = now >= startDate && now <= endDate;
  const isUpcoming = startDate > now;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Event Image */}
        {event.featuredImage ? (
          <div className="relative w-full h-64 md:h-80">
            <Image
              src={event.featuredImage}
              alt={event.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Status Badge */}
            {isOngoing && (
              <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                Ongoing Now
              </div>
            )}
            {!isOngoing && isUpcoming && (
              <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Upcoming Event
              </div>
            )}
            {!isOngoing && !isUpcoming && (
              <div className="absolute top-4 left-4 bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Completed
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-64 md:h-80 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Calendar className="w-20 h-20 text-primary/40" />
          </div>
        )}

        {/* Event Details */}
        <div className="p-6 md:p-8">
          {/* Title and Type */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full font-semibold">
                {event.type}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h2>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
            {event.description}
          </p>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Date & Time */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Date & Time</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Start:</strong> {formatDate(startDate)}
                  <br />
                  {formatTime(startDate)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>End:</strong> {formatDate(endDate)}
                  <br />
                  {formatTime(endDate)}
                </p>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Venue</h3>
                <p className="text-sm text-muted-foreground">{event.venue}</p>
              </div>
            </div>

            {/* Allowed Members */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Who Can Attend</h3>
                <p className="text-sm text-muted-foreground">{event.allowedMembers}</p>
              </div>
            </div>

            {/* Attendance */}
            {event.needAttendance && (
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Tag className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Attendance</h3>
                  <p className="text-sm text-muted-foreground">
                    Attendance tracking required
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Learn More Button */}
          {event.eventUrl && (
            <div className="mb-6">
              <Link
                href={event.eventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Learn More
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* Additional Notes */}
          {event.notes && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                Additional Notes
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">{event.notes}</p>
            </div>
          )}

          {/* Departments & Designations */}
          {((event.allowedDepartments?.length ?? 0) > 0 || (event.allowedDesignations?.length ?? 0) > 0) && (
            <div className="mt-6 space-y-3">
              {(event.allowedDepartments?.length ?? 0) > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm">Allowed Departments:</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.allowedDepartments?.map((dept, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-muted px-3 py-1 rounded-full"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(event.allowedDesignations?.length ?? 0) > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm">Allowed Designations:</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.allowedDesignations?.map((desig, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-muted px-3 py-1 rounded-full"
                      >
                        {desig}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
