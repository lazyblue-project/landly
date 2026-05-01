# Landly v53

Landly is a mobile-first PWA MVP for foreigners visiting or settling in Korea. It helps users with arrival, transport, tax-refund shopping, care/SOS, long-stay setup, Korean phrase cards, offline preparation, feedback capture, and beta launch operations.

## Version focus

**v53 — Beta Feedback Triage Board**

This release adds a guarded `/launch` page that turns local tester signals into a beta launch checklist, readiness score, and exportable launch report. It builds on v51 Operator Insights.

## Run locally

```bash
npm install
npm run dev
# http://localhost:3001
```

## Recommended checks

```bash
npm run audit:phrases
npm run audit:feedback
npm run audit:admin
npm run audit:launch
npm run audit:release
npm run build
```

## Feature flags

```bash
NEXT_PUBLIC_ENABLE_BETA_TOOLS=false
NEXT_PUBLIC_ENABLE_PARTNERS=false
NEXT_PUBLIC_ENABLE_FEEDBACK_API=false
NEXT_PUBLIC_ENABLE_ADMIN_TOOLS=false
NEXT_PUBLIC_ENABLE_LAUNCH_TOOLS=false
```

Local beta tester mode can also unlock beta/admin/launch tools on a single device.

## Important routes

- `/` — Home
- `/onboarding` — first-run setup
- `/pass` — arrival and transport
- `/shop` — tax refund and shopping
- `/care` — clinics, pharmacy, visit prep
- `/sos` — emergency help
- `/assistant` — Korean phrase cards
- `/my` — saved data, backup, feedback insights
- `/trust` — trust/readiness center
- `/admin` — guarded operator insights
- `/launch` — guarded beta launch checklist and report
- `/api/health` — release health smoke check

## Current limitation

Landly still uses fallback-first static/demo data for most place, map, refund, and medical flows. v53 focuses on beta launch readiness, not live data guarantees. Keep feedback API and provider integrations guarded until server-side ownership, privacy copy, and data policies are finalized.

## v53 Beta triage

v53 adds a guarded beta feedback triage board.

```bash
npm run audit:triage
```

Routes:

- `/triage` — local-first feedback priority board
- `/api/triage` — non-persistent triage report shell

Feature flag:

```bash
NEXT_PUBLIC_ENABLE_TRIAGE_TOOLS=false
```
