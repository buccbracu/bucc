import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable, boolean } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { nanoid } from "@/lib/utils";

export const eventBanners = pgTable("event_banners", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: varchar("title", { length: 255 }).notNull(),
  imageUrl: text("image_url").notNull(),
  targetUrl: text("target_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  eventDate: timestamp("event_date"),
  eventEndDate: timestamp("event_end_date"),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  tags: text("tags").array(),
  category: varchar("category", { length: 50 }),
  isExclusive: boolean("is_exclusive").notNull().default(false),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const insertEventBannerSchema = createSelectSchema(eventBanners)
  .extend({})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const updateEventBannerSchema = createSelectSchema(eventBanners)
  .extend({})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type EventBanner = typeof eventBanners.$inferSelect;
export type NewEventBanner = z.infer<typeof insertEventBannerSchema>;
export type UpdateEventBanner = z.infer<typeof updateEventBannerSchema>;
