# API Reference

The BUCC Web Portal utilizes Next.js Route Handlers (`src/app/api/...`) to construct a secure REST API. All sensitive endpoints enforce server-side validation against both the user's session role and the global system configuration.

## System Configuration (`/api/config`)

Manages global state, including recruitment lifecycle gatekeepers and dynamic UI content like the Hero Carousel.

### `GET /api/config`
Retrieves a configuration value by key.
- **Query Params:** `?key=[config_key]` (e.g., `recruitment_config`, `hero_carousel_config`)
- **Response Example:**
  ```json
  {
    "key": "recruitment_config",
    "value": {
      "isRegistrationOpen": false,
      "registrationTargetDate": "2026-09-01T10:00"
    }
  }
  ```

### `POST /api/config`
Updates configuration. Restricted to Governing Body, HR, and R&D.
- **Payload:** `{ key: string, value: any }`
- **Security:** Checks `isGoverningBody` or `isRDAdmin` for sensitive keys.

---

## Member Showcase (`/api/projects`)

Manages the BUCC Project Showcase.

### `GET /api/projects`
- **Public:** `?status=approved` (Returns only approved projects for the gallery).
- **Featured Showcase:** `?status=approved&featured=true` (Returns only approved projects marked as featured for the landing page).
- **Admin:** Can fetch pending/rejected projects for the moderation queue.
- **Detail:** `?id=[id]` or `?slug=[slug]` fetches a single project.

### `POST /api/projects`
- **Submits a new project.**
- **Payload:** `{ title, coverImage, shortDescription, fullDescription, techStack, contributors, deploymentLink, sourceCodeLink }`
- **Auth:** Requires any active session. Admins auto-approve; members set to `pending`.

### `PATCH /api/projects`
- **Updates project content, status, or featured toggle.**
- **Payload Parameters:** Supports updating content fields (`title`, `shortDescription`, etc.), status (`approved`, `rejected`), or `isFeatured` (boolean).
- **Auth & Access Constraints:** 
  - Admins (GB/R&D AD/Directors) can edit any project content or update status.
  - Members can only edit their own `pending` projects (once approved, they cannot edit content).
  - Toggling `isFeatured` is strictly restricted to **Governing Body (GB)** and **R&D Admin** (`isSuperUser`) members. Attempting to toggle it without these roles returns `403 Forbidden`.

- **Cache Invalidation:** Any successful `POST`, `PATCH`, or `DELETE` request automatically triggers Next.js cache revalidation for the home page `/`, the gallery list page `/projects`, and the specific project slug page `/projects/[slug]` on-demand, ensuring changes are immediately reflected.

---

## Blogs (`/api/blogs` & `/api/blogs/[id]`)

Manages the BUCC Blog.

### `GET /api/blogs`
Fetches a list of blog posts.
- **Public View:** `?publicView=true` (returns only `status: "published"` blogs).
- **Dashboard View:** (Requires active session)
  - If user is GB or EB department heads (`Director` / `Assistant Director`): returns all blogs in the database.
  - If user is a regular member: returns only blogs authored by them.

### `POST /api/blogs`
Creates a new blog post.
- **Payload:** `{ title, description, featuredImage, content, category, tags, status }`
- **Auth:** Requires active session.
- **Status Gating:** 
  - If `status` is explicitly `"draft"`, saves as `"draft"`.
  - If `status` is submitted or omitted: if user is GB or EB department head, auto-publishes as `"published"`. Otherwise, sets status to `"pending"`.

### `PATCH /api/blogs/[id]`
Updates a blog post.
- **Auth:** Only author or managers (GB/EB) can edit.
- **State Restrictions:** 
  - Non-managers can only edit their own draft or pending blogs. If it is already `"published"`, edits are forbidden.
  - Non-managers can transition from `"draft"` to `"pending"`, but cannot publish directly (`status: "published"` is forbidden).
  - Managers can transition status to `"published"` (approving it) or change any content.

