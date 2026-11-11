# Development Phases: NeuroNiv

## Phase 1: MVP Landing Page (Current)
**Goal:** Establish the online presence with a premium, high-conversion landing page.
- Implement HTML/CSS structure based on the Techlusion reference.
- Integrate Bootstrap for grid management.
- Develop custom animations (glassmorphism, cursors, scroll effects).
- Create core documentation (`prd.md`, `architechture.md`, etc.).

## Phase 2: Dynamic Content & Analytics Integration
**Goal:** Make the site measurable and easier to update.
- Integrate Google Analytics and Meta Pixel for conversion tracking.
- Convert static partner logos and services sections to render from a lightweight JSON configuration file to allow easier updates without deep HTML edits.
- Add a functional Contact Form linked to a backend service (e.g., Formspree, AWS API Gateway + Lambda).

## Phase 3: Headless Migration & Content Marketing
**Goal:** Support a content strategy (blog, case studies) for SEO.
- Migrate the static site to a framework like Next.js or Astro.
- Integrate a Headless CMS.
- Create dynamic routing for case studies and insight articles.
- Implement advanced SEO metadata and structured data (JSON-LD).

## Phase 4: Customer Portal / AI Dashboard
**Goal:** Add functional product capabilities to the marketing site.
- Implement secure User Authentication (e.g., Auth0, Firebase).
- Build a client dashboard for users to track project progress, view AI insights, and manage their account.
- Integrate AI-driven chat/support agents directly into the portal.
