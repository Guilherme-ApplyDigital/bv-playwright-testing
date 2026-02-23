# QA Test Plan and Test Cases

## Purpose
Document the formal QA plan and test cases currently covered by automation scripts, plus personalized-content scenarios requested in the board story.

This document is designed for product, QA, and engineering sharing.

## Scope
- Web application: `https://www.bv.com` (default runtime target).
- Framework: Playwright (`chromium` project).
- Coverage type:
  - Functional smoke and navigation.
  - Link integrity and page health.
  - Homepage structure, sections, feature cards.
  - Basic performance and accessibility signals.
  - Highest-traffic route integrity.
  - Formal personalized-content test plan (happy path + edge cases).

## Current Automated Suites (from scripts)

### 1) `tests/bv-homepage.spec.ts`
- Scenario 1 - Homepage load validation
- Scenario 2 - Top navigation menu
- Scenario 3 - Upper-right navigation
- Scenario 4 - Search icon
- Scenario 5 - Homepage feature cards

### 2) `tests/bv-homepage-navigation.spec.ts`
- Top nav - About Us
- Top nav - Who We Serve
- Top nav - What We Do
- Top nav - Sustainability
- Top nav - Projects
- Top nav - Careers
- Upper-right - Contact
- Upper-right - Newsroom
- Search - full flow

### 3) `tests/bv-homepage-structure.spec.ts`
- Header and main navigation
- Hero, CTA and KPIs
- Quick Links
- Lifecycle services
- Footer and link columns

### 4) `tests/bv-homepage-sections.spec.ts`
- Hero - headline and primary CTA
- Hero - KPIs (Years, Projects, Employees)
- Mega nav - About Us dropdown items
- Mega nav - Who we serve dropdown items
- Mega nav - What we do dropdown items
- Mega nav - Sustainability dropdown items
- Section - Solutions intro (infrastructure challenges or Spotlight)
- Section - Solutions Spotlight heading
- Section - Energy Transition Learn more
- Section - Projects block (project link to article)
- Section - Lifecycle services steps visible
- Section - Our sustainable vision
- Section - Our company (purpose, people, insights)
- Footer - all four column headings
- Footer - Accessibility link
- Header - Search button
- Header - Logo link to home

### 5) `tests/bv-homepage-feature-cards.spec.ts`
- Card - It's a new era for power utilities
- Card - Floating solar powers Philippine mine
- Card - AI on the frontlines: battling cyberattacks

### 6) `tests/bv-homepage-deep-links.spec.ts`
- Footer - About Us column: Leadership
- Footer - About Us column: Insights and Resources
- Footer - What we do: Strategic Advisory
- Footer - What we do: Energy Transition
- Footer - Sustainability: Corporate Sustainability
- Footer - Careers: Workplace Culture
- Footer - Legal: Privacy policy
- Footer - Legal: Terms of use

### 7) `tests/bv-homepage-perf-accessibility.spec.ts`
- Performance - basic navigation metrics
- Accessibility - landmarks and main headings
- Accessibility - images with alt text

### 8) `tests/bv-homepage-all-links.spec.ts`
Data-driven smoke on all internal homepage-discovered paths (`tests/data/internalPaths.ts`):
- `/`
- `/about-us`
- `/about-us/awards-and-rankings`
- `/about-us/diversity-equity-and-inclusion`
- `/about-us/employee-ownership`
- `/about-us/foundation`
- `/about-us/governance-and-compliance`
- `/about-us/history`
- `/about-us/insights-and-resources`
- `/about-us/investing-in-innovation`
- `/about-us/leadership`
- `/about-us/safety-and-health`
- `/bolder-vision`
- `/careers`
- `/careers/career-paths`
- `/careers/career-paths/craft-and-construction`
- `/careers/career-paths/early-careers-and-students`
- `/careers/career-paths/early-careers-and-students/ent-accelerator-program`
- `/careers/career-paths/experienced-careers`
- `/careers/career-paths/military-veterans`
- `/careers/equal-opportunity-and-accessibility`
- `/careers/our-hiring-process`
- `/careers/workplace-culture`
- `/contact-us`
- `/news`
- `/newsroom`
- `/office-locations`
- `/perspectives/ai-on-the-frontlines-battling-cyberattacks-to-protect-critical-infrastructure`
- `/privacy-notice`
- `/projects`
- `/projects/black-and-veatch-clients-sustainability-project-will-increase-production-at`
- `/projects/delivering-the-philippines-first-lng-to-power-project`
- `/projects/developing-biomass-gasification-for-hydrogen-production`
- `/projects/plant-upgrade-minimizes-wastewater-discharge-into-ocean-maximizes-production`
- `/projects/responsible-mining-carmen-copper-floating-solar-project-in-philippines`
- `/resources/2025-electric-report`
- `/sustainability`
- `/sustainability/client-sustainability`
- `/sustainability/community-sustainability`
- `/sustainability/corporate-sustainability`
- `/suppliers`
- `/terms-of-use`
- `/what-we-do`
- `/what-we-do/energy-transition`
- `/what-we-do/energy-transition/hydrogen-and-ammonia`
- `/what-we-do/environmental`
- `/what-we-do/fuels`
- `/what-we-do/industrial-cybersecurity`
- `/what-we-do/lifecycle-services`
- `/what-we-do/power-delivery`
- `/what-we-do/power-generation`
- `/what-we-do/process`
- `/what-we-do/strategic-advisory`
- `/what-we-do/water`
- `/where-we-work/americas`
- `/where-we-work/asia-pacific`
- `/where-we-work/europe`
- `/where-we-work/middle-east-and-africa`
- `/who-we-serve`
- `/who-we-serve/commercial`

