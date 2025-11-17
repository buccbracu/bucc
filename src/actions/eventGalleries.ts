"use server";

import dbConnect from "@/lib/dbConnect";
import EventGallery from "@/model/EventGallery";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary } from "@/lib/cloudinary";

export type NewEventGallery = {
  eventId: string;
  imageUrl: string;
  caption?: string;
  isActive?: boolean;
  order?: string;
};

export type UpdateEventGallery = Partial<NewEventGallery>;

export async function getEventGalleries(eventId: string, includeInactive = false) {
  try {
    await dbConnect();
    
    const query: any = { eventId };
    if (!includeInactive) {
      query.isActive = true;
    }

    const galleries = await EventGallery.find(query)
      .select('eventId imageUrl caption isActive order createdAt') // Only select needed fields
      .sort({ order: 1, createdAt: -1 })
      .lean()
      .exec();
    
    const galleriesWithId = galleries.map((gallery: any) => ({
      ...gallery,
      id: gallery._id.toString(),
    }));
    
    return { success: true, data: JSON.parse(JSON.stringify(galleriesWithId)) };
  } catch (error) {
    console.error("Error fetching event galleries:", error);
    return { success: false, error: "Failed to fetch event galleries" };
  }
}

export async function getAllActiveGalleries() {
  try {
    await dbConnect();
    
    const galleries = await EventGallery.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    
    return { success: true, data: JSON.parse(JSON.stringify(galleries)) };
  } catch (error) {
    console.error("Error fetching active galleries:", error);
    return { success: false, error: "Failed to fetch active galleries" };
  }
}

export async function createEventGallery(data: NewEventGallery) {
  try {
    await dbConnect();
    
    const gallery = await EventGallery.create(data);
    
    revalidatePath("/gallery");
    revalidatePath(`/gallery/${data.eventId}`);
    revalidatePath("/dashboard/gallery");
    
    return { success: true, data: JSON.parse(JSON.stringify(gallery)) };
  } catch (error) {
    console.error("Error creating event gallery:", error);
    return { success: false, error: "Failed to create event gallery" };
  }
}

export async function updateEventGallery(id: string, data: UpdateEventGallery) {
  try {
    await dbConnect();
    
    const gallery = await EventGallery.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    ).lean();
    
    if (!gallery) {
      return { success: false, error: "Gallery not found" };
    }
    
    revalidatePath("/gallery");
    if ('eventId' in gallery && gallery.eventId) {
      revalidatePath(`/gallery/${gallery.eventId}`);
    }
    revalidatePath("/dashboard/gallery");
    
    return { success: true, data: JSON.parse(JSON.stringify(gallery)) };
  } catch (error) {
    console.error("Error updating event gallery:", error);
    return { success: false, error: "Failed to update event gallery" };
  }
}

export async function deleteEventGallery(id: string) {
  try {
    await dbConnect();
    
    const deleted = await EventGallery.findByIdAndDelete(id).lean();
    
    if (!deleted) {
      return { success: false, error: "Gallery not found" };
    }
    
    revalidatePath("/gallery");
    if ('eventId' in deleted && deleted.eventId) {
      revalidatePath(`/gallery/${deleted.eventId}`);
    }
    revalidatePath("/dashboard/gallery");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting event gallery:", error);
    return { success: false, error: "Failed to delete event gallery" };
  }
}

export async function toggleGalleryStatus(id: string, isActive: boolean) {
  try {
    await dbConnect();
    
    const gallery = await EventGallery.findByIdAndUpdate(
      id,
      { isActive, updatedAt: new Date() },
      { new: true }
    ).lean();
    
    if (!gallery) {
      return { success: false, error: "Gallery not found" };
    }
    
    revalidatePath("/gallery");
    if ('eventId' in gallery && gallery.eventId) {
      revalidatePath(`/gallery/${gallery.eventId}`);
    }
    revalidatePath("/dashboard/gallery");
    
    return { success: true, data: JSON.parse(JSON.stringify(gallery)) };
  } catch (error) {
    console.error("Error toggling gallery status:", error);
    return { success: false, error: "Failed to toggle gallery status" };
  }
}

export async function uploadGalleryImage(formData: FormData) {
  try {
    await dbConnect();
    
    const file = formData.get("file") as File;
    const eventId = formData.get("eventId") as string;
    const caption = formData.get("caption") as string;
    
    if (!file || !eventId) {
      return { success: false, error: "Missing required fields" };
    }

    const imageUrl = await uploadToCloudinary(file, "gallery");
    
    const gallery = await EventGallery.create({
      eventId,
      imageUrl,
      caption: caption || null,
      isActive: true,
      order: "0",
    });
    
    revalidatePath("/gallery");
    revalidatePath(`/gallery/${eventId}`);
    revalidatePath("/dashboard/gallery");
    
    return { success: true, data: JSON.parse(JSON.stringify(gallery)) };
  } catch (error) {
    console.error("Error uploading gallery image:", error);
    return { success: false, error: "Failed to upload image" };
  }
}
