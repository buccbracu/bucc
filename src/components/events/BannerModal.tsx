"use client";

import { X, Calendar, MapPin, Tag, ExternalLink, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { EventBanner } from "@/lib/db/schema/eventBanners";

interface BannerModalProps {
  banner: EventBanner;
  isOpen: boolean;
  onClose: () => void;
}

export default function BannerModal({ banner, isOpen, onClose }: BannerModalProps) {
  if (!isOpen) return null;

  const now = new Date();
  const startDate = banner.eventDate ? new Date(banner.eventDate) : new Date(banner.createdAt);
  const endDate = banner.eventEndDate ? new Date(banner.eventEndDate) : null;

  const isOngoing = endDate && now >= startDate && now <= endDate;
  const isUpcoming = startDate > now;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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

        {/* Banner Image */}
        <div className="relative w-full h-64 md:h-80">
          <Image
            src={banner.imageUrl}
            alt={banner.title}
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

        {/* Event Details */}
        <div className="p-6 md:p-8">
          {/* Title and Badges */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {banner.category && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full font-semibold">
                  {banner.category}
                </span>
              )}
              {banner.isExclusive && (
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Exclusive
                </span>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{banner.title}</h2>
          </div>

          {/* Description */}
          {banner.description && (
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              {banner.description}
            </p>
          )}

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Date */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Date</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(startDate)}
                  {endDate && (
                    <>
                      <br />
                      <span className="text-xs">to</span>
                      <br />
                      {formatDate(endDate)}
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Location */}
            {banner.location && (
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-sm text-muted-foreground">{banner.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {banner.tags && banner.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-sm">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {banner.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Learn More Button */}
          <div className="mb-6">
            <Link
              href={banner.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Learn More
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