### 9) `tests/highest-traffic.spec.ts`
Generated QA scenarios on critical paths:
- Homepage business-critical smoke - `/`
- Careers funnel stability - `/careers`
- Contact path integrity - `/contact-us`
- Locations discovery reliability - `/office-locations`
- Projects browse flow - `/projects`
- Asia Pacific regional page integrity - `/where-we-work/asia-pacific`
- About Us content integrity - `/about-us`
- Localized careers route health - `/en-US/careers`
- Hiring process journey health - `/careers/our-hiring-process`
- Leadership page reliability - `/about-us/leadership`
- Locations hub route integrity - `/locations` (kept visible as known defect indicator when failing)
- Locations Americas integrity - `/locations/americas`
- Locations Asia Pacific integrity - `/locations/asia-pacific`
- Locations Europe integrity - `/locations/europe`
- Locations MEA integrity - `/locations/middle-east-and-africa`

## Formal Personalized Content QA Plan (Story Coverage)

Note: The existing suites are mostly route/health/navigation focused. The following cases define the formal personalization plan to validate targeting behavior end-to-end.

### Test Data Model
- Segment A: user belongs to exactly one segment.
- Segment B: user belongs to another single segment.
- Segment AB: user belongs to multiple segments simultaneously.
- Segment None: user does not match any targeting rule.
- Anonymous user profile.
- Returning user profile (with persisted state/cookies).

### Personalization Test Cases

#### Happy Path Targeting
- `PC-001` - Single segment sees expected personalized hero/banner.
  - Preconditions: user in Segment A only.
  - Steps: open targeted page, wait for personalization resolve, capture visible hero module.
  - Expected: A-content visible, default content hidden.

- `PC-002` - Different segment sees its own variant.
  - Preconditions: user in Segment B only.
  - Steps: same as above.
  - Expected: B-content visible, A-content hidden.

- `PC-003` - Returning user keeps consistent personalized variant.
  - Preconditions: user in Segment A with persisted session.
  - Steps: visit page, refresh, revisit from another entry route.
  - Expected: variant remains stable across navigation and refresh.

#### Multi-Segment / Conflict Resolution
- `PC-004` - User in multiple segments gets deterministic winner.
  - Preconditions: user in Segment A and Segment B.
  - Steps: load page under AB profile.
  - Expected: one variant selected by configured priority rule; no flicker between variants.

- `PC-005` - Multi-segment user with equal-priority rules.
  - Preconditions: user in AB, same-priority rules configured.
  - Steps: load page multiple times.
  - Expected: deterministic fallback policy applied consistently (for example, first rule, highest score, or explicit tie-breaker).

- `PC-006` - Segment removal updates content correctly.
  - Preconditions: user starts in AB, then A only.
  - Steps: simulate identity update, reload page.
  - Expected: content transitions from AB winner to A variant without stale module.

#### Edge and Resilience Cases
- `PC-007` - No matching segment falls back to default.
  - Preconditions: Segment None.
  - Expected: default experience shown; no empty personalization container.

- `PC-008` - Anonymous user fallback.
  - Preconditions: no login/profile.
  - Expected: anonymous/default variant shown; no console/runtime error.

- `PC-009` - Personalization API timeout/degraded response.
  - Preconditions: inject delayed or failed personalization response.
  - Expected: page remains functional, default content rendered, graceful telemetry logged.

- `PC-010` - Cached old segment vs fresh segment mismatch.
  - Preconditions: stale cache indicates A, server returns B.
  - Expected: final UI converges to server-authoritative variant without broken layout.

- `PC-011` - Accessibility of personalized modules.
  - Preconditions: any personalized variant.
  - Expected: heading structure valid, images have alt, interactive controls are labeled.

- `PC-012` - Analytics/tracking correctness per variant.
  - Preconditions: each segment profile.
  - Expected: impression and click events contain correct variant and segment metadata.

## Entry/Exit Criteria
- Entry:
  - Test data profiles available (A, B, AB, None, Anonymous).
  - Environment and targeting rules published.
  - Observability enabled (console/network/events).
- Exit:
  - Critical tests pass (`PC-001` to `PC-010`).
  - No blocking accessibility regressions on personalized modules.
  - No unresolved P1/P2 defects in personalization logic.

## Reporting Format (recommended)
- Include for each run:
  - Environment and build ID.
  - Profile/segment used.
  - Expected variant vs actual variant.
  - Screenshot or trace evidence.
  - Defect classification (system bug vs test/script issue).