### `DELETE /api/blogs/[id]`
Deletes a blog post.
- **Auth:** Author (if status is `"draft"` or `"pending"`) or managers (GB/EB) can delete.

---

## Press Releases (`/api/press-releases`)

Manages the BUCC Press Releases.

### `GET /api/press-releases`
Fetches press releases.
- **Public View:** (When no authenticated session is present) returns only `status: "published"` press releases.
- **Dashboard View:** (Requires active session)
  - If user is GB or PR department heads (`Director` / `Assistant Director`): returns all press releases.
  - If user is a PR department Senior Executive (SE): returns all published press releases plus their own drafts/pending items.
  - Others: returns only published releases.
  - Detail: `?id=[id]` retrieves a single press release. If not published, requires GB/PR department membership or being the author.

### `POST /api/press-releases`
Creates a press release.
- **Payload:** `{ title, description, featuredImage, content, status }`
- **Auth:** Strictly restricted to Governing Body (GB) and PR department members (`Director`, `Assistant Director`, `Senior Executive`).
- **Status Gating:**
  - If `status` is `"draft"`, saves as `"draft"`.
  - If submitted: GB and PR department `Director`/`Assistant Director` auto-publish as `"published"`. PR department `Senior Executive` (SE) submissions are set to `"pending"`.

### `PATCH /api/press-releases`
Updates a press release.
- **Query Params:** `?id=[id]`
- **Auth:** GB or PR department members (`Director`, `Assistant Director`, `Senior Executive`).
- **State Restrictions:**
  - Non-managers (PR SE) can only edit their own drafts or pending releases.
  - Managers (GB, PR Directors) can edit any release or update its status to `"published"` (approving it).

### `DELETE /api/press-releases`
Deletes a press release.
- **Query Params:** `?id=[id]`
- **Auth:** PR department SE can delete their own drafts or pending releases. GB and PR Directors can delete any.

---

## Public Contact (`/api/inquiries`)

Manages messages submitted from the public `/contact` page.

### `POST /api/inquiries`
Submits a new message.
- **Payload:** `{ name, email, subject, message }`
- **Auth:** Public.

### `GET /api/inquiries`
Fetches all inquiries.
- **Auth:** Strictly restricted to GB, HR Heads, and R&D Heads.

### `PATCH /api/inquiries`
Updates inquiry status to `read` or `archived`.
- **Auth:** Restricted to GB, HR Heads, and R&D Heads.

### `DELETE /api/inquiries`
Permanently deletes an inquiry.
- **Auth:** Strictly restricted to Governing Body (GB) only.

---

## Communications (`/api/announcements` & `/api/global-banner`)

### `POST /api/announcements`
Broadcasts a new internal notice to member dashboards.
- **Payload:** `{ title: string, content: string }`
- **Auth:** Requires EB or GB session.

### `POST /api/global-banner`
Updates the public-facing alert bar. Uses upsert logic to maintain a singleton record.
- **Payload:** `{ message: string, link: string, isActive: boolean }`
- **Auth:** Strictly GB only.

---

## Member Management (`/api/member`)

### `GET /api/member`
Retrieves a member's complete database profile.
- **Query Params:** `?id=[userId]`
- **Auth:** Restricted to GB, or HR department heads.

### `PATCH /api/member`
Updates a member's profile fields.
- **Query Params:** `?id=[userId]`
- **Payload:** `{ phoneNumber, personalEmail, bio, cvLink, profileSlug, isPublicProfile, coverImage, memberSkills, memberSocials, ... }`
- **Security & Authorization:**
  - Self-update permitted: Users can update their own profiles (`currentUser.id === memberID`).
  - Administrative Bypass: Governing Body (GB) and HR Department Heads can update administrative fields (`name`, `studentId`, `buccDepartment`, `bracuDepartment`, `designation`, `memberStatus`, `joinedBracu`, `joinedBucc`, `lastPromotion`).
  - Sanitize Payload: If a non-admin user attempts self-update, the server explicitly deletes administrative fields to prevent elevation of privilege. `_id`, `email`, and `emailVerified` are always stripped.
