"use server";

import dbConnect from "@/lib/dbConnect";
import Event from "@/model/Event";
import EventGallery from "@/model/EventGallery";
import { revalidatePath } from "next/cache";
import { createEventBanner, updateEventBanner, getEventBannerByEventId, deleteEventBanner } from "@/actions/eventBanners";

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
      .select('-attendance -notes') // Exclude heavy fields
      .sort({ createdDate: -1 })
      .lean()
      .exec();
    
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
      .select('-attendance -notes') // Exclude heavy fields
      .sort({ createdDate: -1 })
      .lean()
      .exec();
    
    // Use aggregation for better performance
    const query: any = includeInactive ? {} : { isActive: true };
    const galleryCounts = await EventGallery.aggregate([
      { $match: query },
      { $group: { _id: "$eventId", count: { $sum: 1 } } }
    ]);
    
    const countMap = new Map(galleryCounts.map(g => [g._id.toString(), g.count]));
    
    const eventsWithCounts = allEvents.map((event: any) => ({
      ...event,
      id: event._id.toString(),
      galleryCount: countMap.get(event._id.toString()) || 0,
    }));
    
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
    
    // Automatically create an event banner if the event has a featured image
    if (newEvent.featuredImage) {
      try {
        await createEventBanner({
          title: newEvent.title,
          imageUrl: newEvent.featuredImage,
          targetUrl: newEvent.eventUrl || `/events/${newEvent._id}`,
          isActive: true,
          eventDate: newEvent.startingDate,
          eventEndDate: newEvent.endingDate,
          description: newEvent.description,
          location: newEvent.venue,
          tags: [newEvent.type],
          category: newEvent.type,
          isExclusive: false,
          eventId: newEvent._id.toString(),
        });
        console.log(`Created banner for event ${newEvent._id}`);
      } catch (bannerError) {
        console.error("Error creating event banner:", bannerError);
        // Don't fail the event creation if banner creation fails
      }
    }
    
    revalidatePath("/");
    revalidatePath("/events");
    
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
    
    // Update or create the event banner
    if (updatedEvent.featuredImage) {
      try {
        const bannerResult = await getEventBannerByEventId(id);
        
        const bannerData = {
          title: updatedEvent.title,
          imageUrl: updatedEvent.featuredImage,
          targetUrl: updatedEvent.eventUrl || `/events/${updatedEvent._id}`,
          eventDate: updatedEvent.startingDate,
          eventEndDate: updatedEvent.endingDate,
          description: updatedEvent.description,
          location: updatedEvent.venue,
          tags: [updatedEvent.type],
          category: updatedEvent.type,
        };
        
        if (bannerResult.success && bannerResult.data) {
          // Update existing banner
          await updateEventBanner(bannerResult.data._id, bannerData);
        } else {
          // Create new banner if it doesn't exist
          await createEventBanner({
            ...bannerData,
            isActive: true,
            isExclusive: false,
            eventId: id,
          });
        }
      } catch (bannerError) {
        console.error("Error updating event banner:", bannerError);
        // Don't fail the event update if banner update fails
      }
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
    
    // Delete the associated event banner if it exists
    try {
      const bannerResult = await getEventBannerByEventId(id);
      if (bannerResult.success && bannerResult.data) {
        await deleteEventBanner(bannerResult.data.id);
        console.log(`Deleted associated banner for event ${id}`);
      }
    } catch (bannerError) {
      console.error("Error deleting event banner:", bannerError);
      // Don't fail the event deletion if banner deletion fails
    }
    
    // Revalidate paths to update the UI
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/dashboard/events");
    revalidatePath("/dashboard/event-banners");
    
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
