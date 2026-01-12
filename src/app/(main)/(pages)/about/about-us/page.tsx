import AboutUsPage from "@/components/about/AboutUsPage";
import { getAllEvents } from "@/actions/events";

export const metadata = {
  title: "About Us | BRAC University Computer Club",
  description:
    "Learn about BUCC's mission, vision, and journey since 2001. Discover how we empower tech enthusiasts and shape future leaders in technology.",
};

// Static generation with revalidation
export const revalidate = 120;
export const dynamic = 'force-static';

export default async function AboutUs() {
  const eventsResult = await getAllEvents();
  const allEvents = eventsResult.success ? eventsResult.data ?? [] : [];
  
  // Filter upcoming events
  const now = new Date();
  const upcomingEvents = allEvents
    .filter((event: any) => new Date(event.startingDate) > now)
    .sort((a: any, b: any) => new Date(a.startingDate).getTime() - new Date(b.startingDate).getTime())
    .slice(0, 3);
  
  return <AboutUsPage upcomingEvents={upcomingEvents} />;
}