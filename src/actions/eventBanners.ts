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
    const ongoingEvents = banners.filter((banner) => {
      if (!banner.eventDate || !banner.eventEndDate) return false;
      const eventDate = new Date(banner.eventDate);
      const eventEndDate = new Date(banner.eventEndDate);
      return now >= eventDate && now <= eventEndDate;
    });

    // If there are ongoing events, return the one ending soonest
    if (ongoingEvents.length > 0) {
      ongoingEvents.sort((a, b) => {
        const endA = new Date(a.eventEndDate!).getTime();
        const endB = new Date(b.eventEndDate!).getTime();
        return endA - endB; // Ascending order (ending soonest first)
      });
      return { success: true, data: JSON.parse(JSON.stringify(ongoingEvents[0])) };
    }

    // Priority 2: Find upcoming events (event_date >= now)
    const upcomingEvents = banners.filter((banner) => {
      if (!banner.eventDate) return false;
      return new Date(banner.eventDate) >= now;
    });

    // If there are upcoming events, return the next one (earliest)
    if (upcomingEvents.length > 0) {
      upcomingEvents.sort((a, b) => {
        const dateA = new Date(a.eventDate!).getTime();
        const dateB = new Date(b.eventDate!).getTime();
        return dateA - dateB; // Ascending order (earliest first)
      });
      return { success: true, data: JSON.parse(JSON.stringify(upcomingEvents[0])) };
    }

    // Priority 3: If no ongoing or upcoming events, return the most recent one
    return { success: true, data: JSON.parse(JSON.stringify(banners[0])) };
  } catch (error) {
    console.error("Error fetching active event banner:", error);
    return { success: false, error: "Failed to fetch event banner" };
  }
}

export async function getTodayEventBanners() {
  try {
    await dbConnect();
    
    // Get all active banners
    const banners = await EventBanner.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    
    if (banners.length === 0) {
      return { success: true, data: [] };
    }

    const now = new Date();

    // Find all ongoing events (event started in the past and hasn't ended yet)
    const ongoingEvents = banners.filter((banner) => {
      if (!banner.eventDate || !banner.eventEndDate) return false;
      const eventDate = new Date(banner.eventDate);
      const eventEndDate = new Date(banner.eventEndDate);
      // Event is ongoing if it started before now and ends after now
      return now >= eventDate && now <= eventEndDate;
    });

    // Find all upcoming events happening today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    
    const upcomingEvents = banners.filter((banner) => {
      if (!banner.eventDate) return false;
      const eventDate = new Date(banner.eventDate);
      // Event is upcoming today if it starts later today
      return eventDate >= now && eventDate >= todayStart && eventDate <= todayEnd;
    });

    // Combine ongoing and upcoming events, remove duplicates
    const todayEvents = [...ongoingEvents];
    upcomingEvents.forEach(event => {
      if (!todayEvents.find(e => e._id?.toString() === event._id?.toString())) {
        todayEvents.push(event);
      }
    });

    // Sort by event date (earliest first)
    todayEvents.sort((a, b) => {
      const dateA = new Date(a.eventDate!).getTime();
      const dateB = new Date(b.eventDate!).getTime();
      return dateA - dateB;
    });

    return { success: true, data: JSON.parse(JSON.stringify(todayEvents)) };
  } catch (error) {
    console.error("Error fetching today's event banners:", error);
    return { success: false, error: "Failed to fetch today's event banners" };
  }
}

export async function getAllEventBanners() {
  try {
    await dbConnect();
    
    const banners = await EventBanner.find()
      .sort({ createdAt: -1 })
      .lean();
    
    return { success: true, data: JSON.parse(JSON.stringify(banners)) };
  } catch (error) {
    console.error("Error fetching event banners:", error);
    return { success: false, error: "Failed to fetch event banners" };
  }
}

export async function createEventBanner(data: NewEventBanner) {
  try {
    await dbConnect();
    
    const banner = await EventBanner.create(data);
    
    revalidatePath("/");
    revalidatePath("/dashboard/event-banners");
    
    return { success: true, data: JSON.parse(JSON.stringify(banner)) };
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
    
    revalidatePath("/");
    revalidatePath("/dashboard/event-banners");
    
    return { success: true, data: JSON.parse(JSON.stringify(banner)) };
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
    
    revalidatePath("/");
    revalidatePath("/dashboard/event-banners");
    
    return { success: true, data: JSON.parse(JSON.stringify(banner)) };
  } catch (error) {
    console.error("Error toggling event banner status:", error);
    return { success: false, error: "Failed to toggle event banner status" };
  }
}