- **Profile Slug Validation:**
  - Regex: Must match `/^[a-zA-Z0-9-]+$/` (alphanumeric and hyphens only).
  - Reserved list validation: Cannot match routing reserved terms (e.g. `api`, `dashboard`, `login`, `about`, `people`, `m`).
  - Uniqueness constraint checked against MongoDB indices.

### `DELETE /api/member`
Permanently deletes a member's record.
- **Query Params:** `?id=[userId]`
- **Auth:** Strictly restricted to Governing Body (GB) and HR Department Heads.

---

## Recommendations & Testimonials (`/api/testimonials`)

### `POST /api/testimonials`
Writes a recommendation for a member.
- **Payload:** `{ targetMember: string, relationship: string, content: string }`
- **Auth:** Restricted to Executive Body (EB) members, and Alumni.
- **Rules:** The recipient must exist. Default moderation flag `isApproved` is set to `true`.

### `DELETE /api/testimonials`
Removes a recommendation.
- **Query Params:** `?id=[testimonialId]`
- **Auth:** Restricted to the recommendation's author, or Governing Body (GB) admins.

---

## Recruitment Intake (`/api/preregister` & `/api/evaluation`)

### `POST /api/preregister`
Submits a new membership application.
- **Validation:** 
  1. Checks if `email` matches `*@g.bracu.ac.bd`.
  2. **Server-Side Gate:** Fetches `recruitment_config`. If `isRegistrationOpen` is false, immediately returns `403 Forbidden` with the custom `registrationMessage`.

### `POST /api/evaluation`
Submits the written assessment.
- **Validation:** 
  1. **Server-Side Gate:** Checks `isEvaluationOpen` from config. Returns `403` if closed.
- **Data Shape:** Extracts essential metadata (studentId, name, email) and stores the dynamic questionnaire answers in the `responseObject` field.

---

## File Uploads (`/api/upload`)

Restricted image uploading endpoint utilizing Cloudinary integration.

### `POST /api/upload`
Uploads a local image file to Cloudinary.
- **Query Params:** `?type=[profile | cover | carousel]`
  - `profile`: Uploads to the `bucc-profiles` folder.
  - `cover`: Uploads to the `bucc-covers` folder.
  - `carousel`: Uploads to the `bucc-carousel` folder.
  - *(Default)*: Uploads to the `bucc-blogs` folder (legacy/internal editor uploads).
- **Constraints & Rules:**
  - **Allowed Mime Types:** `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`, `image/jpg`.
  - **Size Limit:** Maximum file size is 5MB.
  - **Scope Policy:** Direct file upload interfaces are restricted strictly to:
    - User Profile Photo uploads
    - User Public Profile Cover Photo uploads
    - Dashboard Banner / Hero Carousel uploads
  - All other image fields (such as Event featured images, Blog cover images, Project cover images, and Press Release cover images) and rich-text inline editor images must be embedded via URL instead of being directly uploaded.
 
---
 
## Analytics Tracking (`/api/analytics/track`)
 
Processes page views and unique traffic counts dynamically on landing page hits.
 
### `POST /api/analytics/track`
Logs a visit for traffic statistics.
- **Payload:** `{ path: string }`
- **Security:** Casts IP request fields safely. Automatically extracts connection IPs via headers fallback (`x-real-ip`, `x-forwarded-for`) and dynamically increments page views and unique daily IPs.
 
---
 
## Data Management & Metrics (`/api/manage-data`)
 
Administrative tools to fetch club demographics, site traffic logs, and perform data flushes.
 
