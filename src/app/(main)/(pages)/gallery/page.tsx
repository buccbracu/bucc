import { Suspense } from "react";
import GalleryClient from "@/components/gallery/GalleryClient";
import { EventCardSkeleton } from "@/components/gallery/EventCardSkeleton";
import { getAllEvents } from "@/actions/events";

export const metadata = {
  title: "Gallery | BRAC University Computer Club",
  description: "Browse photos from BUCC events - completed, ongoing, and upcoming.",
};

// Static generation with revalidation
export const revalidate = 60;
export const dynamic = 'force-static';

function GalleryLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-140px)]">
      <div className="mb-8">
        <div className="h-9 bg-muted rounded w-48 mb-2 animate-pulse" />
        <div className="h-5 bg-muted rounded w-96 animate-pulse" />
      </div>
      <div className="mb-6">
        <div className="h-10 bg-muted rounded w-full max-w-md animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

async function GalleryContent() {
  const result = await getAllEvents();
  
  const events = result.success && result.data
    ? result.data
        .filter((event: any) => event.showInGallery)
        .map((event: any) => ({
          id: event._id,
          title: event.title,
          imageUrl: event.featuredImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
          targetUrl: `/events/${event._id}`,
          isActive: true,
          eventDate: event.startingDate,
          eventEndDate: event.endingDate,
          description: event.description,
          location: event.venue,
          category: event.type,
        }))
    : [];

  return <GalleryClient initialEvents={events} />;
}

export default function Gallery() {
  return (
    <Suspense fallback={<GalleryLoadingSkeleton />}>
      <GalleryContent />
    </Suspense>
  );
}
