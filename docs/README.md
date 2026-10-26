# BUCC Web Portal: Documentation Index

Welcome to the official engineering documentation for the BRAC University Computer Club (BUCC) Web Portal. This documentation suite is maintained by the core engineering team and serves as the definitive source of truth for the platform's architecture, APIs, and design systems.

## Documentation Suite

Please refer to the following documents for deep dives into specific engineering domains:

1. **[System Architecture](./ARCHITECTURE.md)**
   - Core technology stack
   - The Unified `User` Model ("One Source of Truth")
   - Database schemas and relationships
   - Role-Based Access Control (RBAC) hierarchy and Alumni gating

2. **[API Reference](./API_REFERENCE.md)**
   - RESTful endpoint specifications
   - Authentication & session management via Better Auth
   - Payload schemas and response contracts
   - Server-side gating implementation and evaluation APIs

3. **[Design System & UI/UX](./DESIGN_SYSTEM.md)**
   - The "Anthropic Minimalist" aesthetic mandate
   - Component architecture (Radix UI + Tailwind)
   - Theme-aware visual branding and logo distribution
   - Accessibility and motion guidelines

4. **[Recruitment Lifecycle](./RECRUITMENT_LIFECYCLE.md)**
   - The end-to-end applicant onboarding flow
   - The Gatekeeper system (AppConfig master switches)
   - State machine: Pre-Reg -> Evaluation -> Acceptance -> Onboarding
   - Universal EB permissions and strict Alumni gating policies

5. **[Public Member Profiles](./PUBLIC_PROFILE_PLAN.md)**
   - The member directory (`/people`) and customized dynamic slug routes (`/m/[slug]`)
   - Mongoose data schema expansion and security parameters
   - Peer recommendation system (Testimonials)
   - Performance features (GitHub live chart, client-side list slicing)

## Engineering Philosophy

As we scale this v2 platform, we adhere to the following principles:
- **Simplicity over Cleverness:** Avoid complex abstractions where explicit composition suffices.
- **Data Integrity:** Protect core collections aggressively. Never trust client-side state without server-side validation.
- **Visual Restraint:** Let the content breathe. Rely on typography and spacing, not heavy shadows or excessive color.
- **Robustness:** Ensure fallback states (like the `IntakeInactive` screens) are just as polished as the happy paths.
