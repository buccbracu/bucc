# Bucc Portal Modification Log - Last Agent Summary

This document outlines all features, security refactoring, database schemas, and interface designs implemented during this session to extend and beautify the BRACU Computer Club (BUCC) portal.

---

## 1. Recruitment Tasks Pipeline
*   **Evaluation Schema Upgrade ([EvaluationData.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/model/EvaluationData.ts)):**
    Extended the schema with an `assignedTasks` array containing:
    ```typescript
    assignedTasks: [
      {
        department: String,
        title: String,
        description: mongoose.Schema.Types.Mixed, // Supports BlockNote rich-text
        status: "pending" | "submitted",
        driveLink: String,
        githubLink: String,
        submittedAt: Date
      }
    ]
    ```
*   **Default Presets Management ([broadcast/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/broadcast/page.tsx)):**
    Superadmins can configure 2 default tasks per department, saved dynamically inside the `recruitment_default_tasks` key in MongoDB.
*   **Task Assignment Workspace Dialog ([evaluation-assessment.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/recruitment/%5BevaluationID%5D/evaluation-assessment.tsx)):**
    Replaced the cramped sidebar assignment inputs with a spacious **Dialog Modal**. It features:
    *   Department filters.
    *   Quick-select buttons for default task presets.
    *   **BlockNoteEditor** rich-text input to construct detailed instructions.
*   **Public Tasks Portal ([tasks/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28main%29/tasks/page.tsx)):**
    Built a secure public panel at `/tasks` where candidates:
    1.  Verify using Student ID + Phone Number.
    2.  Read instructions using a read-only instance of `BlockNoteEditor`.
    3.  Submit solutions with mandatory Google Drive link validation.
*   **Access Gating:**
    Restricted task solution visibility so reviewers only see solutions belonging to their respective department (Governing Body and R&D retain overall oversight).

---

## 2. Access Control & Permissions Refactoring
*   **Dynamic Senior Executive (SE) Access:**
    *   Modified the HOC authorization wrapper ([withAuthorization.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/util/withAuthorization.tsx)) and backend endpoints (`/api/preregmembers/` and `/api/evaluation/all`) to dynamically append `Senior Executive` roles if `allowSERecruitmentAccess` is toggled ON in the Broadcast Center.
*   **Superadmin & Press Release Access Rules:**
    *   Refactored the Press Release dashboard management page, creation/edit routes, and API handlers (`GET`, `POST`, `PATCH`, `DELETE` under `/api/press-releases`) to recognize the global `isSuperUser(user)` helper (granting R&D Leadership equal superadmin privileges to the Governing Body).
    *   Implemented the PR department pipeline:
        *   PR Senior Executives can access the page, view drafts, and create new releases.
        *   SE submissions are saved as `pending approval`.
        *   Only **Superadmins** or **PR Directors/Assistant Directors** can approve and publish the pending releases.

---

## 3. Dashboard Visual Excellence
*   **Analytics Stats Panel ([EvaluationStats.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/recruitment/EvaluationStats.tsx)):**
    Overhauled metrics with a tabbed overall status grid (Submitted, Accepted, Pending, Rejected) showing dynamic percentages and a horizontal progress bar breakdown of candidate shares per department.
*   **Details Workspace Overhaul ([page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/recruitment/%5BevaluationID%5D/page.tsx)):**
    *   Added back-navigation links.
    *   Reorganized candidate responses into separate rounded Card panels.
    *   Created a Candidate Profile card displaying Student ID, Email, Phone, and Dates next to modern copyable SVG contact icons.
*   **Comments Maximize Dialog:**
    Converted the admin comments textarea inside the assessment sidebar to a compact `120px` scrollable preview box. Tapping the expand icon opens a large, dedicated rich-text Dialog modal that auto-syncs edits back inline.

---

## 4. Data Management & Traffic Analytics
*   **Wipe Recruitment Data ([manage-data/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/manage-data/page.tsx)):**
    Created a destructive admin block to drop all candidate registrations and evaluations on typing `recruitment_all`.
*   **Site Traffic Logging:**
    *   Created the **`VisitorLog` Schema ([VisitorLog.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/model/VisitorLog.ts))** storing views, unique visitor counts, and a daily IP list.
    *   Created the tracking endpoint (`/api/analytics/track`) and integrated the client-side trigger **`AnalyticsTracker`** inside the main page layout ([layout.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28main%29/layout.tsx)) to record visits on landing.
*   **Analytics Landing Tab:**
    Added an **Analytics & Insights** landing view inside the Data Management Center:
    *   Displays cards for total members, pre-registrations, visitor inquiries, and estimated traffic.
    *   **Member Demographics:** Renders a custom-calculated SVG Donut chart displaying the distribution of members by department.
    *   **Website Traffic:** Renders an SVG Line/Area chart plotting page views and unique visitors with filters to toggle between **Daily**, **Monthly**, and **Yearly** views.

---

## 5. Compatibility & Structural Fixes
*   **CSS Stacking Portals ([dialog.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/ui/dialog.tsx)):**
    Wrapped `DialogContent` with React `createPortal` targeting `document.body` to resolve z-index bugs causing modals to open behind sticky sidebars or headers.
*   **Hiding BlockNote Upload Tab ([BlockNoteEditor.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/BlockNoteEditor.tsx)):**
    Injected CSS overrides to hide the "Upload Image" panel inside the media block toolbar, ensuring users can only import images via the "Embed Image" (URL) input.
*   **Compilation & Type Resolution:**
    Fixed TypeScript parameter type warnings (implicitly typed `any` variables) and JSX syntax brace mismatches.

---

