-- ============================================
-- CONSOLIDATED DATABASE MIGRATION
-- Combines all migrations into a single file
-- ============================================

-- ============================================
-- 0000: Enable Extensions & Core Tables
-- ============================================
CREATE EXTENSION IF NOT EXISTS vector;

-- Resources table
CREATE TABLE IF NOT EXISTS "resources" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Embeddings table
CREATE TABLE IF NOT EXISTS "embeddings" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"resource_id" varchar(191),
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);

-- Add foreign key constraint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create vector index
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "embeddings" USING hnsw ("embedding" vector_cosine_ops);


-- ============================================
-- 0001: Create Event Banners Table
-- ============================================
CREATE TABLE IF NOT EXISTS "event_banners" (
  "id" varchar(191) PRIMARY KEY NOT NULL,
  "title" varchar(255) NOT NULL,
  "image_url" text NOT NULL,
  "target_url" text NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Insert placeholder banner (Bit Battles)
INSERT INTO "event_banners" ("id", "title", "image_url", "target_url", "is_active")
VALUES (
  'placeholder-bit-battles',
  'Bit Battles - Intra BRAC University Programming Contest',
  '/images/bit-battles-banner.jpg',
  'https://bitbattles.bracucc.org/',
  true
)
ON CONFLICT (id) DO NOTHING;


-- ============================================
-- 0002: Add Event Date Fields
-- ============================================
ALTER TABLE event_banners ADD COLUMN IF NOT EXISTS event_date timestamp;
ALTER TABLE event_banners ADD COLUMN IF NOT EXISTS event_end_date timestamp;
ALTER TABLE event_banners ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE event_banners ADD COLUMN IF NOT EXISTS location varchar(255);


-- ============================================
-- 0003: Add Event Tags and Category
-- ============================================
ALTER TABLE event_banners ADD COLUMN IF NOT EXISTS tags text[];
ALTER TABLE event_banners ADD COLUMN IF NOT EXISTS category varchar(50);
ALTER TABLE event_banners ADD COLUMN IF NOT EXISTS is_exclusive boolean DEFAULT false;


-- ============================================
-- 0004: Create Events Table
-- ============================================
CREATE TABLE IF NOT EXISTS "events" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"venue" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"featured_image" text,
	"type" varchar(100) NOT NULL,
	"need_attendance" boolean DEFAULT false NOT NULL,
	"starting_date" timestamp NOT NULL,
	"ending_date" timestamp NOT NULL,
	"allowed_members" varchar(50) NOT NULL,
	"allowed_departments" text[] DEFAULT '{}'::text[],
	"allowed_designations" text[] DEFAULT '{}'::text[],
	"notes" text DEFAULT '',
	"pr_id" varchar(191),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "events_starting_date_idx" ON "events" ("starting_date");
CREATE INDEX IF NOT EXISTS "events_type_idx" ON "events" ("type");
CREATE INDEX IF NOT EXISTS "events_created_at_idx" ON "events" ("created_at");


-- ============================================
-- 0005: Add Event URL Field
-- ============================================
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "event_url" text;
