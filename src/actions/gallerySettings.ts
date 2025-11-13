"use server";

import { db } from "@/lib/db";
import { gallerySettings, type UpdateGallerySettings } from "@/lib/db/schema/gallerySettings";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getGallerySettings() {
  try {
    const settings = await db
      .select()
      .from(gallerySettings)
      .where(eq(gallerySettings.id, "default"))
      .limit(1);

    if (settings.length === 0) {
      // Create default settings if none exist
      const [newSettings] = await db
        .insert(gallerySettings)
        .values({ id: "default" })
        .returning();
      return { success: true, data: newSettings };
    }

    return { success: true, data: settings[0] };
  } catch (error) {
    console.error("Error fetching gallery settings:", error);
    return { success: false, error: "Failed to fetch gallery settings" };
  }
}

export async function updateGallerySettings(data: UpdateGallerySettings) {
  try {
    const [settings] = await db
      .update(gallerySettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(gallerySettings.id, "default"))
      .returning();

    revalidatePath("/gallery");
    revalidatePath("/dashboard/gallery");
    revalidatePath("/dashboard/gallery/settings");

    return { success: true, data: settings };
  } catch (error) {
    console.error("Error updating gallery settings:", error);
    return { success: false, error: "Failed to update gallery settings" };
  }
}

export async function toggleGalleryVisibility(isEnabled: boolean) {
  try {
    const [settings] = await db
      .update(gallerySettings)
      .set({ isGalleryEnabled: isEnabled, updatedAt: new Date() })
      .where(eq(gallerySettings.id, "default"))
      .returning();

    revalidatePath("/gallery");
    revalidatePath("/dashboard/gallery");

    return { success: true, data: settings };
  } catch (error) {
    console.error("Error toggling gallery visibility:", error);
    return { success: false, error: "Failed to toggle gallery visibility" };
  }
}
