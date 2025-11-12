import EventsTimeline from "@/components/events/EventsTimeline";
import { getAllEventBanners } from "@/actions/eventBanners";

export const metadata = {
  title: "Events | BRAC University Computer Club",
  description: "Explore past and upcoming events organized by BUCC",
};

export default async function EventsPage() {
  const bannersResult = await getAllEventBanners();

  const bannerEvents = bannersResult.success ? bannersResult.data ?? [] : [];

  return (
    <div className="min-h-screen bg-background">
      <EventsTimeline events={bannerEvents} />
    </div>
  );
}
