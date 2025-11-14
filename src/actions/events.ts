"use server";

import dbConnect from "@/lib/dbConnect";
import Event from "@/model/Event";
import EventGallery from "@/model/EventGallery";

export type NewEvent = {
  title: string;
  venue: string;
  description: string;
  featuredImage?: string;
  eventUrl?: string;
  type: string;
  needAttendance?: boolean;
  startingDate: Date;
  endingDate: Date;
  allowedMembers: string;
  allowedDepartments?: string[];
  allowedDesignations?: string[];
  notes?: string;
  prId?: string;
  showInGallery?: boolean;
};

export async function getAllEvents() {
  try {
    await dbConnect();
    
    const allEvents = await Event.find()
      .sort({ createdDate: -1 })
      .lean();
    
    return { success: true, data: JSON.parse(JSON.stringify(allEvents)) };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { success: false, error: "Failed to fetch events" };
  }
}

export async function getAllEventsWithGalleryCounts(includeInactive = false) {
  try {
    await dbConnect();
    
    const allEvents = await Event.find()
      .sort({ createdDate: -1 })
      .lean();
    
    const eventsWithCounts = await Promise.all(
      allEvents.map(async (event: any) => {
        const query: any = { eventId: event._id };
        if (!includeInactive) {
          query.isActive = true;
        }
        const galleryCount = await EventGallery.countDocuments(query);
        return {
          ...event,
          galleryCount,
        };
      })
    );
    
    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(eventsWithCounts))
    };
  } catch (error) {
    console.error("Error fetching events with gallery counts:", error);
    return { success: false, error: "Failed to fetch events with gallery counts" };
  }
}

export async function getEventById(id: string) {
  try {
    await dbConnect();
    
    const event = await Event.findById(id).lean();
    
    if (!event) {
      return { success: false, error: "Event not found" };
    }
    
    return { success: true, data: JSON.parse(JSON.stringify(event)) };
  } catch (error) {
    console.error("Error fetching event:", error);
    return { success: false, error: "Failed to fetch event" };
  }
}

export async function createEvent(data: NewEvent) {
  try {
    await dbConnect();
    
    const newEvent = await Event.create(data);
    
    return { success: true, data: JSON.parse(JSON.stringify(newEvent)) };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error: "Failed to create event" };
  }
}

export async function updateEvent(id: string, data: Partial<NewEvent>) {
  try {
    await dbConnect();
    
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { ...data, lastUpdate: new Date() },
      { new: true }
    ).lean();
    
    if (!updatedEvent) {
      return { success: false, error: "Event not found" };
    }
    
    return { success: true, data: JSON.parse(JSON.stringify(updatedEvent)) };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error: "Failed to update event" };
  }
}

export async function deleteEvent(id: string) {
  try {
    await dbConnect();
    
    const deletedEvent = await Event.findByIdAndDelete(id).lean();
    
    if (!deletedEvent) {
      return { success: false, error: "Event not found" };
    }
    
    return { success: true, data: JSON.parse(JSON.stringify(deletedEvent)) };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: "Failed to delete event" };
  }
}

export async function getFeaturedEvent() {
  try {
    await dbConnect();
    
    const now = new Date();
    const allEvents = await Event.find()
      .sort({ startingDate: -1 })
      .lean();

    // Find ongoing events
    const ongoingEvents = allEvents.filter(
      (event: any) =>
        new Date(event.startingDate) <= now &&
        new Date(event.endingDate) >= now
    );

    // If there's an ongoing event, return the most recent one
    if (ongoingEvents.length > 0) {
      return { success: true, data: JSON.parse(JSON.stringify(ongoingEvents[0])) };
    }

    // Otherwise, find the closest upcoming event
    const upcomingEvents = allEvents.filter(
      (event: any) => new Date(event.startingDate) > now
    );

    if (upcomingEvents.length > 0) {
      // Sort by starting date ascending to get the closest one
      upcomingEvents.sort(
        (a: any, b: any) =>
          new Date(a.startingDate).getTime() - new Date(b.startingDate).getTime()
      );
      return { success: true, data: JSON.parse(JSON.stringify(upcomingEvents[0])) };
    }

    // No ongoing or upcoming events
    return { success: false, error: "No featured event available" };
  } catch (error) {
    console.error("Error fetching featured event:", error);
    return { success: false, error: "Failed to fetch featured event" };
  }
}