## 6. Dashboard Settings, Events & Demographics (July 1 - 3, 2026)
*   **Profile Form Refetch Defenses:**
    *   Updated the `useEffect` hooks in both settings forms ([EditProfile.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/portal/settings/EditProfile.tsx) and [PublicProfileSettings.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/portal/settings/PublicProfileSettings.tsx)) to guard state population with `if (user && !formData)`. This stops Next-Auth background session refreshes from overwriting active text inputs while users are typing.
    *   Converted the free-text Gender input field to a styled dropdown `<select>` component (Male, Female, Other).
*   **Advanced Event Management Features:**
    *   Modified the Create/Edit Event form to include an **Attendance Tracking** toggle (`needAttendance`) and an **Organizer Notes (Internal)** text area (`notes`), displaying them on the admin moderation cards.
    *   Created dual-handling for Featured Images allowing both file uploads and URL embeds. Whitelists ImgBB (`*.ibb.co`, `ibb.co`) and Imgur (`*.imgur.com`, `imgur.com`) inside [next.config.mjs](file:///C:/Users/Abir/Desktop/bucc-clean-history/next.config.mjs).
*   **Expansion of Project Deletions:**
    *   Modified the request listing validation to allow R&D admins (`isSuper`) to delete projects.
    *   Added a red "Delete Project" button at the top of the project edit page so project authors and admins can delete projects while editing.
*   **Cleaned Demographics & Traffic Analytics:**
    *   Substituted the buggy SVG donut chart for a responsive **Horizontal Bar Breakdown** (`DepartmentBreakdown`) component on the Data Hub page.
    *   Excluded Governing Body members from active demographics metrics.
    *   Grouped non-Governing-Body Alumni together under a unified `"Alumni"` segment in the chart and added an Alumni sub-statistic indicator.
    *   Fixed a TypeScript compilation error in `src/app/api/analytics/track/route.ts` where `NextRequest` lacked definition for the `request.ip` parameter.
 
---
 
## 7. Collapsible Sidebar, Preloader Screen, and Public Settings UI Re-architecture (July 3 - 6, 2026)
*   **Collapsible Sidebar Layout ([Sidebar.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/Sidebar.tsx) and [layout.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/layout.tsx)):**
    *   Added a desktop-collapse toggle (`ChevronLeft` / `ChevronRight`) in the sidebar header next to the branding text.
    *   Adjusts width from `w-64` (expanded) to `w-16` (collapsed) smoothly.
    *   Hides navigation labels, centers icons, and auto-expands on sub-menu clicks, rendering tooltips for hovered items in the collapsed state.
*   **Desktop Header Alignment ([layout.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/layout.tsx)):**
    *   Added `ml-auto` to the user profile and theme container in the header, aligning user details to the right on desktop layouts.
*   **Public Settings Tabbed UI ([PublicProfileSettings.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/portal/settings/PublicProfileSettings.tsx)):**
    *   Redesigned the single stacked settings form into a tabbed layout containing:
        1. **Basic Info**: URL slugs, Cover Photo uploads, resume links, job designations, and biographies.
        2. **Rich Content (Markdown)**: Scrollable textareas for experience, activity, education, achievements, and certifications.
        3. **Visibility Controls**: Grid of interactive privacy checkboxes and a master switch to toggle profile activation.
    *   Resolved typing errors with `DialogTrigger` and verified compiler compatibility.
*   **Destructive Data Wipe Trim Guard ([manage-data/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/manage-data/page.tsx)):**
    *   Modified matching logic in `handleFlush` to match strings case-insensitively and trim spacing (e.g. matching `"recruitment_all"` with trailing spaces or different case), eliminating collection wipe mismatches.
*   **Cleaned Press Release Grayscale Filter ([page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28main%29/publications/press-releases/page.tsx)):**
    *   Removed the default `grayscale` CSS filter from the public press release cover photos, allowing images to render in full color by default on page load.
*   **Cinematic Preloader & Session Cache ([Preloader.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/public/Preloader.tsx)):**
    *   Developed a global preloader playing a logo animation, typewriter effect of the club motto `"UPGRADE YOURSELF."` across two bold, italic lines, and a smooth `001%` to `100%` digital loading bar.
    *   Integrated `sessionStorage` caching. The preloader runs only once per browser tab session, mounting/unmounting instantly on subsequent page refreshes to keep the website feeling fast.
*   **WebGL Spline Revert:**
    *   Reverted all homepage optimizations related to the WebGL Spline 3D canvas, restoring it to its exact original loading state per user preference.
 
---
 
## 8. Existing Member Registration & Multi-level Approvals (July 8, 2026)
*   **Staged Request Database Schema ([PendingMember.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/model/PendingMember.ts)):**
    *   Created a staging schema to hold pending registrations before account activation.
    *   Integrates dynamic fields: Name, Student ID, Email, Phone, BUCC Department, BRACU Department, Designation, and Membership Status (Active/Alumni).
*   **Password Symmetric Encryption Safeguards ([crypto.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/lib/crypto.ts)):**
    *   Implemented Node `crypto`-based AES-256-CBC symmetric encryption to store passwords securely inside the staging collection.
    *   Decrypts the credentials only when the registration request is approved to construct the account via Better Auth.
*   **Public Signup Panel ([page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28main%29/member-registration/page.tsx)):**
    *   Designed `/member-registration` as a premium centered dashboard-card layout (fully distinct from the recruitment intake split-page). Features ambient background blur neon lights, card-grouped form categories, client-side validation, duplicate checks, and streamlined form inputs:
        *   **Alumni Status**: BUCC Department dropdown includes "Governing Body" as an option. Selecting "Governing Body" updates designations to President, VP, GS, or Treasurer; selecting other departments updates designations to Director, AD, SE, Executive, or General Member. Includes an optional checkbox to bypass G-Suite constraints and register using a personal email address (e.g. Gmail).
        *   **Current Member**: Excludes "Governing Body" from departments, limits designations strictly to Senior Executive, Executive, and General Member, and strictly enforces G-Suite verification.
*   **Administrative Approvals Tab ([page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/members/page.tsx)):**
    *   Added a tab system with a live notification counter badge inside the Members Directory page for eligible reviewers.
    *   Reviewers can only see and action requests matching their authority levels.
*   **Review & Approval Modal ([MemberApprovalDialog.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/portal/members/MemberApprovalDialog.tsx)):**
    *   Provides inline profile editing (Name, Student ID, Designation, etc.) before approving.
    *   Triggers programmatically to register users through Better Auth, automatically dispatches a congratulations/welcome email listing login credentials, and deletes the staging document.
 
*   **API Handlers ([route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/member-registration/route.ts) & [[id]/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/member-registration/%5Bid%5D/route.ts)):**
    *   Exposes secure routes managing submission (POST), retrieval (GET), editing/activation (PATCH), and rejection/deletion (DELETE).
*   **Sign-in Portal Integration ([page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28main%29/login/page.tsx)):**
    *   Added a prominent "Existing BUCC Member / Alumni Registration" navigation link under the login form to redirect members to the portal signup layout.
*   **Broadcast Center Permission Restructuring:**
    *   Restricted Broadcast Center and Hero configuration access. Replaced permissive checks permitting Senior Executives and Executives with strict Executive Body verification (`isGB || ["director", "assistant director"].includes(userDesignation)`), blocking general body members from modifying global alerts, announcements, recruitment configurations, or hero slides.
*   **Members Directory Permission Restructuring:**
    *   Restricted Members Directory access ([page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/members/page.tsx)) and sidebar navigation link visibility ([Sidebar.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/Sidebar.tsx)) to Governing Body (GB) and Executive Body (Directors / Assistant Directors) members. Senior Executives are now excluded from viewing the active member roster.
*   **MongoClient Connection Caching Pattern ([auth.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/lib/auth.ts)):**
    *   Cached the `MongoClient` connection globally in development mode. Prevents Next.js hot-reloads from repeatedly instantiating separate connection pools, solving the `MongoTopologyClosedError` for authentication and session endpoints.
*   **Blogs and Press Releases Dashboard & API Scoping ([blogs/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/blogs/page.tsx), [press-releases/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/press-releases/page.tsx), [api/press-releases/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/press-releases/route.ts)):**
    *   Restricted the backend query for non-moderators (such as Senior Executives) to only return press releases they authored themselves (matching the blog API scoping).
    *   Kept the status filter tabs ("All", "Published", "Pending Approval", "Drafts") visible for all users. These tabs now filter the user's own submissions for regular writers, and moderate all submissions for Governing Body (GB) and Executive Body (EB) moderators.
*   **Profile Slug Uniqueness Index Fix ([route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/member/route.ts)):**
    *   Replaced setting `profileSlug` to `null` with MongoDB's `$unset` operator when members clear their custom profile URLs. This fully deletes the field from the document, allowing MongoDB's `sparse: true` index to ignore it and preventing `E11000 duplicate key` validation errors on profile updates.
*   **Designations List Cleanup ([designations.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/constants/designations.ts)):**
    *   Removed the `"Advisor"` and `"Alumni"` designations from the global designations constant registry. This completely excludes advisors (faculty members) and alumni status definitions from student member designations dropdowns (such as edit and approval dialogs), while keeping Alumni as a core membership status dropdown choice.
*   **Probation Membership Status Removal ([MemberEditDialog.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/portal/members/MemberEditDialog.tsx)):**
    *   Removed the `"Probation"` selection option from the member status dropdown inside the profile editor, limiting status categories strictly to Active, Inactive, and Alumni.
*   **Dynamic Recruitment Gating for Senior Executives ([Sidebar.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/Sidebar.tsx), [evaluation/all/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/evaluation/all/route.ts), [preregmembers/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/preregmembers/route.ts), [preregmembers/[id]/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/preregmembers/%5Bid%5D/route.ts), [withAuthorization.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/util/withAuthorization.tsx), [registration/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/registration/page.tsx), [api/registration/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/registration/route.ts)):**
    *   Linked the sidebar recruitment menu visibility checks to the live `allowSERecruitmentAccess` config value. When enabled by the Governing Body, Senior Executives from any department (including Communication and Marketing) will dynamically see the recruitment option menu in their portal sidebar.
    *   Updated the backend recruitment (`api/evaluation/all` and `api/preregmembers`) and onboarding (`api/registration`) API endpoints to bypass department-level restrictions for non-alumni Senior Executives when `allowSERecruitmentAccess` is active, restricting their onboarding operations to their respective departments.
    *   Updated the page-level authorization guards (the `withAuthorization` HOC protecting `/dashboard/recruitment/prereg` and the inline validation in `/dashboard/registration/page.tsx`) to grant access to Senior Executives of any department when recruitment access is toggled on.
*   **MongoClient Connection Pool Sharing Refactoring ([auth.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/lib/auth.ts), [all-members/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/all-members/route.ts), [manage-data/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/manage-data/route.ts), [member/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/member/route.ts), [members/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/members/route.ts), [registration/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/registration/route.ts)):**
    *   Exported the globally cached `client` and `db` instances from `auth.ts`.
    *   Replaced all manual `new MongoClient` instances in backend API endpoints with the exported, shared `db` connection, consolidating connection pooling across the entire application and eliminating pool resource leakage during local Hot Module Replacement (HMR).
*   **Announcement Posting Gating Restructuring ([announcements/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/announcements/route.ts), [dashboard/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/page.tsx), [broadcast/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/broadcast/page.tsx)):**
    *   Restricted announcement posting and deletion backend APIs to verify that the requesting user has a `memberStatus` of `"Active"` and belongs to the Governing Body (President, VP, GS, Treasurer) or Executive Body (Director, Assistant Director). Removed other staff roles (such as Senior Executives and Executives) from posting privileges.
    *   Synchronized client-side visibility on the dashboard and Broadcast Center page to show the "Post Announcement" action trigger only to active EB and GB members.
*   **TypeScript Strict Mode Type Fixes ([manage-data/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/manage-data/route.ts), [members/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/members/route.ts), [registration/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/registration/route.ts)):**
    *   Added explicit type declarations to arrow function parameters in backend database collection `.map()` mapping arrays to satisfy strict TypeScript compilation checks and guarantee a 100% clean production build.
*   **Member Registration Page Mobile & Design Optimization ([member-registration/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28main%29/member-registration/page.tsx)):**
    *   Replaced GPU-heavy CSS `blur-[120px]` background elements with smooth, high-fidelity native `radial-gradient` overlays, eliminating blocky rendering and pixelation on high-DPI mobile screens (such as iOS Safari/Chrome).
    *   Redesigned the membership status options from standard radio inputs into premium checked option cards featuring dynamic scale transitions, glowing hover borders, and description details.
    *   Cleaned input containers to place helper icons directly inside inputs, setting a standard left offset (`pl-10`) for a unified grid, and optimized form layout padding structures to scale smoothly down to small mobile displays.
*   **Welcoming Preloader Screen Optimization & Scoped Scoping ([Preloader.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/public/Preloader.tsx), [layout.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28main%29/layout.tsx), [page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28main%29/page.tsx)):**
    *   Replaced the vertical slide-up transition with a smooth, high-end opacity fade exit reveal.
    *   Relocated the progress counter from a centered bar to a clean, giant number display in the bottom-right corner.
    *   Replaced static text/logo glows with a high-fidelity light sheen sweep animation: using the SVG logo as a CSS mask shape, a diagonal sheen light sweeps across the logo paths from left to right. Concurrently, a text-shimmer background gradient sweeps across the "Upgrade Yourself" motto. Added a paced delay loop (3.2 seconds total duration) between flashes to maintain an organic, premium style.
    *   Moved the `Preloader` component mounting from the global `(main)` layout wrapper directly into the landing page entry route `page.tsx`, ensuring the loading animation sequence is strictly displayed on the homepage (`/`) and bypassed on all inner pages (such as `/login` or `/member-registration`).
*   **Above-The-Fold Image Loading Priority Fix ([Navbar.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/Navbar.tsx)):**
    *   Assigned the `priority` prop to the main navigation header logo `Image` component. This marks it for eager loading and high fetch priority, resolving the Chromium console intervention warning about lazy-loaded visible viewport images.
*   **Static Caching of Default Hero Slides ([HeroCarousel.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/home/HeroCarousel.tsx)):**
    *   Downloaded the 3 default remote Unsplash slide images and stored them locally in the static public assets directory (`/public/images/hero-slide-1.jpg`, `hero-slide-2.jpg`, and `hero-slide-3.jpg`).
    *   Updated default hero slide object array configuration references to fetch local assets instead of calling external domains, optimizing LCP/CLS layout stability and supporting offline builds.
*   **Mobile Gating for Spline 3D Model Render ([HomePage.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/HomePage.tsx)):**
    *   Disabled loading and mounting of the dynamic `@splinetool/react-spline` component on mobile viewports (screen widths `< 1024px`).
    *   Forced the page layout to automatically use the original 3-column static grid fallback, saving device CPU/GPU resources, reducing network load, and guaranteeing a fast LCP and lag-free 60fps on mobile browsers.

---

## 9. Universal EB Recruitment Access, Hardened Alumni Safeguards & Registration Rate Limit Removal (October 2026)
*   **Universal Recruitment Access for All Active Department EBs ([Sidebar.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/components/Sidebar.tsx), [withAuthorization.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/util/withAuthorization.tsx), [hasAuth.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/helpers/hasAuth.ts), [api/evaluation/all](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/evaluation/all/route.ts), [api/preregmembers](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/preregmembers/route.ts)):**
    *   Resolved an access restriction where only HR, R&D, and Governing Body could view and manage recruitment.
    *   Updated `canSeeRecruitment` in `Sidebar.tsx` so all active Directors and Assistant Directors (`["director", "assistant director"].includes(userDesignation)`) from all club departments (Event Management, Creative, Communication & Marketing, Finance, Press Release, HR, R&D) dynamically see the Recruitment navigation dropdown.
    *   Expanded backend permissions in `hasAuth.ts` and route handlers to authorize active EB members across all departments with equal management parity to the R&D EB.
*   **Cross-Department Task Assessment in Evaluation Workspace ([evaluation-assessment.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/recruitment/[evaluationID]/evaluation-assessment.tsx)):**
    *   Updated `isSuper` evaluation checks to authorize all active Directors and Assistant Directors to view and assign candidate tasks across departments during evaluation panels.
*   **Comprehensive Case-Insensitive Alumni Exclusion:**
    *   Hardened Alumni and Inactive status checks across `Sidebar.tsx`, `withAuthorization.tsx`, `hasAuth.ts`, `permissions.ts`, `registration/page.tsx`, `recruitment/page.tsx`, `evaluation/page.tsx`, and `api/registration/route.ts`.
    *   Uses composite verification (`user?.memberStatus?.toLowerCase() === "alumni" || user?.designation?.toLowerCase() === "alumni" || user?.memberStatus !== "Active"`).
    *   Guarantees that former Directors or Assistant Directors who graduated to Alumni status are strictly prohibited from viewing or interacting with recruitment pipelines.
*   **Member Registration Rate Limit Removal ([route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/member-registration/route.ts)):**
    *   Removed the IP-based rate limiting window (formerly 1 hour / 3 attempts) and 429 status response from `src/app/api/member-registration/route.ts`, allowing frictionless onboarding submissions without connection lockouts.

---

## 10. Senior Executive Recruitment Parity & Dynamic Interviewers List (October 2026)
*   **Full Evaluator Parity for Senior Executives ([evaluation-assessment.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/recruitment/[evaluationID]/evaluation-assessment.tsx)):**
    *   Updated `isSuper` logic in the evaluation workspace to include active Senior Executives when `allowSERecruitmentAccess` is toggled on in `recruitment_config`.
    *   Eliminated department-bound locks for permitted SEs: SEs can view candidate tasks across all departments and assign tasks to any department using the department selector dropdown, achieving full functional equality with active Directors and Assistant Directors.
*   **Dynamic Database Interviewers List with Strict Role Gating ([evaluation-assessment.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/recruitment/[evaluationID]/evaluation-assessment.tsx), [api/members/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/members/route.ts)):**
    *   The base Interviewers selector continues to use the hardcoded EB and GB names (`ExecutiveBody2026`).
    *   When `allowSERecruitmentAccess` is active, active Senior Executives are dynamically fetched from MongoDB via `/api/members?minimal=true&designation=Senior%20Executive` and appended with their full names.
    *   When `allowSERecruitmentAccess` is false, only EB and GB names appear. General Members, regular Executives, and Alumni are strictly excluded from the Interviewers options.
*   **Evaluation Detail Route Guard ([recruitment/[evaluationID]/page.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/recruitment/[evaluationID]/page.tsx)):**
    *   Hardened direct URL access to `/dashboard/recruitment/[evaluationID]` with session authentication, live `allowSERecruitmentAccess` config checks, and multi-factor Alumni gating.

---

## 11. Recruitment Waiting Room Management System (October 2026)
*   **Front-Desk Candidate Check-In & Evaluation Gating ([page.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/recruitment/waiting-room/page.tsx), [route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/recruitment/waiting-room/route.ts)):**
    *   Coordinators input a candidate's student ID upon physical arrival.
    *   The system validates whether `EvaluationData` exists. If submitted, the applicant is placed into the live queue with status `Waiting` and a timestamp.
    *   If not submitted, the system checks `PreRegMember` and flags an instant warning (`EVALUATION_MISSING`), prompting coordinators to guide the candidate to fill out `/evaluation` before joining the interview queue.
*   **Two-State Queue with Unrestricted FIFO Ordering:**
    *   Features two live states: `Waiting` and `Sent to Board`, with quick removal/dismissal.
    *   Displays candidates ordered by check-in time (FIFO), while empowering coordinators to send any candidate to an interview board in any order.
    *   Includes department filtering, search, live stats counter pills, and direct evaluation workspace links.
*   **Tiered Access & Delegation Control ([coordinators/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/recruitment/waiting-room/coordinators/route.ts), [Sidebar.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/components/Sidebar.tsx)):**
    *   **Master Control:** Governing Body (GB), R&D EB (Director & AD), and HR EB (Director & AD) have full management rights and can delegate desk coordinators from an in-app dialog.
    *   **Assigned Coordinators:** Any active member chosen by leadership is granted check-in and queue status modification powers and automatically sees the Waiting Room item in their sidebar.
    *   **View-Only Access:** All other active Directors, Assistant Directors, and permitted Senior Executives can view the live queue in read-only mode to observe candidate arrival.
    *   **Alumni Protection:** Inactive members and Alumni are strictly denied access.

---

## 12. Evaluation Form Boolean & Rating Component Fix (October 2026)
*   **Missing Component Rendering ([evaluation/page.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(main)/evaluation/page.tsx)):**
    *   Previously, SurveyJS question types `boolean` (e.g. `question18` in Event Management and `question22` in Finance) and `rating` (`question21`) lacked UI component branches in the evaluation page renderer.
    *   This caused only the question title to display with no buttons or input elements, leaving applicants unable to supply an answer.
    *   Added interactive, styled Yes/No buttons for `boolean` elements and 1-5 segmented rating score controls for `rating` elements.
*   **False-Positive Required Field Validation Fix:**
    *   In `handleNext`, the emptiness test was `!value || (Array.isArray(value) && value.length === 0)`. If an applicant chose "No" (`false`), `!false` evaluated to `true`, erroneously triggering the required field error toast and preventing page navigation.
    *   Fixed check to explicitly test for `value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)`.
*   **Standardized Boolean Values ([questionJSON.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/components/evaluation/questionJSON.ts)):**
    *   Configured explicit `valueTrue: "Yes"` and `valueFalse: "No"` on `question22` in `questionJSON.ts` to align with `question18`.

---

## 13. Evaluation Questionnaire Audit, Navigation & Validation Hardening (October 2026)
*   **Dynamic Previous Button Navigation ([evaluation/page.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(main)/evaluation/page.tsx)):**
    *   Previously, the "Previous" button used `setCurrentPageIndex(prev => prev - 1)`, mechanically decrementing by 1 index without evaluating `isPageVisible`.
    *   When candidates reached later pages (e.g., Brain Teaser) and clicked "Previous", they were dropped into unselected department pages (e.g., Research & Development, Press Release) rather than their chosen department.
    *   Implemented `handlePrev`, looping backwards through pages to find the nearest preceding visible page matching the candidate's chosen departments.
    *   Added helper functions `hasPrevPage()` and `hasNextPage()` for clean button disabled states and dynamic label switching (`Finish Evaluation` vs `Next Step`).
*   **Survey Questionnaire Hardening ([questionJSON.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/components/evaluation/questionJSON.ts)):**
    *   **`question17` (Event Management):** Added `visibleIf: "{question16} != 'No'"` and made `isRequired: false` so candidates answering "No" to photography interest are not blocked from advancing.
    *   **Portfolio URL Traps (`question13`, `question26`, `question31`):** Converted from `isRequired: true` to `isRequired: false` across Creative, Press Release, and R&D so beginners/freshers without existing online portfolios are not forced to enter dummy URLs to proceed.
    *   **`question14` (Creative):** Replaced placeholder values (`Item 1`, `Item 2`, `Item 3`, `Item 4`) with the actual readable text choices so interviewers see the candidate's genuine response rather than raw IDs.
    *   **`question3` Email Regex:** Updated G-Suite regex to `^[a-zA-Z0-9._%+-]+@(g\.)?bracu\.ac\.bd\s*$` to support hyphens, underscores, and BRACU email formats.
*   **Autofill & Verification Resilience ([evaluation/page.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(main)/evaluation/page.tsx), [api/evaluation/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/evaluation/route.ts)):**
    *   Sanitized and trimmed `studentId` and `email` on verification submission.
    *   Updated server-side lookup with case-insensitive regex matching for `PreRegMember` emails to prevent spurious "Student record not found" errors caused by mobile keyboard trailing spaces or casing differences.

---

## 14. Password Reset Dispatch Reliability & Waiting Room Coordinator Assignment (October 2026)
*   **Password Reset Email Delivery Hardening ([auth.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/lib/auth.ts), [mailer.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/helpers/mailer.ts), [mailTemplates.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/helpers/mailTemplates.ts), [reset-password/page.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(main)/reset-password/page.tsx)):**
    *   **Awaited Dispatch:** Changed `void singleResetMail(user.email, url)` in `src/lib/auth.ts` to `await singleResetMail(...)`. This prevents serverless runtimes from closing the HTTP response and prematurely dropping the SMTP socket connection before Nodemailer finishes transmitting to Gmail.
    *   **Nodemailer Pooling & Timeouts:** Enabled connection pooling (`pool: true`, `maxConnections: 3`) and explicit connection/greeting/socket timeouts (10s/15s) in `src/helpers/mailer.ts` to prevent silent socket hanging on Google SMTP.
    *   **HTML Email Template:** Introduced `resetMailHtml` in `src/helpers/mailTemplates.ts` with responsive styling and a prominent call-to-action button, preventing spam/junk classification by university filters triggered by raw plain-text token URLs.
    *   **Email Sanitization & Error Handling:** Added `.trim().toLowerCase()` to the forgot-password email input to prevent silent user lookup misses caused by mobile keyboard capitalization or trailing spaces. Fixed error swallowing in `singleResetMail` to log and rethrow errors cleanly.
*   **Waiting Room Coordinator Selection Fix ([api/members/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/members/route.ts), [waiting-room/page.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/recruitment/waiting-room/page.tsx)):**
    *   Previously, the search input in the "Assign Desk Coordinators" modal yielded "No matching active members found" because `/api/members?minimal=true` did not project `studentId`. As a result, `.filter((m: any) => m.studentId)` in `waiting-room/page.tsx` filtered out 100% of club members (including Senior Executives).
    *   Added `studentId: 1` to the MongoDB query projection in `/api/members?minimal=true`.
    *   Updated selector mapping in `waiting-room/page.tsx` to include department labels and trimmed student IDs (`Name (Student ID) - Designation • Department`), enabling instant search and assignment of Senior Executives and other active members.

---

## 15. Evaluation Admin Comments & Task Modals Multi-Screen Responsiveness (October 2026)
*   **Viewport Locking & Internal Scrolling ([evaluation-assessment.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/recruitment/[evaluationID]/evaluation-assessment.tsx)):**
    *   Configured `DialogContent` with `w-[95vw] sm:w-full max-h-[90vh] flex flex-col p-4 sm:p-6 overflow-hidden` for both the Admin Comments modal and the Assign Task modal.
    *   Wrapped the `BlockNoteEditor` in a `flex-1 min-h-0 overflow-y-auto py-2 pr-1` flex container.
    *   Anchored `DialogFooter` (`mt-auto shrink-0`) with responsive full-width mobile buttons and pinned placement so actions ("Close & Save", "Add Assignment") are never pushed off-screen.
*   **BlockNote Mobile Padding & Height Containment ([BlockNoteEditor.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/components/BlockNoteEditor.tsx)):**
    *   Added optional `maxHeight` and `className` prop support to `BlockNoteEditorProps` with internal `overflow-y-auto`.
    *   Added mobile responsive CSS overrides reducing `.bn-container .bn-editor` side padding from large default gutter margins down to `10px` on screens `< 640px`, maximizing horizontal typing area on phones and small tablets.
    *   Reduced initial `minHeight` on comments dialog to `260px` to fit comfortably on 13-inch laptop viewports (768px height) and mobile viewports with on-screen keyboards.

---

## 16. Multi-Department Task Switching & BlockNote Re-Mount Fix ([tasks/page.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(main)/tasks/page.tsx)) (October 2026)
*   **Stale Task Description Bug Resolution:**
    *   When candidates had multiple department tasks assigned (e.g., Creative and R&D), clicking between the department tabs updated the task title in the header, but the instructions/description body remained stuck showing the first department's task content.
    *   **Root Cause:** In React, `BlockNoteEditor` was mounted without a `key` prop. Because `useCreateBlockNote({ initialContent })` only runs once when the component mounts, React reused the existing component instance upon tab switching without re-initializing the editor document.
    *   **Fix:** Added dynamic React keys (`key={currentTask.department}` on the task Card and `key={\`task-body-${currentTask.department}-${currentTask.title}\`}` on the `BlockNoteEditor`). This forces React to unmount the old editor instance and mount a fresh instance with the selected department's description content.
*   **Task Description Parser:**
    *   Added `parseTaskDescription` helper to robustly parse descriptions whether stored as an array of BlockNote blocks, a stringified JSON array, or plain text strings.
    *   Also keyed task items in [`evaluation-assessment.tsx`](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/recruitment/[evaluationID]/evaluation-assessment.tsx) (`key={\`eval-task-${task.department}-${task.title}\`}`) for parity.

---

## 17. Recruitment Tasks Submission Hardening, Protocol Normalization & Data Protection (October 2026)
*   **Protocol Normalization & Relative Link 404 Prevention ([tasks/page.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(main)/tasks/page.tsx), [recruitment-tasks/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/recruitment-tasks/route.ts), [evaluation-assessment.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/recruitment/[evaluationID]/evaluation-assessment.tsx)):**
    *   When candidates copy links without `https://` (e.g. `drive.google.com/drive/folders/...` or `docs.google.com/...` or `github.com/...`), browsers treat `<a href="...">` as relative URLs, triggering a 404 error.
    *   Implemented `normalizeSubmissionUrl` and `ensureHttps` across the pipeline to auto-prepend `https://` and strip accidental enclosing quotes or angle brackets.
    *   Added `rel="noopener noreferrer"` to all submission anchor tags to prevent reverse tabnabbing vulnerabilities.
*   **Permissive Drive / Docs / Forms Validation:**
    *   Accommodates Google Drive folders, Google Docs, Sheets, Slides, and Forms (`drive.google.com`, `docs.google.com`, `forms.gle`) while rejecting bare root homepage URLs (e.g., `https://drive.google.com/`).
*   **Assessment Update Candidate Submission Preservation ([api/evaluation/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/evaluation/route.ts)):**
    *   Previously, updating candidate comments, status, or marks via `PATCH /api/evaluation` could overwrite the `assignedTasks` array with stale in-memory state, wiping candidates' submitted links and timestamps.
    *   Added a safe merge in `api/evaluation/route.ts` that detects and preserves existing `driveLink`, `githubLink`, `status: "submitted"`, and `submittedAt` from the database.
*   **Independent Multi-Department Draft State ([tasks/page.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(main)/tasks/page.tsx)):**
    *   Replaced shared `driveLink` / `githubLink` single-string state with `submissionInputs` dictionary keyed by department. Candidates can switch between department tabs without losing unsaved draft URLs.
*   **Candidate Phone Verification Suffix Matching ([api/recruitment-tasks/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/recruitment-tasks/route.ts)):**
    *   Extended digit phone matching to compare the last 10 digits (`cleanPhoneInput.slice(-10) === cleanCandPhone.slice(-10)`), allowing verification regardless of whether the applicant entered `+880`, `880`, or local `01...`.

---

## 18. Recruitment Task Data Export & On-Screen Viewer (October 2026)
*   **Dual Standard Maintenance Cards ([manage-data/page.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/manage-data/page.tsx)):**
    *   Added two standard-sized cards at the top of the Maintenance tab (`activeTab === "maintenance"` in `/dashboard/manage-data`), styled identically to the existing collection cards in the 2-column grid:
        1.  **`Tasks (Submitted)`** (`recruitment_tasks_submitted`): Displays live count badge of candidates who submitted solutions, with direct **JSON**, **CSV**, and **View** buttons.
        2.  **`Tasks (Pending)`** (`recruitment_tasks_pending`): Displays live count badge of candidates who were given tasks but have not submitted solutions yet, with direct **JSON**, **CSV**, and **View** buttons.
    *   Tapping **View** opens the candidate tasks inspection modal pre-filtered to the respective status (`submitted` vs `pending`), complete with live search and direct links to Drive/Docs and GitHub.
*   **Filtered CSV & JSON Export API ([manage-data/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/manage-data/route.ts)):**
    *   Engineered `GET /api/manage-data?model=recruitment_tasks_submitted|recruitment_tasks_pending&format=csv|json`.
    *   Generates filtered, standardized UTF-8 BOM CSVs with full candidate identification (Student ID, Name, Email, Phone, Club Department, Task Title, Task Status, Google Drive/Docs Links, GitHub Links, Submitted Timestamp, Interviewers, and Comments).
    *   Provides structured hierarchical JSON containing candidate records filtered by task status.
*   **Strict Access Gating ([permissions.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/lib/permissions.ts)):**
    *   Defined `canAccessTaskSubmissions` strictly granting authorization to Governing Body (GB), Research & Development (R&D) Director & Assistant Director, and Human Resources (HR) Director & Assistant Director (`isGoverningBody(user) || isRDAdmin(user) || isHRAdmin(user)`).
    *   Alumni and unauthorized roles are blocked with 403 Forbidden on both the frontend UI and the backend API.

---

## 19. All-in-One Real-Time Activity & Audit Logging System (October 2026)
*   **Standalone Audit Architecture ([ActivityLog.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/model/ActivityLog.ts)):**
    *   Created a completely separate, dedicated collection in MongoDB (`activitylogs`) without modifying or bloating `EvaluationData` or other existing models.
    *   Tracks:
        *   `actor`: `{ id, name, email, designation, department }`
        *   `action`: Specific action code (e.g. `RECRUITMENT_STATUS_CHANGE`, `RECRUITMENT_COMMENT_UPDATE`, `MEMBER_APPROVED`, `DATA_FLUSH`, `RECRUITMENT_WAITING_CHECKIN`)
        *   `category`: `"Recruitment"` | `"Members"` | `"Events"` | `"Blogs"` | `"Projects"` | `"System"`
        *   `method`: HTTP verb (`"POST"` | `"PATCH"` | `"PUT"` | `"DELETE"`)
        *   `targetId` & `targetName`: Candidate Student ID or Member ID and associated name
        *   `summary`: Human-readable activity sentence (e.g., *"Hasib Hossain Abir Approved Rifa Tasnia Hridi Account Creation at 6:00 p.m."*, *"Hasib Hossain Abir updated evaluation form of ID: 24101236 at 5:00 p.m."*)
        *   `details`: Structured diff payload capturing exact `oldValue` and `newValue`
        *   `ipAddress`: Request IP
        *   `createdAt`: Timestamp with compound index for sub-second sorting.
*   **Non-Blocking, Failsafe Activity Logger ([activityLogger.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/helpers/activityLogger.ts)):**
    *   Engineered `logActivity` using non-blocking background promises and graceful error handling so core business operations are never disrupted if logging fails.
    *   Implemented `logEvaluationDiff` smart diff engine that intercepts candidate evaluation mutations to record:
        *   Status flips (`Rejected` ➔ `Accepted`, etc.)
        *   Comment edits (preserving previous comment text into `details.oldValue` alongside the updated comment)
        *   Department reassignments
        *   Task assignments and removals
        *   Interview board transfers
*   **System-Wide Mutation Interception:**
    *   **Recruitment Evaluations ([api/evaluation/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/evaluation/route.ts)):** In `PATCH /api/evaluation`, performs in-memory old-vs-new comparison against the candidate record before saving.
    *   **Member Registration Approvals & Rejections ([api/member-registration/[id]/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/member-registration/[id]/route.ts)):** Logs account approval (`MEMBER_APPROVED`) and deletion/rejection (`MEMBER_REJECTED`).
    *   **Member Profile Modifications & Deletions ([api/member/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/member/route.ts)):** Logs administrative updates (`MEMBER_UPDATED`) and permanent member deletions (`MEMBER_DELETED`).
    *   **Waiting Room Operations ([api/recruitment/waiting-room/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/recruitment/waiting-room/route.ts)):** Logs desk check-ins (`RECRUITMENT_WAITING_CHECKIN`), queue removals (`RECRUITMENT_WAITING_REMOVE`), and board transfers (`RECRUITMENT_WAITING_STATUS_CHANGE`).
    *   **Data Maintenance & Flush Operations ([api/manage-data/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/manage-data/route.ts)):** Logs bulk onboarding (`BULK_USER_ONBOARD`), collection flushes (`DATA_FLUSH`), and full recruitment wipes.
*   **Audit API ([api/logs/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/logs/route.ts)):**
    *   `GET /api/logs`: RBAC gated endpoint (`canAccessTaskSubmissions`).
    *   Supports server-side pagination (`page`, `limit`), text search across summary, actor, and target, category filters, and live statistics summary (`?stats=true`).
    *   One-click UTF-8 BOM CSV export (`?format=csv`) and structured JSON export (`?format=json`).
    *   `DELETE /api/logs`: Secure log pruning by date range (`startDate`, `endDate`). Gated strictly to Governing Body and R&D Director & Assistant Director (`isSuperUser(user)`). Self-audits the deletion action by recording a `LOGS_PURGED` summary in the audit stream after pruning.
*   **Dedicated Activity Logs Dashboard ([dashboard/logs/page.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/logs/page.tsx)):**
    *   Added dedicated **"Activity Logs"** entry in the portal sidebar ([Sidebar.tsx](file:///C:/Users/hha/Desktop/repo/bucc/src/components/Sidebar.tsx)) linking to `/dashboard/logs`.
    *   Access to view logs is gated to Governing Body (GB), R&D Director & Assistant Director, and HR Director & Assistant Director.
    *   Access to delete logs is strictly restricted to **GB and R&D Director & Assistant Director only** (`isSuperUser`).
    *   Features:
        *   **Real-time Statistics Cards:** Total logs, status flips, comment updates, and member approvals.
        *   **Real-time Search & Filter Pills:** Filter by category (All, Recruitment, Members, System, Events, Blogs, Projects).
        *   **Chronological Feed:** HTTP method badges (`POST`, `PATCH`, `DELETE`), actor details (name, designation, department, email), human-readable summary sentence, candidate ID badges, and exact timestamps.
        *   **Expandable Diff Views:** Clear status flip-flop transition visualizer (`[Old Status] ➔ [New Status]`), side-by-side comment revision visualizer (showing previous comment in strike/red and updated comment in green), and JSON diff viewers.
        *   **Direct Export Controls:** One-click CSV and JSON downloads.
        *   **Date Range Purge Dialog:** GB and R&D leadership can launch a modal with quick range presets (Past 7 Days, Past 30 Days, Past 90 Days) and custom start/end date selectors to safely prune historical logs.

---

## 20. API Vulnerability Remediation & Recruitment Privacy Hardening (October 2026)
*   **Authentication & Access Gating on Evaluation Mutations ([api/evaluation/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/evaluation/route.ts)):**
    *   Secured `PATCH /api/evaluation` with mandatory authentication checks (`auth()`).
    *   Strictly enforced `hasGeneralRecruitmentAccess(user, allowSERecruitmentAccess)` and excluded alumni (`isAlumniMember`), preventing unauthenticated outsiders from altering candidate status, assigning departments, or modifying evaluation comments and tasks.
*   **Candidate PII & Interview Feedback Leak Prevention ([api/evaluation/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/evaluation/route.ts)):**
    *   Enforced session and recruitment role validation on `GET /api/evaluation?evaluationID=...`.
    *   Prevents outsiders from scraping confidential applicant responses, phone numbers, emails, interviewer names, and private feedback comments.
    *   Added pre-registration verification to `POST /api/evaluation` ensuring applicants cannot submit evaluations without first completing recruitment pre-registration.
*   **Intake Management Route Hardening ([api/intake/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/intake/route.ts), [api/intake/[id]/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/intake/[id]/route.ts)):**
    *   Secured `POST /api/intake` and `PATCH /api/intake/[id]` behind authentication and `isSuperUser(user)` (GB & R&D leadership only).
    *   Outsiders can no longer forge or alter recruitment intakes.
*   **System Configuration RBAC Lockdown ([api/config/route.ts](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/config/route.ts)):**
    *   Replaced incomplete sensitive key blacklist with comprehensive role-based access control.
    *   `waiting_room_config` updates require `canManageWaitingRoomCoordinators` (GB, R&D EB, and HR EB).
    *   All other system configurations (`hero_carousel_config`, `recruitment_config`, `recruitment_default_tasks`, etc.) are strictly locked to `isSuperUser(user)`.
    *   Prevents unauthorized members from elevating their privileges to desk coordinators or tampering with default task presets.
