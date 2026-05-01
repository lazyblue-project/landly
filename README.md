# Landly v50

Landly is a mobile-first Next.js PWA for foreigners visiting or settling in Korea. It focuses on practical action flows: airport arrival, transport, tax refund readiness, care/pharmacy help, SOS scripts, Korean phrases, long-stay setup, saved items, offline safety, trust/freshness checks, and beta feedback loops.

## Current build

- Version focus: **v50 — Beta Launch Feedback Loop**
- Framework: Next.js 16 App Router + React 19 + TypeScript
- State: Zustand persisted to localStorage (`landly-app-store`)
- Styling: Tailwind CSS v4
- Data: static/demo data with trust/freshness labels plus safe API route shells
- PWA: `app/manifest.ts` + `public/sw.js`

## What changed through v45-v49

- v45 reduced first-run onboarding, added mode-based bottom navigation, hid beta/partner lanes with feature flags, added SOS romanization/TTS, and added local JSON export.
- v46 added home global search, translation issue reporting, ja/zh beta UI dictionaries, and expanded offline cache coverage.
- v47 added map preview/handoff cards, `/api/map-preview`, `/api/place-discovery`, and a Trust Center data-provider readiness panel.
- v48 added JSON import/export, `.ics` calendar export, local appearance preference, dark-mode bridge CSS, and clearer API fallback metadata.
- v49 added app-level error fallback, not-found fallback, `/api/health`, Trust Center release readiness, and `audit:release`.

## What changed in v50

- Replaced external-only feedback prompts with an **in-app feedback capture flow**.
- Added `UserFeedbackRecord` records to Zustand/localStorage.
- Added **Feedback loop** insights and JSON export in `/my`.
- Added guarded `/api/feedback` route shell for future webhook/database wiring.
- Added `npm run audit:feedback` and included it in release readiness checks.
- Updated `/api/health` to report feedback API feature flag state and the feedback API shell.
- Updated service worker cache version and JSON backup metadata to v50.

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
npm run audit:feedback
npm run audit:release
npm run lint
npm run build
```

## Smoke checks after local or Vercel deployment

```text
/api/health
/api/feedback      # POST only; validates feedback payloads
/trust
/my
/offline
/sos
```

`/api/health` reports release version, feature flag state, provider key presence, API shell routes, and core route count. It does not expose secret values.

## Environment variables

Copy `.env.example` to `.env.local`.

```bash
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_FEEDBACK_URL=https://forms.gle/your-form-id
NEXT_PUBLIC_ENABLE_FEEDBACK_API=false
LANDLY_FEEDBACK_WEBHOOK_URL=
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

Landly still does **not** guarantee live place, map, refund, or medical data. v50 intentionally focuses on beta launch learning: collect user confusion points, export feedback, and use repeated notes to decide the next patch. Keep `/api/feedback` guarded until server-side storage, privacy copy, and webhook/database ownership are finalized.
