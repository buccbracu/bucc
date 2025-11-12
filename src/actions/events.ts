"use server";

import { db } from "@/lib/db";
import { events, type NewEvent, type Event } from "@/lib/db/schema/events";
import { eq, desc } from "drizzle-orm";

export async function getAllEvents() {
  try {
    const allEvents = await db
      .select()
      .from(events)
      .orderBy(desc(events.createdAt));
    
    return { success: true, data: allEvents };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { success: false, error: "Failed to fetch events" };
  }
}

export async function getEventById(id: string) {
  try {
    const event = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);
    
    if (event.length === 0) {
      return { success: false, error: "Event not found" };
    }
    
    return { success: true, data: event[0] };
  } catch (error) {
    console.error("Error fetching event:", error);
    return { success: false, error: "Failed to fetch event" };
  }
}

export async function createEvent(data: NewEvent) {
  try {
    const newEvent = await db
      .insert(events)
      .values(data)
      .returning();
    
    return { success: true, data: newEvent[0] };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error: "Failed to create event" };
  }
}

export async function updateEvent(id: string, data: Partial<NewEvent>) {
  try {
    const updatedEvent = await db
      .update(events)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    
    if (updatedEvent.length === 0) {
      return { success: false, error: "Event not found" };
    }
    
    return { success: true, data: updatedEvent[0] };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error: "Failed to update event" };
  }
}

export async function deleteEvent(id: string) {
  try {
    const deletedEvent = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning();
    
    if (deletedEvent.length === 0) {
      return { success: false, error: "Event not found" };
    }
    
    return { success: true, data: deletedEvent[0] };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: "Failed to delete event" };
  }
}

export async function getFeaturedEvent() {
  try {
    const now = new Date();
    const allEvents = await db
      .select()
      .from(events)
      .orderBy(desc(events.startingDate));

    // Find ongoing events
    const ongoingEvents = allEvents.filter(
      (event) =>
        new Date(event.startingDate) <= now &&
        new Date(event.endingDate) >= now
    );

    // If there's an ongoing event, return the most recent one
    if (ongoingEvents.length > 0) {
      return { success: true, data: ongoingEvents[0] };
    }

    // Otherwise, find the closest upcoming event
    const upcomingEvents = allEvents.filter(
      (event) => new Date(event.startingDate) > now
    );

    if (upcomingEvents.length > 0) {
      // Sort by starting date ascending to get the closest one
      upcomingEvents.sort(
        (a, b) =>
          new Date(a.startingDate).getTime() - new Date(b.startingDate).getTime()
      );
      return { success: true, data: upcomingEvents[0] };
    }

    // No ongoing or upcoming events
    return { success: false, error: "No featured event available" };
  } catch (error) {
    console.error("Error fetching featured event:", error);
    return { success: false, error: "Failed to fetch featured event" };
  }
}
