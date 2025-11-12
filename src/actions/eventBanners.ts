"use server";

import { db } from "@/lib/db";
import { eventBanners, type NewEventBanner, type UpdateEventBanner } from "@/lib/db/schema/eventBanners";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getActiveEventBanner() {
  try {
    // Get all active banners
    const banners = await db
      .select()
      .from(eventBanners)
      .where(eq(eventBanners.isActive, true))
      .orderBy(desc(eventBanners.createdAt));
    
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
      return { success: true, data: ongoingEvents[0] };
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
      return { success: true, data: upcomingEvents[0] };
    }

    // Priority 3: If no ongoing or upcoming events, return the most recent one
    return { success: true, data: banners[0] };
  } catch (error) {
    console.error("Error fetching active event banner:", error);
    return { success: false, error: "Failed to fetch event banner" };
  }
}

export async function getAllEventBanners() {
  try {
    const banners = await db
      .select()
      .from(eventBanners)
      .orderBy(desc(eventBanners.createdAt));
    
    return { success: true, data: banners };
  } catch (error) {
    console.error("Error fetching event banners:", error);
    return { success: false, error: "Failed to fetch event banners" };
  }
}

export async function createEventBanner(data: NewEventBanner) {
  try {
    const [banner] = await db
      .insert(eventBanners)
      .values(data)
      .returning();
    
    revalidatePath("/");
    revalidatePath("/dashboard/event-banners");
    
    return { success: true, data: banner };
  } catch (error) {
    console.error("Error creating event banner:", error);
    return { success: false, error: "Failed to create event banner" };
  }
}

export async function updateEventBanner(id: string, data: UpdateEventBanner) {
  try {
    const [banner] = await db
      .update(eventBanners)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(eventBanners.id, id))
      .returning();
    
    revalidatePath("/");
    revalidatePath("/dashboard/event-banners");
    
    return { success: true, data: banner };
  } catch (error) {
    console.error("Error updating event banner:", error);
    return { success: false, error: "Failed to update event banner" };
  }
}

export async function deleteEventBanner(id: string) {
  try {
    await db
      .delete(eventBanners)
      .where(eq(eventBanners.id, id));
    
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
    const [banner] = await db
      .update(eventBanners)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(eventBanners.id, id))
      .returning();
    
    revalidatePath("/");
    revalidatePath("/dashboard/event-banners");
    
    return { success: true, data: banner };
  } catch (error) {
    console.error("Error toggling event banner status:", error);
    return { success: false, error: "Failed to toggle event banner status" };
  }
}
