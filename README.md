# Landly v47

Landly is a mobile-first Next.js PWA for foreigners visiting or settling in Korea. The app focuses on practical actions: airport arrival, transit, tax refund readiness, care/pharmacy help, SOS scripts, long-stay setup, saved items, offline safety, and trust/freshness checks.

## Current build

- Version focus: **v47 — API-ready Map & Data Provider Pilot**
- Framework: Next.js 16 App Router + React 19 + TypeScript
- State: Zustand persisted to localStorage (`landly-app-store`)
- Styling: Tailwind CSS v4
- Data: static/demo data with trust/freshness labels plus safe API route shells
- PWA: `app/manifest.ts` + `public/sw.js`

## What changed through v45-v46

- v45 reduced first-run onboarding to a faster two-step flow, added mode-based bottom navigation, hid beta/partner lanes with feature flags, added SOS romanization/TTS, and added local JSON export.
- v46 added home global search, translation issue reporting, ja/zh beta UI dictionaries, and expanded offline cache coverage.

## What changed in v47

- Added a reusable **Map Preview Pilot** card for places, care providers, and shop stores.
- Added generated Naver/Kakao/Google map handoff links from place name + area.
- Added `/api/map-preview` as a safe route shell that returns generated map links without exposing provider secrets.
- Added `/api/place-discovery` as a static fallback endpoint to prepare the UI contract before TourAPI integration.
- Added a Trust Center **Data Provider Pilot** panel showing required keys, fallback mode, risks, and next steps.
- Updated service worker cache version to v47.
- Added server-side-only API key placeholders in `.env.example`.

## Getting started

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3001
```

## Useful commands

```bash
npm run audit:phrases
npm run lint
npm run build
```

## Environment variables

Copy `.env.example` to `.env.local`.

```bash
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_FEEDBACK_URL=https://forms.gle/your-form-id
NEXT_PUBLIC_ENABLE_BETA_TOOLS=false
NEXT_PUBLIC_ENABLE_PARTNERS=false

# v47 future API pilot keys; keep these server-side.
KAKAO_REST_API_KEY=
NAVER_MAP_CLIENT_ID=
NAVER_MAP_CLIENT_SECRET=
TOURAPI_SERVICE_KEY=
SEOUL_OPEN_DATA_KEY=
```

## Product notes

Landly still does **not** guarantee live place, map, refund, or medical data. v47 intentionally keeps external provider integration conservative: the UI is wired for map/data discovery, but live API usage should only be enabled after API terms, quota, server-side key handling, caching, and fallback behavior are confirmed.
