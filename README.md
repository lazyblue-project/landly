# Landly v54

**v54 — Beta Patch Planning Board**

Landly is a mobile-first PWA for foreigners visiting or settling in Korea. It focuses on practical flows such as airport arrival, tax refund preparation, hospital/pharmacy support, SOS phrases, long-stay setup, saved reminders, and beta feedback collection.

v54 adds an operator-facing planning layer that turns beta feedback triage into concrete next-patch tasks.

## Run locally

```bash
npm install
npm run dev
# http://localhost:3001
```

## Useful scripts

```bash
npm run audit:phrases
npm run audit:feedback
npm run audit:admin
npm run audit:launch
npm run audit:triage
npm run audit:plan
npm run audit:release
npm run build
```

## Key routes

- `/` — home
- `/onboarding` — fast onboarding
- `/pass` — arrival/pass flow
- `/shop` — tax refund and shopping support
- `/care` — care/hospital/pharmacy support
- `/sos` — emergency help
- `/stay` and `/life` — long-stay setup
- `/my` — profile, backup, feedback insights
- `/trust` — trust/readiness information
- `/admin` — operator insights
- `/launch` — beta launch control room
- `/triage` — beta feedback triage board
- `/plan` — beta patch planning board

## Feature flags

```bash
NEXT_PUBLIC_ENABLE_BETA_TOOLS=false
NEXT_PUBLIC_ENABLE_PARTNERS=false
NEXT_PUBLIC_ENABLE_FEEDBACK_API=false
NEXT_PUBLIC_ENABLE_ADMIN_TOOLS=false
NEXT_PUBLIC_ENABLE_LAUNCH_TOOLS=false
NEXT_PUBLIC_ENABLE_TRIAGE_TOOLS=false
NEXT_PUBLIC_ENABLE_PLAN_TOOLS=false
```

## Data mode

Landly remains fallback-first. Most place, map, refund, and medical flows use static/demo data or API shells until server-side provider keys, policies, and data freshness rules are finalized.
