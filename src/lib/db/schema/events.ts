import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable, boolean, integer } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { nanoid } from "@/lib/utils";

export const events = pgTable("events", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: varchar("title", { length: 255 }).notNull(),
  venue: varchar("venue", { length: 255 }).notNull(),
  description: text("description").notNull(),
  featuredImage: text("featured_image"),
  eventUrl: text("event_url"),
  type: varchar("type", { length: 100 }).notNull(),
  needAttendance: boolean("need_attendance").notNull().default(false),
  startingDate: timestamp("starting_date").notNull(),
  endingDate: timestamp("ending_date").notNull(),
  allowedMembers: varchar("allowed_members", { length: 50 }).notNull(),
  allowedDepartments: text("allowed_departments").array().default(sql`'{}'::text[]`),
  allowedDesignations: text("allowed_designations").array().default(sql`'{}'::text[]`),
  notes: text("notes").default(""),
  prId: varchar("pr_id", { length: 191 }),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const insertEventSchema = createSelectSchema(events)
  .extend({})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const updateEventSchema = createSelectSchema(events)
  .extend({})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type Event = typeof events.$inferSelect;
export type NewEvent = z.infer<typeof insertEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
