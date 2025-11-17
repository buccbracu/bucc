"use server";

import dbConnect from "@/lib/dbConnect";
import EventBanner from "@/model/EventBanner";
import { revalidatePath } from "next/cache";

export type NewEventBanner = {
  title: string;
  imageUrl: string;
  targetUrl: string;
  isActive?: boolean;
  eventDate?: Date;
  eventEndDate?: Date;
  description?: string;
  location?: string;
  tags?: string[];
  category?: string;
  isExclusive?: boolean;
  eventId?: string;
};

export type UpdateEventBanner = Partial<NewEventBanner>;

export async function getActiveEventBanner() {
  try {
    await dbConnect();
    
    // Get all active banners
    const banners = await EventBanner.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    
    if (banners.length === 0) {
      return { success: true, data: null };
    }

    const now = new Date();

    // Priority 1: Find ongoing events (event_date <= now <= event_end_date)
    const ongoingEvents = banners.filter((banner: any) => {
      if (!banner.eventDate || !banner.eventEndDate) return false;
      const eventDate = new Date(banner.eventDate);
      const eventEndDate = new Date(banner.eventEndDate);
      return now >= eventDate && now <= eventEndDate;
    });

    // If there are ongoing events, return the one ending soonest
    if (ongoingEvents.length > 0) {
      ongoingEvents.sort((a: any, b: any) => {
        const endA = new Date(a.eventEndDate!).getTime();
        const endB = new Date(b.eventEndDate!).getTime();
        return endA - endB; // Ascending order (ending soonest first)
      });
      const banner = { ...ongoingEvents[0], id: (ongoingEvents[0] as any)._id.toString() };
      return { success: true, data: JSON.parse(JSON.stringify(banner)) };
    }

    // Priority 2: Find upcoming events (event_date >= now)
    const upcomingEvents = banners.filter((banner: any) => {
      if (!banner.eventDate) return false;
      return new Date(banner.eventDate) >= now;
    });

    // If there are upcoming events, return the next one (earliest)
    if (upcomingEvents.length > 0) {
      upcomingEvents.sort((a: any, b: any) => {
        const dateA = new Date(a.eventDate!).getTime();
        const dateB = new Date(b.eventDate!).getTime();
        return dateA - dateB; // Ascending order (earliest first)
      });
      const banner = { ...upcomingEvents[0], id: (upcomingEvents[0] as any)._id.toString() };
      return { success: true, data: JSON.parse(JSON.stringify(banner)) };
    }

    // Priority 3: If no ongoing or upcoming events, return the most recent one
    const banner = { ...banners[0], id: (banners[0] as any)._id.toString() };
    return { success: true, data: JSON.parse(JSON.stringify(banner)) };
  } catch (error) {
    console.error("Error fetching active event banner:", error);
    return { success: false, error: "Failed to fetch event banner" };
  }
}

export async function getUpcomingEventBanners() {
  try {
    await dbConnect();
    
    // Get all active banners sorted by event date
    const banners = await EventBanner.find({ isActive: true })
      .sort({ eventDate: 1 })
      .lean();
    
    if (banners.length === 0) {
      return { success: true, data: [] };
    }

    const now = new Date();

    // Priority 1: Find all ongoing events (currently happening)
    const ongoingEvents = banners.filter((banner: any) => {
      if (!banner.eventDate || !banner.eventEndDate) return false;
      const eventDate = new Date(banner.eventDate);
      const eventEndDate = new Date(banner.eventEndDate);
      return now >= eventDate && now <= eventEndDate;
    });

    // If there are ongoing events, return all of them
    if (ongoingEvents.length > 0) {
      const transformedEvents = ongoingEvents.map((banner: any) => ({
        ...banner,
        id: banner._id.toString(),
      }));
      return { success: true, data: JSON.parse(JSON.stringify(transformedEvents)) };
    }

    // Priority 2: Find all upcoming events (in the future)
    const upcomingEvents = banners.filter((banner: any) => {
      if (!banner.eventDate) return false;
      const eventDate = new Date(banner.eventDate);
      return eventDate > now;
    });

    if (upcomingEvents.length === 0) {
      return { success: true, data: [] };
    }

    // Get the earliest event date (first one since already sorted)
    const earliestEventDate = new Date(upcomingEvents[0].eventDate);
    
    // Get all events that start on the same day as the earliest event
    // Compare using date components to avoid timezone issues
    const earliestYear = earliestEventDate.getFullYear();
    const earliestMonth = earliestEventDate.getMonth();
    const earliestDay = earliestEventDate.getDate();
    
    const eventsOnSameDay = upcomingEvents.filter((banner: any) => {
      const eventDate = new Date(banner.eventDate);
      return (
        eventDate.getFullYear() === earliestYear &&
        eventDate.getMonth() === earliestMonth &&
        eventDate.getDate() === earliestDay
      );
    });

    // Transform _id to id
    const transformedEvents = eventsOnSameDay.map((banner: any) => ({
      ...banner,
      id: banner._id.toString(),
    }));

    return { success: true, data: JSON.parse(JSON.stringify(transformedEvents)) };
  } catch (error) {
    console.error("Error fetching upcoming event banners:", error);
    return { success: false, error: "Failed to fetch upcoming event banners" };
  }
}

