"use server";

import { db } from "@/lib/db";
import { eventGalleries, type NewEventGallery, type UpdateEventGallery } from "@/lib/db/schema/eventGalleries";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function getEventGalleries(eventId: string, includeInactive = false) {
  try {
    const conditions = includeInactive
      ? eq(eventGalleries.eventId, eventId)
      : and(eq(eventGalleries.eventId, eventId), eq(eventGalleries.isActive, true));

    const galleries = await db
      .select()
      .from(eventGalleries)
      .where(conditions)
      .orderBy(eventGalleries.order, desc(eventGalleries.createdAt));
    
    return { success: true, data: galleries };
  } catch (error) {
    console.error("Error fetching event galleries:", error);
    return { success: false, error: "Failed to fetch event galleries" };
  }
}

export async function getAllActiveGalleries() {
  try {
    const galleries = await db
      .select()
      .from(eventGalleries)
      .where(eq(eventGalleries.isActive, true))
      .orderBy(desc(eventGalleries.createdAt));
    
    return { success: true, data: galleries };
  } catch (error) {
    console.error("Error fetching active galleries:", error);
    return { success: false, error: "Failed to fetch active galleries" };
  }
}

export async function createEventGallery(data: NewEventGallery) {
  try {
    const [gallery] = await db
      .insert(eventGalleries)
      .values(data)
      .returning();
    
    revalidatePath("/gallery");
    revalidatePath(`/gallery/${data.eventId}`);
    revalidatePath("/dashboard/gallery");
    
    return { success: true, data: gallery };
  } catch (error) {
    console.error("Error creating event gallery:", error);
    return { success: false, error: "Failed to create event gallery" };
  }
}

export async function updateEventGallery(id: string, data: UpdateEventGallery) {
  try {
    const [gallery] = await db
      .update(eventGalleries)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(eventGalleries.id, id))
      .returning();
    
    revalidatePath("/gallery");
    revalidatePath(`/gallery/${gallery.eventId}`);
    revalidatePath("/dashboard/gallery");
    
    return { success: true, data: gallery };
  } catch (error) {
    console.error("Error updating event gallery:", error);
    return { success: false, error: "Failed to update event gallery" };
  }
}

export async function deleteEventGallery(id: string) {
  try {
    const [deleted] = await db
      .delete(eventGalleries)
      .where(eq(eventGalleries.id, id))
      .returning();
    
    revalidatePath("/gallery");
    revalidatePath(`/gallery/${deleted.eventId}`);
    revalidatePath("/dashboard/gallery");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting event gallery:", error);
    return { success: false, error: "Failed to delete event gallery" };
  }
}

export async function toggleGalleryStatus(id: string, isActive: boolean) {
  try {
    const [gallery] = await db
      .update(eventGalleries)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(eventGalleries.id, id))
      .returning();
    
    revalidatePath("/gallery");
    revalidatePath(`/gallery/${gallery.eventId}`);
    revalidatePath("/dashboard/gallery");
    
    return { success: true, data: gallery };
  } catch (error) {
    console.error("Error toggling gallery status:", error);
    return { success: false, error: "Failed to toggle gallery status" };
  }
}

export async function uploadGalleryImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const eventId = formData.get("eventId") as string;
    const caption = formData.get("caption") as string;
    
    if (!file || !eventId) {
      return { success: false, error: "Missing required fields" };
    }

    const imageUrl = await uploadToCloudinary(file, "gallery");
    
    const [gallery] = await db
      .insert(eventGalleries)
      .values({
        eventId,
        imageUrl,
        caption: caption || null,
        isActive: true,
        order: "0",
      })
      .returning();
    
    revalidatePath("/gallery");
    revalidatePath(`/gallery/${eventId}`);
    revalidatePath("/dashboard/gallery");
    
    return { success: true, data: gallery };
  } catch (error) {
    console.error("Error uploading gallery image:", error);
    return { success: false, error: "Failed to upload image" };
  }
}
