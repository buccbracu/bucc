# BUCC Web Portal - Definitive Project Documentation

**Date:** June 15, 2026  
**Status:** v2 Advanced Rebuild / Feature Implementation Phase  

This document serves as the foundational technical guide for the BRAC University Computer Club (BUCC) Web Portal. It covers the full architectural stack, implementation details, and development standards.

---

## 1. Project Overview
The BUCC Web Portal is a comprehensive platform designed to manage club operations, showcase public activities (events, blogs, press releases), and provide an internal dashboard for members and leadership. It serves two primary audiences:
- **Public:** Prospective members, current students, and university faculty.
- **Internal:** Registered club members and the Governing Body.

### Design Mandate: Anthropic Minimalist
- **Visuals:** Monochrome-focused, sharp borders, high whitespace.
- **Typography:** Serif headings for authority, Sans-serif for data.
- **Interactivity:** Subtle transitions, grayscale-to-color hovers, no bouncy animations.

---

## 2. Technical Stack

### Core Frameworks
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack).
- **Library:** [React 19](https://react.dev/).
- **Language:** TypeScript (Strict Mode).

### Data & Persistence
- **Database:** MongoDB.
- **ORM/ODM:** [Mongoose](https://mongoosejs.com/) (Master ODM for structured models).
- **Direct Driver:** `mongodb` (primarily for Better Auth adapter integration).

### Authentication & Authorization
- **Auth Provider:** [Better Auth](https://better-auth.com/) with MongoDB Adapter.
- **Data Unity:** Mongoose `User` model and Better Auth both target the singular **`user`** collection.
- **Authorization:** Role-Based Access Control (RBAC) defined in `src/lib/permissions.ts`.

### Styling & UI
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Anthropic Minimalist Design).
- **Theming:** `next-themes` (v0.4.4+ for React 19 compatibility).
- **Animations:** [Framer Motion](https://www.framer.com/motion/).
- **Icons:** [Lucide React](https://lucide.dev/).
- **Components:** Radix UI primitives and custom-built minimalist components (e.g., `MultipleSelector`).

### Infrastructure & Tools
- **Media Storage:** [Cloudinary](https://cloudinary.com/).
- **Form Handling:** TanStack Form & Zod.
- **Data Fetching:** TanStack Query (React Query) v5.
- **Logging:** Local `debug.log` and standard console streams.

---

## 3. Directory Structure

```text
C:\Users\Abir\Desktop\bucc\
â”œâ”€â”€ public/                # Static assets
â”‚   â”œâ”€â”€ assets/            # Official SVGs (bucc-logo.svg, bucc-icon.svg)
â”‚   â””â”€â”€ images/            # Department, events, and people photos
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app/               # Next.js App Router (Routing & Pages)
â”‚   â”‚   â”œâ”€â”€ (main)/        # Public routes (Homepage, Blogs, Events, Publications)
â”‚   â”‚   â”œâ”€â”€ (portal)/      # Internal dashboard (Members, Broadcast, Manage Data)
â”‚   â”‚   â””â”€â”€ api/           # Backend API handlers (Config, Auth, Member)
â”‚   â”œâ”€â”€ components/        # Reusable UI components
â”‚   â”‚   â”œâ”€â”€ ui/            # Basic primitives & Announcement Bar
â”‚   â”‚   â”œâ”€â”€ portal/        # Dashboard specific modules (Profile, Broadcast)
â”‚   â”‚   â””â”€â”€ home/          # Public landing page sections
â”‚   â”œâ”€â”€ constants/         # Static data (Executive Body, Skills, Departments)
â”‚   â”œâ”€â”€ helpers/           # Utility functions (Mailer, Config Store)
â”‚   â”œâ”€â”€ lib/               # Core configurations (Auth, DB, Permissions)
â”‚   â”œâ”€â”€ model/             # Mongoose schemas (User, GlobalBanner, Event, etc.)
â”‚   â”œâ”€â”€ schemas/           # Zod validation schemas
â”‚   â”œâ”€â”€ types/             # Global TypeScript definitions
â”‚   â””â”€â”€ util/              # Shared providers and context wrappers
â”œâ”€â”€ next.config.mjs        # Next.js configuration
â”œâ”€â”€ tailwind.config.ts     # Tailwind theme and plugin setup
â””â”€â”€ package.json           # Dependencies and scripts
```

---

## 4. Core Architecture

### Database (MongoDB + Mongoose)
- **Connection:** Handled via `src/lib/dbConnect.ts` with connection pooling and graceful shutdown.
- **The "One Source of Truth" Model:** We have unified Member Profiles and Authentication into the singular **`user`** collection.
  - **System Managed:** Name, Email (G-Suite), Student ID, BUCC Department, Designation.
  - **Personal Details:** Phone, Personal Email, Emergency Contact, Blood Group, Socials, Skills.
  - **Auth Integration:** Mirrored Better Auth schema with 15+ custom BUCC fields.
- **Development Client Caching:** Implements a global cache registry for `MongoClient` in development mode inside `src/lib/auth.ts` to prevent Turbopack hot-reloads from leaking connections and triggering `MongoTopologyClosedError` errors.

### Recruitment Gatekeeper System
- **Master Config:** `AppConfig` model manages `isRegistrationOpen` and `isEvaluationOpen` states.
- **Server-Side Gating:** All recruitment POST APIs verify gating status before processing.
- **Public Placeholders:** `IntakeInactive` component displays custom closure messages and live countdown timers.

### Hierarchical Access Control (RBAC)
- **Logic:** Centralized in `src/lib/permissions.ts`.
- **Governing Body (GB):** Global visibility. Access to Data Hub, Global Alerts, and Recruitment Toggles.
- **Directors/ADs:** Departmental silos. Manage members within their own department.
- **EB (Senior/Executive):** Access to internal Announcements and PR tools.
- **General Member:** Access to personal profile and ID card.

---

## 5. Feature Implementation Details

### Communications Command Center
- **Broadcast Center (`/dashboard/broadcast`):** Unified portal for administrative alerts.
  - **Global Announcement Bar:** GB-controlled inverted-color banner (`bg-foreground text-background`) at the top of all public pages. Supports session-aware dismissal.
  - **Member Notices:** Real-time internal broadcasting with history management and GB delete powers.
  - **Recruitment Pulse:** Real-time toggles for Registration and Evaluation with customizable countdowns.

### Official Branding Logic
- **Theme Awareness:** Uses `dark:invert dark:hue-rotate-180` to preserve the official **BUCC Blue** color in dark mode while ensuring high-contrast visibility.
- **Asset Distribution:** 
  - **Full Logo:** Used in public Navbar for authority.
  - **Icon:** Used in Sidebar and recruitment placeholders for professional minimalism.

### Public Events Hub
- **Categorization:** Automatically splits events into **Upcoming** (High visibility, Color) and **Past Archive** (Grid-based, Grayscale) based on live clock data.
- **Sorting:** Upcoming (Soonest first), Past (Most recent first).
- **Asset Uploads:** Event forms support direct file uploads (via Cloudinary) alongside URL embedding. Whitelists ImgBB and Imgur domains for secure remote rendering.
- **Organizer Workflow:** Supports custom attendance tracking requirements (`needAttendance`) and internal coordinator guidelines (`notes`) displayed directly on admin cards.

### Profile & Settings
- **Strict Data Gating:** Official records (Name, ID, Dept, Join Dates) are **Read-Only** for members to maintain data integrity.
- **Input Refetch Fix:** Verifies state presence (`if (user && !formData)`) before populating inputs to block background session refreshes from overwriting unsaved inputs.
- **Structured Fields:** Converts the free-text Gender input to a structured select dropdown (Male, Female, Other).
- **Photo Workflow:** "Select -> Preview -> Confirm & Save" sequence integrated with Cloudinary via internal upload APIs.
- **Public Profile tabbed UI ([PublicProfileSettings.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/portal/settings/PublicProfileSettings.tsx)):** Organizes settings into three tabs: Basic Info (slug, resume link, cover upload, bio), Rich Content (Markdown textareas for education, experience, achievements, certifications), and Section Visibility Controls (detailed toggle checkboxes).
- **Member Portal Registration (/member-registration):** Provides signup for existing BUCC members and alumni. Fields are conditionally restricted based on membership type (Active/Alumni) and position tier (Governing Body/Department). Saves requests in a temporary MongoDB collection with symmetrically encrypted passwords.
- **Profile Slug Uniqueness Index Fix:** Replaced storing empty slugs as `null` with MongoDB's `$unset` operator in `src/app/api/member/route.ts` to delete the field, preventing duplicate key `E11000` errors on sparse indexes when multiple users have blank custom URLs.

### Public Pages & Presentation
- **Cinematic Preloader & Session Cache ([Preloader.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/public/Preloader.tsx)):** Runs a global preloader featuring a white logo variant, sequential typewriter rendering of the motto "UPGRADE" and "YOURSELF.", and a 1-100% linear loading line. Toggles `sessionStorage` caching to skip the animation on subsequent visits for instant rendering.
- **Hero Section:** Dynamically configurable from the dashboard. Overlaps with an **Auto-hide Navbar** (glassmorphism effect in both themes) for an immersive full-screen experience. Includes the WebGL Spline 3D canvas on desktop, falling back to static columns on mobile.
- **Project Showcase (`/projects`):** A high-end gallery for member projects. Features a cinematic detail view utilizing read-only `BlockNote` for rich case studies and strict external-link validation for assets.
- **Publications (`/blogs`, `/publications/press-releases`):** Premium, card-based grids with split-layout detail pages (Cover image top, Title/Content left, Summary/Related right). Press release cover photos display in full color by default on page load.
- **About BUCC (`/about`, `/history`, `/advisors`):** Comprehensive public documentation of the club's 2001 legacy, core values, mission, structured ecosystem, and faculty leadership.
- **Contact & FAQ (`/contact`, `/faq`):** Interactive contact form linking directly to the backend Inquiry system. Animated accordion FAQ page built with `framer-motion`.

### Internal Operations & Management
- **Collapsible Sidebar Layout ([Sidebar.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/Sidebar.tsx) and [layout.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/layout.tsx)):** Supports desktop-collapse toggling next to branding text (adjusting width between `w-64` and `w-16` smoothly), hiding text labels, centering nav icons, auto-expanding on click, and rendering tooltips on hover. Includes right-aligned user details in layout header.
- **Inquiry Management (`/dashboard/inquiries`):** Secure dashboard for GB, HR, and R&D to read, archive, and delete messages submitted via the public contact form.
- **Project Moderation & Submission Hub (`/dashboard/projects`):** Dual-path system. Redesigned the member submission page (`submit/page.tsx`) to feature a tabbed view: "My Submissions" (listing all of their projects, pending and approved, with cover images, tech stack, and live status badges) and "Submit Project Form". Authors are permitted to edit their approved projects at any time; editing resets the project's status back to `"pending"` for moderator re-review. The GET listing endpoint (`api/projects`) is updated to fetch all statuses (instead of only approved) when a user queries their own projects.
- **Blogs and Press Releases Dashboard & API Scoping:** Gated backend queries for blogs and press releases so that non-moderator staff writers (like Senior Executives) only retrieve the posts they wrote. Restored the status filter tabs ("All", "Published", "Pending Approval", "Drafts") on both dashboard views for all users. These tabs now naturally filter the user's own submissions for regular writers, and moderate all global submissions for Governing Body (GB) and Executive Body (EB) moderators.
- **Visual Identity Config (`/dashboard/broadcast/hero-config`):** GB and R&D can manage the homepage Hero Carousel slides via a drag-and-drop interface, updating the public site in real-time.
- **System Metrics & Charts:** Member Demographics are displayed as a horizontal bar breakdown (replacing the buggy SVG donut chart). Excludes Governing Body members from active demographics metrics, groups non-Governing-Body Alumni together under a unified `"Alumni"` segment, and lists specific sub-statistics.
- **Destructive Data Flush Guard ([manage-data/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/manage-data/page.tsx)):** Verifies flush inputs case-insensitively and trims whitespace (e.g. matching `recruitment_all `) to prevent collection wipe mismatches.
- **Member Registration Approvals:** Adds a 'Pending Registrations' tab inside the Members Directory. Displays requests with live notification bubbles to eligible reviewers (Active Directors/ADs for departmental members; Governing Body/R&D for alumni; superAdmin for anyone). Reviews open a sheet drawer allowing editing of all details before approving (which registers the user in Better Auth and drops the pending record) or rejecting.
- **Designations List Cleanup:** Removed `"Advisor"` and `"Alumni"` designations from the global designations constant registry (`designations.ts`), excluding advisors (faculty members) and alumni status definitions from student member designations dropdowns (such as edit and approval dialogs), while keeping Alumni as a core membership status dropdown choice.
- **Probation Membership Status Removal:** Removed the `"Probation"` choice from the member status dropdown inside the profile edit modal (`MemberEditDialog.tsx`), limiting official status configurations to Active, Inactive, and Alumni.
- **Dynamic Recruitment Gating for Senior Executives:** Integrated dynamic checks on `allowSERecruitmentAccess` configuration within the sidebar component (`Sidebar.tsx`), page-level guards (`withAuthorization.tsx` and `registration/page.tsx`), and the backend evaluation/pre-registration/onboarding APIs (`api/evaluation/all`, `api/preregmembers`, and `api/registration`). When toggled on by the Governing Body, Senior Executives from any department (including Communication and Marketing) will dynamically see the recruitment option menu in their portal sidebar and have full authorization to view, evaluate, and onboard member accounts under their respective departments.
- **MongoClient Connection Pooling sharing:** Consolidated all native driver MongoDB queries to utilize the globally cached client and database instances exported from `src/lib/auth.ts`. Avoided redundant module-level `new MongoClient` instances across REST API routes, solving database connection spikes and ensuring zero leakage during local development (HMR) rebuilds.
- **Announcement Gating Restructuring:** Gated backend and frontend announcement posting privilege strictly to active Governing Body (GB) and Executive Body (EB) members, ensuring other staff roles (such as Senior Executives and Executives) or inactive members cannot post or delete announcements.
- **TypeScript Strict Mode Mappings:** Explicitly typed arrow callback arguments in MongoDB native `.map()` statements to satisfy strict type verification checks during compilation.
- **Member Registration Page Mobile Design Polish:** Optimized the mobile display of `member-registration/page.tsx` by replacing performance-heavy CSS blur filter boxes (which rasterize blocky/pixelated artifacts on iOS Safari and mobile Chrome) with smooth `radial-gradient` backgrounds. Upgraded radio buttons to premium checkable cards, placed helper icons inside input/select fields with uniform `pl-10` padding, and introduced fluid micro-interactions.
- **Welcoming Preloader Screen Polish:** Redesigned the entrance preloader overlay (`Preloader.tsx`) to support smooth opacity fade-out exits. Relocated the loading percentage text into a giant counter in the bottom-right corner. Replaced static glows with a dynamic light sheen sweep animation that runs a diagonal white sheen sweep across the SVG-masked logo paths and a text-shimmer gradient sweep across the "Upgrade Yourself" motto on a loop (3.2 seconds duration with a built-in pause delay). Mounted it locally on `page.tsx` instead of `layout.tsx` to scope the preloader purely to the homepage route (`/`).
- **Above-The-Fold Image Loading Priority:** Marked the persistent navigation header logo `Image` component (`Navbar.tsx`) with the `priority` attribute. This forces eager loading and high fetch priority, resolving the Chromium console intervention warning regarding lazy-loaded images in the initial viewport.
- **Static Caching of Default Hero Slides:** Saved the 3 default Unsplash banner images locally inside the `/public/images/` assets directory and updated the `HeroCarousel.tsx` default state properties to use static `/images/hero-slide-*.jpg` paths. This eliminates dependency on remote Unsplash domains during public layout paint passes.
- **Mobile Gating for Spline 3D Scene Loads:** Disabled the dynamic `@splinetool/react-spline` 3D canvas loader on screen widths `< 1024px` (`isMobile`). Bypasses network downloads of large `.splinecode` scenes and WebGL allocation to ensure a lightweight 60fps experience on mobile devices.
- **Universal Executive Body (EB) Recruitment Access:** Expanded recruitment access from previously hardcoded departments (HR, R&D, GB) to active Directors and Assistant Directors of ALL club departments (Event Management, Creative, Finance, Communication & Marketing, Press Release & Publications, Human Resources, Research & Development). Updated `Sidebar.tsx`, `withAuthorization.tsx`, `hasAuth.ts`, `api/evaluation/all`, `api/preregmembers`, `api/registration`, and `evaluation-assessment.tsx` so all active EBs possess equal viewing, moderation, and task assignment capabilities matching R&D EB.
- **Strict Multi-Factor Alumni Gating:** Hardened Alumni exclusion across all portal management interfaces and APIs. Built a case-insensitive validator (`user.memberStatus?.toLowerCase() === "alumni" || user.designation?.toLowerCase() === "alumni" || (user.memberStatus && user.memberStatus?.toLowerCase() !== "active")`) ensuring former Directors and Assistant Directors who have transitioned to Alumni or Inactive status cannot view or interact with the Recruitment menu, candidate evaluations, pre-registrations, or onboarding workflows.
- **Member Registration Rate Limiting Removal:** Removed the IP-based 429 rate limiter from `src/app/api/member-registration/route.ts` to support seamless onboarding and batch enrollment without connection lockouts.
- **Senior Executive Recruitment Evaluator Parity & Dynamic Interviewers List:** In the candidate evaluation assessment workspace (`evaluation-assessment.tsx`), Senior Executives receive full evaluator privileges identical to Directors and Assistant Directors when `allowSERecruitmentAccess` is active (unlocked cross-department task assignment, full multi-department task review). The Interviewers list defaults strictly to the baseline hardcoded EB/GB names, but dynamically fetches and appends active Senior Executives with full names from MongoDB (`/api/members?minimal=true&designation=Senior%20Executive`) when SE access is enabled, while strictly barring all other roles (General Members, Executives, Alumni).
- **Recruitment Waiting Room Management System (`/dashboard/recruitment/waiting-room`):** Introduced a real-time waiting room queue to manage arriving candidates on interview days. Features front-desk verification by student ID against the `EvaluationData` collection (raising an instant guidance alert if the candidate pre-registered but did not complete `/evaluation`). Supports a two-state flexible queue (`Waiting` and `Sent to Board`) ordered by arrival time (FIFO) with unrestricted status toggling. Built a tiered access model: Governing Body, R&D EB, and HR EB hold master modification and coordinator assignment rights; delegated club members selected via `waiting_room_config` hold front-desk modification rights; other recruitment leadership (all active EB and permitted SE) hold read-only queue observation rights; and Alumni are strictly barred.
- **Evaluation Form Component & Validation Fix for Boolean & Rating Questions (`/evaluation`):** Resolved an issue on the Finance and Event Management department pages where applicants could not proceed past boolean questions (e.g., "Have you ever worked related to finance or made a budget before?"). The form renderer (`evaluation/page.tsx`) was missing UI handlers for `type === "boolean"` (Yes/No buttons) and `type === "rating"` (1-5 score buttons), rendering only titles without input elements. Additionally repaired the page validation in `handleNext` so that legitimate falsy values (such as boolean `false`, `0`, or `"No"`) are not misclassified as empty required fields.
- **Evaluation Form Reverse Navigation & Survey Audit Hardening (`/evaluation`):** Resolved a bug where clicking the "Previous" button jumped candidates into unselected department pages by replacing unconditional index decrementing with `handlePrev`, which evaluates page visibility backwards to the nearest active department. Audited the questionnaire and resolved multiple blocking traps: added conditional display `visibleIf: "{question16} != 'No'"` to `question17` (photography link); made portfolio questions (`question13`, `question26`, `question31`) non-required so applicants without prior links can advance without dummy data; transformed `question14` (Creative) from placeholder `Item` values to readable choice strings; expanded `question3` email regex to support hyphens/underscores/`@bracu.ac.bd`; and added input whitespace trimming and case-insensitive matching to identity verification on both frontend and backend.
- **Password Reset Delivery Hardening & Waiting Room Desk Coordinator Selection:** Resolved intermittent password reset email delivery failures by converting unawaited `void singleResetMail(...)` in `auth.ts` to `await`, enabling Nodemailer connection pooling with timeouts (10s/15s) in `mailer.ts`, introducing a branded HTML email template in `mailTemplates.ts` with a direct call-to-action button, and sanitizing email input with `.trim().toLowerCase()`. Fixed an issue in `/dashboard/recruitment/waiting-room` where Senior Executives and active members could not be selected as desk coordinators by adding `studentId` to the MongoDB projection in `/api/members?minimal=true`, allowing the coordinator selector to populate and search all active members seamlessly.
- **Evaluation Admin Comments & Modal Multi-Screen Responsiveness:** Resolved an issue where long notes in the Admin Comments editor expanded beyond the browser viewport and pushed the editor and save buttons off-screen. Configured dialog modals with `w-[95vw] sm:w-full max-h-[90vh] flex flex-col overflow-hidden` and nested `flex-1 min-h-0 overflow-y-auto` scroll areas in `evaluation-assessment.tsx`. Added `maxHeight` prop support and mobile responsive padding overrides (`10px` on screens `< 640px`) in `BlockNoteEditor.tsx`, anchoring header and footer controls across all screen form factors.
- **Multi-Department Task Switching & BlockNote Re-Mount Fix (`/tasks`):** Resolved an issue on the public candidate tasks page where switching between assigned department tabs updated the task title in the header but left the instructions body stuck displaying the first department's task description. `BlockNoteEditor` initializes document content via `useCreateBlockNote({ initialContent })` only once on component mount. Without a dynamic `key`, React reused the existing editor instance across tab changes. Added `key={currentTask.department}` to the task `<Card>` and `key={`task-body-${currentTask.department}-${currentTask.title}`}` to `<BlockNoteEditor>`, forcing React to unmount the old editor and mount a fresh instance with the active department's instructions. Added a `parseTaskDescription` helper to parse descriptions whether stored as BlockNote block arrays, stringified JSON, or plain text, and keyed task review items in `evaluation-assessment.tsx` for parity.
- **Recruitment Tasks Submission Hardening, Protocol Normalization & Data Protection:** Resolved multiple submission reliability and security vulnerabilities across `/tasks`, `/api/recruitment-tasks`, `/api/evaluation`, and candidate evaluation review. Auto-normalized submitted URLs with `ensureHttps` and `normalizeSubmissionUrl` so links pasted without `https://` (e.g. `drive.google.com/...` or `github.com/...`) open properly in new tabs instead of resolving as relative paths that return 404 errors. Added `rel="noopener noreferrer"` to external links. Supported flexible Google Drive, Docs, Sheets, Slides, and Forms URLs while rejecting bare root domain homepages. Secured candidate submissions in `PATCH /api/evaluation` by merging existing submission data (`driveLink`, `githubLink`, `status`, `submittedAt`) so interviewer assessment updates do not accidentally wipe submitted tasks. Isolated multi-department draft link inputs using a department-keyed dictionary state to prevent tab switching from erasing unsaved draft links. Enabled suffix-based matching on the last 10 digits of phone numbers during `/tasks` verification to support all variations of `+880`, `880`, and local `01...` formats.

---

## 6. Legacy Removal & Migration Notes
- **MemberInfo & UserAuth:** Purged and merged into the unified `User` model.
- **Attendee/Interviewee Tracking:** Completely removed from Model, API, and UI per user request.
- **Redis & Drizzle:** Completely removed in favor of MongoDB/Mongoose.
- **Old AI (Nimbus+):** Disabled (410 Gone).

---

## 7. Development Guidelines
- **Security:** Always verify `isGoverningBody` for data-sensitive operations.
- **UI/UX:** Always prioritize whitespace and typography. Apply hue-preserving inversion for brand assets.
- **Next.js 16:** Always use `await params` in server components and API handlers.
- **Integrity:** Every recruitment-related POST handler MUST check the `AppConfig` gating status.

---

## 8. Maintenance & Pending Work
1. **Static Pages:** Finalize History, Alumni, and Gallery content.
2. **SEO Audit:** Complete for v2 public launch.
3. **Legacy Clean-up:** Final removal of any remaining `MemberInfo` references in legacy helpers.
4. **Member Approvals:** Refine the GB approval dashboard for new registrations.
5. **System Context:** Maintain the comprehensive context guide in [docs/all_context.md](file:///C:/Users/Abir/Desktop/bucc-clean-history/docs/all_context.md).
