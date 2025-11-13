import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable, boolean } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { nanoid } from "@/lib/utils";
import { events } from "./events";

export const eventGalleries = pgTable("event_galleries", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  eventId: varchar("event_id", { length: 191 })
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  isActive: boolean("is_active").notNull().default(true),
  order: varchar("order", { length: 10 }).default("0"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const insertEventGallerySchema = createSelectSchema(eventGalleries)
  .extend({})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const updateEventGallerySchema = createSelectSchema(eventGalleries)
  .extend({})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type EventGallery = typeof eventGalleries.$inferSelect;
export type NewEventGallery = z.infer<typeof insertEventGallerySchema>;
export type UpdateEventGallery = z.infer<typeof updateEventGallerySchema>;
