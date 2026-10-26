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
