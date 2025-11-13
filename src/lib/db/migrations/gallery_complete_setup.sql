-- ============================================
-- GALLERY FEATURE - COMPLETE SETUP
-- ============================================
-- This file contains all migrations needed for the gallery feature
-- Run this once to set up all gallery-related tables and columns
-- ============================================

-- ============================================
-- 1. EVENT GALLERIES TABLE
-- ============================================
-- Stores gallery images for each event
CREATE TABLE IF NOT EXISTS "event_galleries" (
  "id" varchar(191) PRIMARY KEY NOT NULL,
  "event_id" varchar(191) NOT NULL,
  "image_url" text NOT NULL,
  "caption" text,
  "is_active" boolean DEFAULT true NOT NULL,
  "order" varchar(10) DEFAULT '0',
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "event_galleries_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS "event_galleries_event_id_idx" ON "event_galleries" ("event_id");
CREATE INDEX IF NOT EXISTS "event_galleries_is_active_idx" ON "event_galleries" ("is_active");

-- ============================================
-- 2. GALLERY SETTINGS TABLE
-- ============================================
-- Stores global gallery configuration
CREATE TABLE IF NOT EXISTS "gallery_settings" (
  "id" varchar(191) PRIMARY KEY DEFAULT 'default',
  "is_gallery_enabled" boolean DEFAULT true NOT NULL,
  "gallery_title" varchar(255) DEFAULT 'Event Gallery',
  "gallery_description" text DEFAULT 'Browse photos from our events',
  "show_event_count" boolean DEFAULT true NOT NULL,
  "show_photo_count" boolean DEFAULT true NOT NULL,
  "cards_per_row" varchar(10) DEFAULT '3',
  "enable_lightbox" boolean DEFAULT true NOT NULL,
  "show_captions" boolean DEFAULT true NOT NULL,
  "featured_event_ids" text[] DEFAULT '{}',
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Insert default settings
INSERT INTO "gallery_settings" ("id") VALUES ('default')
ON CONFLICT ("id") DO NOTHING;

-- ============================================
-- 3. ADD SHOW_IN_GALLERY TO EVENTS TABLE
-- ============================================
-- Allows hiding/showing events in public gallery
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "show_in_gallery" boolean DEFAULT true NOT NULL;

-- Update existing events to show in gallery by default
UPDATE "events" SET "show_in_gallery" = true WHERE "show_in_gallery" IS NULL;

-- ============================================
-- VERIFICATION QUERIES (Optional)
-- ============================================
-- Uncomment to verify tables were created successfully

-- SELECT COUNT(*) as event_galleries_count FROM event_galleries;
-- SELECT COUNT(*) as gallery_settings_count FROM gallery_settings;
-- SELECT COUNT(*) as events_with_gallery_flag FROM events WHERE show_in_gallery IS NOT NULL;

-- ============================================
-- ROLLBACK (Optional - Use with caution!)
-- ============================================
-- Uncomment to remove all gallery tables and columns
-- WARNING: This will delete all gallery data!

-- DROP TABLE IF EXISTS "event_galleries" CASCADE;
-- DROP TABLE IF EXISTS "gallery_settings" CASCADE;
-- ALTER TABLE "events" DROP COLUMN IF EXISTS "show_in_gallery";
