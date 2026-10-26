# Recruitment Lifecycle & Gating

The recruitment process is the most critical pipeline in the BUCC portal. It is modeled as a strict state machine, heavily governed by administrative toggles and role-based permissions.

## The State Machine

1. **Phase 1: Registration (`/registration`)**
   - **Actor:** Prospective Member.
   - **Action:** Submits basic details (Name, ID, G-Suite, Dept preferences).
   - **Output:** Document created in the `PreRegMember` collection.
   - **Rate Limiting:** Unthrottled at the endpoint level ([`/api/member-registration`](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/member-registration/route.ts)) to allow campus-wide concurrent submissions during peak recruitment drives without false 429 rate limit errors.

2. **Phase 2: Written Evaluation (`/evaluation`)**
   - **Actor:** Pre-Registered Member.
   - **Action:** Verifies identity using ID/Phone, then completes a dynamic JSON-driven questionnaire.
   - **Output:** Document created in the `EvaluationData` collection (Status: `Submitted`).

2.5. **Phase 2.5: Waiting Room Check-In (`/dashboard/recruitment/waiting-room`)**
   - **Actor:** Assigned Desk Coordinators, HR EB, R&D EB, GB.
   - **Action:** Front desk enters the student ID of arriving candidates. Verifies online evaluation completion before granting queue entry. Candidates are listed with their preferred department and check-in timestamp.
   - **Status Transitions:** Candidates can be toggled between `Waiting` and `Sent to Board` in any order.
   - **Access Model:** GB, R&D EB, and HR EB manage authorized desk coordinators. Other recruitment leadership (EB of all departments, permitted SE) have read-only visibility.

3. **Phase 3: Interview Assessment (`/dashboard/recruitment` & `/dashboard/evaluation`)**
   - **Actor:** Active Department Directors & Assistant Directors (all departments) / HR / GB / authorized Senior Executives.
   - **Action:** Reviews the written submission, conducts an interview, assigns sub-departments/roles, and logs numerical scores + comments via [`evaluation-assessment.tsx`](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/recruitment/[evaluationID]/evaluation-assessment.tsx).
   - **Transition:** Saving the assessment changes the applicant's status to `Accepted`, `Rejected`, or `Pending`. They are immediately removed from the active interview queue.

4. **Phase 4: Onboarding (`/dashboard/registration`)**
   - **Actor:** Active Department Directors & Assistant Directors (all departments) / HR / GB.
   - **Action:** Reviews 'Accepted' members. The system generates a secure password. Clicking 'Finalize' creates the official Better Auth `user` account and dispatches the welcome email via Nodemailer.

---

## Role-Based Access Control & Alumni Gating

Recruitment data and review tools are restricted to active leadership while empowering all departments to participate in candidate evaluation.

### Universal EB Access
All active Executive Body (EB) members—specifically users with designation **"Director"** or **"Assistant Director"** across *all* departments (Event Management, Creative, Research and Development, Human Resources, Finance, Communication and Marketing, Public Relations, Operations)—possess identical permissions to:
- View the "Recruitment" navigation item in the dashboard sidebar ([`Sidebar.tsx`](file:///C:/Users/hha/Desktop/repo/bucc/src/components/Sidebar.tsx)).
- Access the candidate evaluation queue ([`/dashboard/recruitment`](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/recruitment/page.tsx) and [`/dashboard/evaluation`](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/evaluation/page.tsx)).
- Review, grade, assign tasks, and submit interview assessment rubrics ([`/dashboard/recruitment/[evaluationID]`](file:///C:/Users/hha/Desktop/repo/bucc/src/app/(portal)/dashboard/recruitment/[evaluationID]/evaluation-assessment.tsx)).
- Query candidate batches via [`/api/evaluation/all`](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/evaluation/all/route.ts), [`/api/preregmembers`](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/preregmembers/route.ts), and [`/api/preregmembers/[id]`](file:///C:/Users/hha/Desktop/repo/bucc/src/app/api/preregmembers/[id]/route.ts).

### Dynamic Senior Executive Access
- Senior Executives can access the recruitment evaluation portal only when the system flag `allowSERecruitmentAccess` in `AppConfig` is enabled by Governing Body (GB) leadership.
- When enabled, Senior Executives receive full evaluator parity with Directors and Assistant Directors:
  - Unlocked cross-department task assignment via the department selector dropdown.
  - Complete visibility of tasks and comments across all departments.
  - Full scoring, evaluation submission, and department-level onboarding rights.
- **Dynamic Interviewers List:** The Interviewers list defaults strictly to the baseline hardcoded EB & GB roster. When SE recruitment access is toggled on, active Senior Executives from MongoDB are dynamically fetched and added by their full names so they can be selected as interviewers. General Members, Executives, and Alumni are never included.

### Strict Alumni Exclusion
- Inactive members and Alumni are strictly barred from all recruitment interfaces and APIs.
- The system checks both `memberStatus` (case-insensitive check for `"alumni"` or non-`"active"`) and `designation` (case-insensitive check for `"alumni"`).
- Former Directors, Assistant Directors, or GB members who have stepped down or transitioned to Alumni status cannot access recruitment queues, applicant submissions, or onboarding tools.

---

## The Gatekeeper System

To prevent out-of-cycle applications, the system utilizes a centralized "Gatekeeper".

### Administrative Controls (`/dashboard/broadcast`)
The "Recruitment Pulse" card allows GB, HR, and R&D leadership to manipulate the `AppConfig` database record for `recruitment_config`.
- **Toggles:** Independently open/close Registration and Evaluation.
- **Countdowns:** If closed, admins can set a `targetDate`.
- **Messages:** Admins can define exactly what the closed page should say.

### Enforcement

1. **UI Layer (`IntakeInactive.tsx`):**
   - If a page is closed, the Next.js page component abandons the form render and instead mounts the `IntakeInactive` component.
   - This component displays the custom closure message and a live ticking countdown clock.

2. **API Layer (`/api/preregister` & `/api/evaluation`):**
   - The frontend is not trusted. 
   - Every `POST` request to these endpoints forces a server-side read of the `AppConfig`.
   - If the switch is off, the server aborts the transaction and returns a `403 Forbidden`, effectively sealing the database against direct curl/Postman attacks.
