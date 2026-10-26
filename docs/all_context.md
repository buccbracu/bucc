# BUCC Web Portal V2 - System & Codebase Context

This document provides a comprehensive overview of the architecture, database configurations, access permission hierarchies, functional workflows, and design patterns implemented in the BUCC (BRAC University Computer Club) Web Portal system.

---

## 1. Project Overview & Architecture
The BUCC Web Portal is built on a modern Next.js 16 React framework using dynamic routing and Tailwind-powered layouts. It integrates a secure, unified user database, automated onboarding mailers, a real-time visual identity broadcast configuration system, blog and press release moderation dashboards, and a showcase area for student-submitted club projects.

### Key Technology Stack
- **Framework:** Next.js 16 (using App Router, Tailwind CSS, and shadcn/ui components).
- **Authentication:** Better Auth (v1.x) with custom registration tables, password hashing, and G-Suite email pattern matching.
- **Database:** MongoDB served via Mongoose (for schemas/models) and MongoDB Native Client (for performance-critical aggregation queries).
- **State Management & Caching:** React Query (`@tanstack/react-query`) for client-side API caching and stale-time optimization.
- **Mailers:** Nodemailer dispatching system with dynamic HTML/text templates for credentials delivery.

---

## 2. Database & Connection Cache Optimization
To prevent Hot Module Replacement (HMR) from triggering connection leaks (`MongoTopologyClosedError`) in local development, and to optimize production performance, the portal implements a unified connection caching structure.

### connection Sharing Pattern
- **Mongoose Client (`src/lib/dbConnect.ts`):** Checks for a cached mongoose connection on the global context `(global as any).mongoose`. If present, it reuses the connection; if not, it instantiates it.
- **Native MongoDB Client (`src/lib/auth.ts`):** 
  - Caches the native `MongoClient` instance globally inside `(global as any)._mongoClientForBetterAuth` during local development.
  - Exports the cached `client` and `db` database connection handles.
  - **Refactoring:** All direct backend API routes (`/api/all-members`, `/api/manage-data`, `/api/member`, `/api/members`, and `/api/registration`) import the shared `db` connection from `@/lib/auth` rather than instantiating new client pools.

---

## 3. Authentication & User Schema
The user tracking structure uses a unified `User` model stored under the MongoDB `user` collection, eliminating legacy `MemberInfo` and `UserAuth` splits.

### Schema Fields
- **Basic Fields:** `name`, `email`, `emailVerified`, `image`.
- **Identity Fields:** `studentId`, `buccDepartment`, `designation`, `memberStatus` (Active, Inactive, Alumni).
- **Dynamic Profile Fields:** `profileSlug` (sparse unique index for custom portfolio URLs), `bio`, `profileImage`, `socialLinks`, `skills`.

> [!IMPORTANT]
> To prevent `E11000 duplicate key profileSlug_1` index collisions when users clear their custom profile URLs, the backend uses MongoDB's `$unset` operator to completely delete `profileSlug` from the document instead of saving it as `null` or `""`.

---

## 4. Role-Based Access Control (RBAC)
Portal permissions are structured to preserve member privacy while granting moderators complete control over data moderation.

### Access Hierarchy Matrix

| Role / Designation | Members Roster | Blogs & PRs | Project Approvals | Recruitment Evaluations |
| :--- | :--- | :--- | :--- | :--- |
| **Governing Body (GB)** | Full Access | Full Access (Approve/Delete) | Full Access (Approve/Delete) | Full Access (All candidates) |
| **Active Directors / ADs** | Departmental Access | Author-Only | Read-Only / Submit | Full Access (All candidates) |
| **Senior Executives (SE)** | **Access Denied** | Author-Only | Read-Only / Submit | **Access-Gated** (Dynamic) |
| **General Members** | **Access Denied** | **Access Denied** | Author-Only / Submit | **Access Denied** |
| **Alumni** | **Access Denied** | Author-Only | Author-Only / Submit | **Access Denied** |

### Alumni & Inactive Gating Policy
Alumni (regardless of past designations such as former Directors, Assistant Directors, or Governing Body members) and Inactive members are strictly barred from operational workflows, including viewing or accessing the Recruitment menu, candidate evaluations, pre-registrations, and onboarding management.

### Dynamic Recruitment Gating
The Governing Body can dynamically toggle Senior Executive recruitment evaluation access via the dashboard configurations.
- **Config Key:** `recruitment_config`
- **Field:** `allowSERecruitmentAccess` (boolean)
- When **enabled**:
  - Senior Executives from **any department** (e.g. Communication and Marketing) dynamically view the "Recruitment" menu options in their sidebars.
  - Page-level guards (the `withAuthorization` HOC protecting `/dashboard/recruitment/prereg` and validation inside `/dashboard/registration`) permit their access.
  - Backend API endpoints (`/api/evaluation/all`, `/api/preregmembers`, `/api/preregmembers/[id]`, and `/api/registration`) bypass department gates for Senior Executives. In onboarding tasks, they are restricted to managing candidates matching their own department.

