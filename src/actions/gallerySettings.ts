"use server";

import dbConnect from "@/lib/dbConnect";
import GallerySetting from "@/model/GallerySetting";
import { revalidatePath } from "next/cache";

export type UpdateGallerySettings = {
  isGalleryEnabled?: boolean;
  galleryTitle?: string;
  galleryDescription?: string;
  showEventCount?: boolean;
  showPhotoCount?: boolean;
  cardsPerRow?: string;
  enableLightbox?: boolean;
  showCaptions?: boolean;
  featuredEventIds?: string[];
};

export async function getGallerySettings() {
  try {
    await dbConnect();
    
    let settings = await GallerySetting.findOne().lean();

    if (!settings) {
      // Create default settings if none exist
      settings = await GallerySetting.create({
        isGalleryEnabled: true,
        galleryTitle: "Event Gallery",
        galleryDescription: "Browse photos from our events",
        showEventCount: true,
        showPhotoCount: true,
        cardsPerRow: "3",
        enableLightbox: true,
        showCaptions: true,
        featuredEventIds: [],
      });
    }

    return { success: true, data: JSON.parse(JSON.stringify(settings)) };
  } catch (error) {
    console.error("Error fetching gallery settings:", error);
    return { success: false, error: "Failed to fetch gallery settings" };
  }
}

export async function updateGallerySettings(data: UpdateGallerySettings) {
  try {
    await dbConnect();
    
    let settings = await GallerySetting.findOne();
    
    if (!settings) {
      settings = await GallerySetting.create(data);
    } else {
      settings = await GallerySetting.findOneAndUpdate(
        {},
        { ...data, updatedAt: new Date() },
        { new: true }
      ).lean();
    }

    revalidatePath("/gallery");
    revalidatePath("/dashboard/gallery");
    revalidatePath("/dashboard/gallery/settings");

    return { success: true, data: JSON.parse(JSON.stringify(settings)) };
  } catch (error) {
    console.error("Error updating gallery settings:", error);
    return { success: false, error: "Failed to update gallery settings" };
  }
}

export async function toggleGalleryVisibility(isEnabled: boolean) {
  try {
    await dbConnect();
    
    let settings = await GallerySetting.findOne();
    
    if (!settings) {
      settings = await GallerySetting.create({ isGalleryEnabled: isEnabled });
    } else {
      settings = await GallerySetting.findOneAndUpdate(
        {},
        { isGalleryEnabled: isEnabled, updatedAt: new Date() },
        { new: true }
      ).lean();
    }

    revalidatePath("/gallery");
    revalidatePath("/dashboard/gallery");

    return { success: true, data: JSON.parse(JSON.stringify(settings)) };
  } catch (error) {
    console.error("Error toggling gallery visibility:", error);
    return { success: false, error: "Failed to toggle gallery visibility" };
  }
}