### `GET /api/manage-data`
Retrieves aggregated statistics and chart logs for traffic and demographics.
- **Auth:** Restricted to Governing Body (GB) and R&D Leadership.
- **Returns:**
  - `metrics`: Count card statistics.
  - `demographics`: Dynamic horizontal breakdown calculations. Excludes GB members, and aggregates Alumni under a unified segment.
  - `traffic`: Sorted page views and unique visitor plots mapped by day, month, or year.
 
### `DELETE /api/manage-data`
Performs a destructive wipe of recruitment registration and evaluation collections.
- **Payload:** `{ collectionName: string }` (Must match `"recruitment_all"`)
- **Security:** Restricted to Governing Body (GB) and R&D Leadership. Enforces a case-insensitive, whitespace-trimmed verification check to prevent accidental flushes while remaining user-friendly.


---

## Recruitment Operations & Pre-Reg APIs

### `GET /api/evaluation/all`
Fetches all candidate evaluation records.
- **Auth:** Active Governing Body (GB) and Executive Body (EB - Directors & Assistant Directors) from **all departments**, or Senior Executives if `allowSERecruitmentAccess` is active.
- **Restrictions:** Alumni and Inactive members are strictly barred (`401 Unauthorized`).

### `GET /api/preregmembers`
Fetches all pre-registered applicant profiles.
- **Auth:** Active Governing Body (GB) and Executive Body (EB - Directors & Assistant Directors) across all departments.
- **Restrictions:** Alumni and Inactive members are strictly barred (`401 Unauthorized`).

### `PATCH /api/preregmembers/[id]`
Updates an applicant's pre-registration data.
- **Auth:** Active Governing Body (GB) and Executive Body (EB - Directors & Assistant Directors).

---

## Member Portal Registration (`/api/member-registration`)

### `POST /api/member-registration`
Submits a self-registration application for existing BUCC members and alumni.
- **Validation:**
  - Mandatory fields check (name, email, password, studentId, phoneNumber, buccDepartment, bracuDepartment, designation, memberStatus).
  - Student ID format: 8 or 10 numeric digits.
  - Email: Active members require `@g.bracu.ac.bd`; Alumni can use personal email.
  - Honeypot protection: Silently discards bot submissions filling `academicWebsite`.
  - Rate limiting: Removed to permit frictionless bulk registrations.
- **Output:** Staged in `PendingMember` with symmetrically encrypted password awaiting administrative review.

---

### Waiting Room Endpoints

#### `GET /api/recruitment/waiting-room`
- **Auth:** Active GB, EB of all departments, permitted Senior Executives, or assigned desk coordinators.
- **Output:**
  ```json
  {
    "candidates": [
      {
        "_id": "67... ",
        "studentId": "22101045",
        "name": "Jane Doe",
        "buccDepartment": "Creative",
        "waitingRoomStatus": "Waiting",
        "waitingRoomCheckedInAt": "2026-10-27T02:00:00.000Z"
      }
    ],
    "permissions": {
      "canModify": true,
      "canManageCoordinators": true
    }
  }
  ```

#### `POST /api/recruitment/waiting-room`
- **Auth:** Desk coordinators, GB, R&D EB, HR EB (`canModify: true`).
- **Body:** `{ "studentId": "22101045" }`
- **Output:** Checked in candidate document, or error `EVALUATION_MISSING` if online evaluation was not submitted.

#### `PATCH /api/recruitment/waiting-room`
- **Auth:** Desk coordinators, GB, R&D EB, HR EB (`canModify: true`).
- **Body:** `{ "evaluationId": "...", "status": "Waiting" | "Sent to Board" | "remove" }`
- **Output:** Success confirmation and updated candidate record.

#### `GET & POST /api/recruitment/waiting-room/coordinators`
- **Auth:** Strictly Governing Body (GB), R&D EB, and HR EB.
- **Body (POST):** `{ "assignedCoordinators": ["22101045", "23101011"] }`
- **Output:** Array of assigned student IDs stored in `AppConfig` (`waiting_room_config`).
