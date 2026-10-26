# System Architecture

## Overview
The BUCC portal leverages a modern, server-rendered React architecture powered by Next.js 16 (App Router). It is designed to be highly responsive for public users while providing a secure, data-rich environment for club leadership.

## Core Stack
- **Frontend/Backend:** Next.js 16 (React 19, TypeScript)
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** Better Auth (MongoDB Adapter)
- **State Management:** TanStack Query v5
- **Styling:** Tailwind CSS

---

## Data Models & Schema Structure
The portal utilizes several core schemas to manage its ecosystem. All collections are defined in [src/model](file:///C:/Users/Abir/Desktop/bucc-main/src/model).

### The Unified `User` Model ("One Source of Truth")
Unified identity and profile storage in a single collection.
- **File:** [src/model/User.ts](file:///C:/Users/Abir/Desktop/bucc-main/src/model/User.ts)
- **Core Identity (Immutable by user):**
  - `name`, `email` (G-Suite strictly enforced)
  - `studentId`, `buccDepartment`, `designation`, `memberStatus` (`Active`, `Inactive`, `Alumni`)
- **Personal & Public Profile Details (Mutable via Dashboard):**
  - `phoneNumber`, `personalEmail`, `memberSkills`, `memberSocials`
  - `profileSlug`: Unique, lowercase URL identifier.
  - `isPublicProfile`: Boolean toggle to opt-in/out of directory.
  - `bio`: Short biography text.
  - `cvLink`: URL to external CV.
  - `coverImage`: URL to profile banner.
  - `experience`, `education`, `achievements`, `certifications`, `recentActivity`: Markdown sections for detailed profiles.
- **Privacy Visibility Toggles:**
  - `showPersonalEmail`, `showPhoneNumber`, `showProjects`, `showBlogs`, `showTestimonials`, `showExperience`, `showEducation`, `showAchievements`, `showCertifications`, `showRecentActivity`, `showGithubStats`.

### `Testimonial` Model (Recommendations)
Stores peer recommendations written by senior members and alumni.
- **File:** [src/model/Testimonial.ts](file:///C:/Users/Abir/Desktop/bucc-main/src/model/Testimonial.ts)
- **Fields:**
  - `author`: Reference to the writing [User](file:///C:/Users/Abir/Desktop/bucc-main/src/model/User.ts).
  - `targetMember`: Reference to the target [User](file:///C:/Users/Abir/Desktop/bucc-main/src/model/User.ts).
  - `relationship`: Designation/context of recommendation (e.g. "Director of R&D").
  - `content`: Testimonial narrative text.
  - `isApproved`: Moderation visibility toggle.

### `Project` Model (Member Showcase)
Stores technical projects submitted by members.
- **File:** [src/model/Project.ts](file:///C:/Users/Abir/Desktop/bucc-main/src/model/Project.ts)
- **Fields:**
  - `title`, `coverImage`, `slug`
  - `shortDescription`, `fullDescription` (Stored as BlockNote JSON)
  - `techStack`, `deploymentLink`, `sourceCodeLink`
  - `status`: `pending`, `approved`, `rejected`
  - `author` (User Ref), `contributors` (Array of User Refs)
  - `isFeatured`: Boolean toggle (Featured project status on homepage)
  - `lastEditedBy` (Admin Ref)

### `Inquiry` Model (Public Contact)
Handles messages submitted via the public `/contact` form.
- **File:** [src/model/Inquiry.ts](file:///C:/Users/Abir/Desktop/bucc-main/src/model/Inquiry.ts)
- **Fields:**
  - `name`, `email`, `subject`, `message`
  - `status`: `unread`, `read`, `archived`

### `Blog` Model (Member Writings)
Stores articles and tutorials written by members.
- **File:** [src/model/Blog.ts](file:///C:/Users/Abir/Desktop/bucc-main/src/model/Blog.ts)
- **Fields:**
  - `title`, `description`, `featuredImage`
  - `content`: Rich text (Stored as BlockNote JSON)
  - `category`, `tags`
  - `author`: Ref data representing the writing user (name, designation, department, email, ID)
  - `status`: `"draft"`, `"pending"`, `"published"`

### `PressRelease` Model (Official Announcements)
Stores official statements published by the PR department.
- **File:** [src/model/PressRelease.ts](file:///C:/Users/Abir/Desktop/bucc-main/src/model/PressRelease.ts)
- **Fields:**
  - `title`, `description`, `featuredImage`
  - `content`: Rich text (Stored as BlockNote JSON)
  - `status`: `"draft"`, `"pending"`, `"published"`
  - `author`: Ref data representing the writing user (name, designation, department, email, ID)

---

## Role-Based Access Control (RBAC)
Authorization is resolved via `src/lib/permissions.ts` based on `buccDepartment` and `designation`.

### Tiers & Capabilities
1. **Governing Body (GB):** 
   - *Capabilities:* Global flush rights, site-wide banner management, cross-department visibility, recruitment gating. Can manage Projects and Inquiries (Full CRUD).
2. **Executive Body (EB - Directors & Assistant Directors across All Departments):**
   - *Capabilities:* Full access to the Recruitment Portal (Pre-Reg Members, Evaluations, and candidate task assessment workspace across all departments). Manage members and onboard accepted applicants within their assigned departments. Broadcast internal notices. PR heads can manage press releases; Event Management heads can manage events.
3. **Senior Executives (SE):**
   - *Capabilities:* Author blogs and PRs. Dynamic recruitment moderation when `allowSERecruitmentAccess` is enabled by GB.
4. **General Member:**
   - *Capabilities:* View personal dashboard, access ID card, edit personal profile, configure public portfolio, submit projects.
5. **Alumni & Inactive Members:**
   - *Restrictions:* Strictly prohibited from accessing operational modules (Recruitment, Pre-Reg, Evaluations, Onboarding, Announcements posting). Access limited to personal public portfolio, submitting personal projects, and writing blogs.

---

## Route Handling & Composition

The system utilizes Next.js App Router dynamic paths to separate private administration panels from public-facing directory listings.

### 1. Public Routing Space
- **Members Directory (`/people`):** Implemented in [src/app/(main)/people/page.tsx](file:///C:/Users/Abir/Desktop/bucc-main/src/app/(main)/people/page.tsx). Fetches users matching `isPublicProfile: true` and serializes them for the search grid.
- **Dynamic Member Profiles (`/m/[slug]`):** Implemented in [src/app/(main)/m/[slug]/page.tsx](file:///C:/Users/Abir/Desktop/bucc-main/src/app/(main)/m/[slug]/page.tsx). A server component that dynamically constructs individual portfolio layouts, handling data aggregation (projects, blogs, testimonials) and generating contextual metadata.

### 2. Private Dashboard Settings Space
- **Public Profile Configuration (`/dashboard/public-profile`):** Implemented in [src/app/(portal)/dashboard/public-profile/page.tsx](file:///C:/Users/Abir/Desktop/bucc-main/src/app/(portal)/dashboard/public-profile/page.tsx). Houses self-service configurations allowing users to claim slugs, upload cover assets, format biography modules, and toggle individual details/section visibility.

---

## Technical Guidelines & Configurations

### 1. Defensive Mongoose Schema Hydration
Because Next.js routing compiles and loads bundles dynamically on-demand, running queries with Mongoose `.populate("relation")` before the related schema's file has been parsed by Node.js can cause a `MissingSchemaError`.
* **Fix & Rule:** Any schema file that defines a relationship referencing another model (e.g. referencing `User` model via `ref: "User"`) must explicitly import that related schema file at the top of its model definition.
* **Example:** In [src/model/Project.ts](file:///C:/Users/Abir/Desktop/bucc-main/src/model/Project.ts), [src/model/Blog.ts](file:///C:/Users/Abir/Desktop/bucc-main/src/model/Blog.ts), and [src/model/Testimonial.ts](file:///C:/Users/Abir/Desktop/bucc-main/src/model/Testimonial.ts), we include `import "./User";` to guarantee registration.

### 2. Theme Configuration (Default Dark Mode)
The portal supports light and dark themes using `next-themes`.
* **Default Theme:** Configured to load **Dark Mode by default** for first-time visitors in [src/util/Providers.tsx](file:///C:/Users/Abir/Desktop/bucc-main/src/util/Providers.tsx) using the `defaultTheme="dark"` parameter.
* **Hydration Warnings:** Bypassed on the root root element via `suppressHydrationWarning` in [src/app/layout.tsx](file:///C:/Users/Abir/Desktop/bucc-main/src/app/layout.tsx).

### 3. Database Seeding
To populate realistic test data (such as mock projects) during local development:
* **Project Seeding Script:** Located at `scripts/seed-projects.js`.
* **Execution:** Run `node scripts/seed-projects.js` from the workspace root (requires a populated `.env` with `MONGODB_URI` and `MONGODB_DB`). This will check database connectivity, verify existing user references, delete previous seed elements, and upload 3 fully formatted approved/featured projects.

### 4. Caching & Revalidation Policy
To ensure fast loading times and reduce database load, public-facing pages utilize Incremental Static Regeneration (ISR) and on-demand cache revalidation:
* **Home Page (`/`):** Uses an ISR fallback timer (`export const revalidate = 3600;` - 1 hour) to regularly refresh events and featured projects.
* **On-Demand Cache Purging:** Successful CRUD actions (creation, edit, deletion) on resources like projects via API routes call `revalidatePath` for the home page `/`, listings `/projects`, and specific details `/projects/[slug]` to instantly invalidate the cache and make updates live.
* **Manual Refresh:** Pages such as `/projects` include a `RefreshButton` component that calls a server action triggering `revalidatePath` for public views.

### 5. Media Management & Photo Upload Scope
To control storage constraints and maintain database health, the platform divides image handling into two categories:
* **Allowed Uploads:** Direct local file upload is exclusively enabled for User Profile Photos, User Public Profile Cover Photos, and the Admin Carousel background slides.
* **Embed Only:** All other cover images (Blogs, Events, Projects, Press Releases) are URL text fields (embedding). Additionally, the inline rich-text editor (BlockNote) rejects direct file uploads (raising an alert toast) to force URL embeds and prevent database bloat from base64 files.

### 6. User Experience & Session Resiliency
* **Logout Resiliency:** The `/logout` page handles Client-Side Sign-Out and redirects to the home page `/` immediately on response. It features a `1.5-second` fallback timer to force redirection even if the session api hangs due to slow network connections.
* **Predefined Select Inputs:** Fields that must be sanitized (such as Blood Group and Gender) use select dropdown components (restricting values to standard groups like `A+`, `A-`, etc.) to prevent malformed text inputs in the member directory.

