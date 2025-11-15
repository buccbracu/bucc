import GalleryClient from "@/components/gallery/GalleryClient";
import { getAllEvents } from "@/actions/events";

export const metadata = {
  title: "Gallery | BRAC University Computer Club",
  description: "Browse photos from BUCC events - completed, ongoing, and upcoming.",
};

// Static generation with revalidation
export const revalidate = 60;
export const dynamic = 'force-static';

export default async function Gallery() {
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