// Keep the old function name for backward compatibility
export async function getTodayEventBanners() {
  return getUpcomingEventBanners();
}

export async function getAllEventBanners() {
  try {
    await dbConnect();
    
    const banners = await EventBanner.find()
      .sort({ createdAt: -1 })
      .lean();
    
    // Transform _id to id for frontend compatibility
    const transformedBanners = banners.map((banner: any) => ({
      ...banner,
      id: banner._id.toString(),
    }));
    
    return { success: true, data: JSON.parse(JSON.stringify(transformedBanners)) };
  } catch (error) {
    console.error("Error fetching event banners:", error);
    return { success: false, error: "Failed to fetch event banners" };
  }
}

export async function createEventBanner(data: NewEventBanner) {
  try {
    await dbConnect();
    
    const banner = await EventBanner.create(data);
    const transformedBanner = { ...banner.toObject(), id: banner._id.toString() };
    
    revalidatePath("/");
    revalidatePath("/dashboard/event-banners");
    
    return { success: true, data: JSON.parse(JSON.stringify(transformedBanner)) };
  } catch (error) {
    console.error("Error creating event banner:", error);
    return { success: false, error: "Failed to create event banner" };
  }
}

export async function updateEventBanner(id: string, data: UpdateEventBanner) {
  try {
    await dbConnect();
    
    const banner = await EventBanner.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    ).lean();
    
    if (!banner) {
      return { success: false, error: "Banner not found" };
    }
    
    const transformedBanner = { ...banner, id: (banner as any)._id.toString() };
    
    revalidatePath("/");
    revalidatePath("/dashboard/event-banners");
    
    return { success: true, data: JSON.parse(JSON.stringify(transformedBanner)) };
  } catch (error) {
    console.error("Error updating event banner:", error);
    return { success: false, error: "Failed to update event banner" };
  }
}

export async function deleteEventBanner(id: string) {
  try {
    await dbConnect();
    
    await EventBanner.findByIdAndDelete(id);
    
    revalidatePath("/");
    revalidatePath("/dashboard/event-banners");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting event banner:", error);
    return { success: false, error: "Failed to delete event banner" };
  }
}

export async function toggleEventBannerStatus(id: string, isActive: boolean) {
  try {
    await dbConnect();
    
    const banner = await EventBanner.findByIdAndUpdate(
      id,
      { isActive, updatedAt: new Date() },
      { new: true }
    ).lean();
    
    if (!banner) {
      return { success: false, error: "Banner not found" };
    }
    
    const transformedBanner = { ...banner, id: (banner as any)._id.toString() };
    
    revalidatePath("/");
    revalidatePath("/dashboard/event-banners");
    
    return { success: true, data: JSON.parse(JSON.stringify(transformedBanner)) };
  } catch (error) {
    console.error("Error toggling event banner status:", error);
    return { success: false, error: "Failed to toggle event banner status" };
  }
}

export async function getEventBannerByEventId(eventId: string) {
  try {
    await dbConnect();
    
    const banner = await EventBanner.findOne({ eventId }).lean();
    
    if (!banner) {
      return { success: false, error: "Banner not found" };
    }
    
    const transformedBanner = { ...banner, id: (banner as any)._id.toString() };
    
    return { success: true, data: JSON.parse(JSON.stringify(transformedBanner)) };
  } catch (error) {
    console.error("Error fetching event banner by eventId:", error);
    return { success: false, error: "Failed to fetch event banner" };
  }
}
