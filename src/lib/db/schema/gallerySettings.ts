import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable, boolean } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const gallerySettings = pgTable("gallery_settings", {
  id: varchar("id", { length: 191 }).primaryKey().default("default"),
  isGalleryEnabled: boolean("is_gallery_enabled").notNull().default(true),
  galleryTitle: varchar("gallery_title", { length: 255 }).default("Event Gallery"),
  galleryDescription: text("gallery_description").default("Browse photos from our events"),
  showEventCount: boolean("show_event_count").notNull().default(true),
  showPhotoCount: boolean("show_photo_count").notNull().default(true),
  cardsPerRow: varchar("cards_per_row", { length: 10 }).default("3"),
  enableLightbox: boolean("enable_lightbox").notNull().default(true),
  showCaptions: boolean("show_captions").notNull().default(true),
  featuredEventIds: text("featured_event_ids").array().default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const updateGallerySettingsSchema = createSelectSchema(gallerySettings)
  .extend({})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type GallerySettings = typeof gallerySettings.$inferSelect;
export type UpdateGallerySettings = z.infer<typeof updateGallerySettingsSchema>;