---

## 5. Key Workflows & Features

### A. Recruitment, Evaluation & Onboarding
1. **Applicant Submission:** Public registration entries are saved as `PreRegMember` records.
2. **Reviewing Evaluations:** Active Directors and Assistant Directors across all departments, Governing Body, and permitted Senior Executives score and grade candidate profiles, saving assessment details in `EvaluationData`.
3. **Onboarding & Credential Dispatch (`/dashboard/registration`):**
   - Displays accepted candidates who do not yet have user accounts.
   - Eligible moderators input onboarding parameters (generating automatic secure passwords).
   - Upon submission, a Better Auth user profile is initialized, the pending pre-reg record is deleted, and a congratulatory credentials email is dispatched to the user.

### B. Project Showcase & Moderate (`/dashboard/projects`)
- **My Submissions Tab:** Displays student-submitted projects featuring cover images, description cards, tag badges, and live review statuses (Pending, Approved, Rejected).
- **Submit Project Form Tab:** Standardized form validating technology tags, live demo links, repository URLs, and cover images.
- **Post-Approval Editing:** Members can edit their approved projects at any time. Making any modification resets the status automatically to `"Pending"` for moderator re-review.

### C. Blogs & Press Releases Dashboards
- **Global Moderators (GB & EB):** Access all global submissions to publish, draft, or reject posts.
- **Writers & Staff (SEs, Members, Alumni):** Querying the backend routes returns only posts they authored themselves.
- **Status Filter Tabs:** Dashboard filters ("All", "Published", "Pending Approval", "Drafts") are visible to all users. They filter dynamically at the DB query level to secure personal dashboards for writers while showing global lists to moderators.

### D. Announcements Hub
- **Posting Announcements:** Strictly limited to members of the **Governing Body (GB)** (President, Vice President, General Secretary, Treasurer) and **Executive Body (EB)** (Director, Assistant Director) who have a `memberStatus` of `"Active"`. 
- **Privileges Gating:**
  - Staff (Senior Executives and Executives) and inactive/alumni members are excluded from posting or deleting announcements.
  - The "Post Announcement" modal trigger on the portal dashboard and the Broadcast Center page hides dynamically for non-authorized roles.
  - The backend endpoints `/api/announcements` enforce role and activity status verification on both `POST` and `DELETE` requests.

### E. Public Portal Enrollment (`/member-registration`)
- **Purpose:** Public enrollment staging panel for existing BUCC members or alumni who do not yet have access.
- **Design System & Performance Optimization:**
  - **Centered Card Layout:** Houses the enrollment elements inside a clean, centered layout wrapper (`max-w-3xl`) matching standard login screen aesthetics.
  - **Premium Radio Cards:** Uses custom checked cards for membership status selectors to provide descriptive cues and interactive scale transitions.
  - **Aligned Form Fields:** Implements a unified icon-in-input alignment (`pl-10`) where all Lucide support icons sit inside input and select elements.
  - **Vector Gradient Ambient Glows:** Replaces resource-heavy Gaussian CSS blur boxes (`blur-[120px]`) with smooth, browser-native `radial-gradient` glow overlays to eliminate pixelation artifacts on high-DPI mobile devices (e.g., iOS Safari/Chrome).
  - **Responsive Layout:** Uses responsive padding structures (`p-5 sm:p-8 md:p-10`) and stacking flex containers to scale layouts cleanly across small phone screens.
- **Rate Limiting Check Removed:** IP-based rate limiting was removed from `/api/member-registration` to prevent test and onboarding lockouts.

---

## 6. Constants & Schema Cleanup Rules
For design consistency and data cleanups, the following rules are enforced:
- **Designations Registry:** Removed `"Advisor"` and `"Alumni"` from the student member designations list in `designations.ts`. Alumni is strictly managed as a **Membership Status** choice.
- **Membership Statuses:** Removed `"Probation"` from the status selection lists inside member profile edit modals, leaving only Active, Inactive, and Alumni.

---

## 7. Development & Security Guidelines
1. **Security Guards:** Never trust client-side parameters. Always verify session details and execute `isGoverningBody` checks for destructive collection flushes or system-wide configurations.
2. **Next.js Params:** In server-side components, always `await params` (due to Next.js 16 requirements) to avoid asynchronous render warnings.
3. **MongoDB sparse indexes:** When making fields optional that have unique index constraints, write `$unset` updates instead of writing nulls to avoid database validation collisions.
