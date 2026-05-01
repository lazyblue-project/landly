# Landly v49

Landly is a mobile-first Next.js PWA for foreigners visiting or settling in Korea. It focuses on practical action flows: airport arrival, transport, tax refund readiness, care/pharmacy help, SOS scripts, Korean phrases, long-stay setup, saved items, offline safety, and trust/freshness checks.

## Current build

- Version focus: **v49 — QA Guardrails & Release Health**
- Framework: Next.js 16 App Router + React 19 + TypeScript
- State: Zustand persisted to localStorage (`landly-app-store`)
- Styling: Tailwind CSS v4
- Data: static/demo data with trust/freshness labels plus safe API route shells
- PWA: `app/manifest.ts` + `public/sw.js`

## What changed through v45-v48

- v45 reduced first-run onboarding, added mode-based bottom navigation, hid beta/partner lanes with feature flags, added SOS romanization/TTS, and added local JSON export.
- v46 added home global search, translation issue reporting, ja/zh beta UI dictionaries, and expanded offline cache coverage.
- v47 added map preview/handoff cards, `/api/map-preview`, `/api/place-discovery`, and a Trust Center data-provider readiness panel.
- v48 added JSON import/export, `.ics` calendar export, local appearance preference, dark-mode bridge CSS, and clearer API fallback metadata.

## What changed in v49

- Added **app-level error fallback** via `app/error.tsx` so users can recover to Home or SOS when a route crashes.
- Added **not-found fallback** via `app/not-found.tsx` for stale links or hidden feature-flagged routes.
- Added **deployment smoke endpoint** at `/api/health`.
- Added **Release Readiness** panel in Trust Center.
- Added `npm run audit:release` to check required v49 files, service worker version, backup metadata version, phrase coverage, docs, and API shells.
- Updated service worker cache version to v49.
- Updated JSON backup metadata version to v49.

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
npm run audit:release
npm run lint
npm run build
```

## Smoke checks after local or Vercel deployment

```text
/api/health
/trust
/offline
/sos
```

`/api/health` reports release version, feature flag state, provider key presence, API shell routes, and core route count. It does not expose secret values.

## Environment variables

Copy `.env.example` to `.env.local`.

```bash
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_FEEDBACK_URL=https://forms.gle/your-form-id
NEXT_PUBLIC_ENABLE_BETA_TOOLS=false
NEXT_PUBLIC_ENABLE_PARTNERS=false

# Future provider keys; keep these server-side.
KAKAO_REST_API_KEY=
NAVER_MAP_CLIENT_ID=
NAVER_MAP_CLIENT_SECRET=
TOURAPI_SERVICE_KEY=
SEOUL_OPEN_DATA_KEY=

# Future Web Push. Do not enable before backend subscription storage exists.
WEB_PUSH_VAPID_PUBLIC_KEY=
WEB_PUSH_VAPID_PRIVATE_KEY=
```

## Product notes

Landly still does **not** guarantee live place, map, refund, or medical data. v49 intentionally focuses on release guardrails and operational safety before live provider calls are enabled. Live provider calls should only be enabled after API terms, quota, server-side key handling, caching, source labels, and failure behavior are confirmed.
