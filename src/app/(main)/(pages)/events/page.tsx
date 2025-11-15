import EventsTimeline from "@/components/events/EventsTimeline";
import { getAllEvents } from "@/actions/events";

export const metadata = {
  title: "Events | BRAC University Computer Club",
  description: "Explore past and upcoming events organized by BUCC",
};

// Static generation with revalidation
export const revalidate = 60;
export const dynamic = 'force-static';

export default async function EventsPage() {
  const eventsResult = await getAllEvents();

  // Map Event data to match EventBanner format expected by EventsTimeline
  const events = eventsResult.success && eventsResult.data 
    ? eventsResult.data.map((event: any) => ({
        _id: event._id,
        title: event.title,
        imageUrl: event.featuredImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        targetUrl: `/events/${event._id}`,
        isActive: true,
        eventDate: event.startingDate,
        eventEndDate: event.endingDate,
        description: event.description,
        location: event.venue,
        tags: [],
        category: event.type,
        isExclusive: false,
      }))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <EventsTimeline events={events} />
    </div>
  );
}