export async function toggleEventGalleryVisibility(id: string, showInGallery: boolean) {
  try {
    await dbConnect();
    
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { showInGallery, lastUpdate: new Date() },
      { new: true }
    ).lean();

    if (!updatedEvent) {
      return { success: false, error: "Event not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(updatedEvent)) };
  } catch (error) {
    console.error("Error toggling event gallery visibility:", error);
    return { success: false, error: "Failed to toggle event gallery visibility" };
  }
}

export async function getTodayEvents() {
  try {
    await dbConnect();
    
    const allEvents = await Event.find()
      .sort({ createdDate: -1 })
      .lean();
    
    if (allEvents.length === 0) {
      return { success: true, data: [] };
    }

    const now = new Date();

    // Find all ongoing events
    const ongoingEvents = allEvents.filter((event: any) => {
      const startDate = new Date(event.startingDate);
      const endDate = new Date(event.endingDate);
      return now >= startDate && now <= endDate;
    });

    // Find all upcoming events happening today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    
    const upcomingEvents = allEvents.filter((event: any) => {
      const startDate = new Date(event.startingDate);
      return startDate >= now && startDate >= todayStart && startDate <= todayEnd;
    });

    // Combine ongoing and upcoming events
    const todayEvents = [...ongoingEvents];
    upcomingEvents.forEach((event: any) => {
      if (!todayEvents.find((e: any) => e._id?.toString() === event._id?.toString())) {
        todayEvents.push(event);
      }
    });

    // Sort by starting date
    todayEvents.sort((a: any, b: any) => {
      return new Date(a.startingDate).getTime() - new Date(b.startingDate).getTime();
    });

    // Map to banner format
    const mappedEvents = todayEvents.map((event: any) => ({
      id: event._id,
      title: event.title,
      imageUrl: event.featuredImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      targetUrl: event.eventUrl || `/events/${event._id}`,
      isActive: true,
      eventDate: event.startingDate,
      eventEndDate: event.endingDate,
      description: event.description,
      location: event.venue,
      createdAt: event.createdDate,
    }));

    return { success: true, data: JSON.parse(JSON.stringify(mappedEvents)) };
  } catch (error) {
    console.error("Error fetching today's events:", error);
    return { success: false, error: "Failed to fetch today's events" };
  }
}

export async function getActiveEvent() {
  try {
    await dbConnect();
    
    const allEvents = await Event.find()
      .sort({ createdDate: -1 })
      .lean();
    
    if (allEvents.length === 0) {
      return { success: true, data: null };
    }

    const now = new Date();

    // Priority 1: Find ongoing events
    const ongoingEvents = allEvents.filter((event: any) => {
      const startDate = new Date(event.startingDate);
      const endDate = new Date(event.endingDate);
      return now >= startDate && now <= endDate;
    });

    if (ongoingEvents.length > 0) {
      // Return the one ending soonest
      ongoingEvents.sort((a: any, b: any) => {
        return new Date(a.endingDate).getTime() - new Date(b.endingDate).getTime();
      });
      
      const event = ongoingEvents[0];
      return { 
        success: true, 
        data: JSON.parse(JSON.stringify({
          id: event._id,
          title: event.title,
          imageUrl: event.featuredImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
          targetUrl: event.eventUrl || `/events/${event._id}`,
          isActive: true,
          eventDate: event.startingDate,
          eventEndDate: event.endingDate,
          description: event.description,
          location: event.venue,
          createdAt: event.createdDate,
        }))
      };
    }

    // Priority 2: Find upcoming events
    const upcomingEvents = allEvents.filter((event: any) => {
      return new Date(event.startingDate) >= now;
    });

    if (upcomingEvents.length > 0) {
      // Return the next one (earliest)
      upcomingEvents.sort((a: any, b: any) => {
        return new Date(a.startingDate).getTime() - new Date(b.startingDate).getTime();
      });
      
      const event = upcomingEvents[0];
      return { 
        success: true, 
        data: JSON.parse(JSON.stringify({
          id: event._id,
          title: event.title,
          imageUrl: event.featuredImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
          targetUrl: event.eventUrl || `/events/${event._id}`,
          isActive: true,
          eventDate: event.startingDate,
          eventEndDate: event.endingDate,
          description: event.description,
          location: event.venue,
          createdAt: event.createdDate,
        }))
      };
    }

    // Priority 3: Return the most recent event
    const event = allEvents[0];
    return { 
      success: true, 
      data: JSON.parse(JSON.stringify({
        id: event._id,
        title: event.title,
        imageUrl: event.featuredImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        targetUrl: event.eventUrl || `/events/${event._id}`,
        isActive: true,
        eventDate: event.startingDate,
        eventEndDate: event.endingDate,
        description: event.description,
        location: event.venue,
        createdAt: event.createdDate,
      }))
    };
  } catch (error) {
    console.error("Error fetching active event:", error);
    return { success: false, error: "Failed to fetch active event" };
  }
}
