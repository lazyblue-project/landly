# Landly — Developer Context for AI-Assisted Development

> Current baseline: **v47** — API-ready Map & Data Provider Pilot  
> Date: 2026-04-30

## Project overview

Landly is a mobile-first PWA that helps foreigners visit or live in Korea. It is organized around real-life situations rather than generic menus: arrival, transport, shopping/refund, care/pharmacy, SOS, Korean phrases, long-stay settlement, saved items, offline safety, and trust/freshness checks.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand persist |
| Icons | lucide-react |
| PWA | `app/manifest.ts`, `public/sw.js` |

## Run commands

```bash
npm install
npm run dev       # http://localhost:3001
npm run audit:phrases
npm run lint
npm run build
```

## Current data model

Landly is still an MVP/prototype build. It uses static/demo data and localStorage. v47 adds API route shells for map preview and place discovery, but live provider integration is not enabled by default.

Important trust rule: demo/static information must stay clearly labeled and should not be treated as guaranteed live information.

## v45 summary

- Two-step fast onboarding with optional setup.
- Mode-based bottom navigation.
- Feature flags for beta tools and partner lanes.
- SOS romanization + browser TTS.
- Local JSON export from My.
- Service worker cache expansion.

## v46 summary

- Home global search across phrases, places, care, SOS, shop, stay, and official sources.
- Translation issue reporting from phrase cards.
- ja/zh beta UI dictionaries.
- Translation feedback included in local exports.

## v47 implementation summary

### 1. Map handoff and preview shell

New files:

```text
lib/map-handoff.ts
components/common/map-preview-card.tsx
app/api/map-preview/route.ts
```

The map preview card is now shown on:

```text
components/common/place-card.tsx
components/care/care-provider-card.tsx
components/care/care-provider-detail-sheet.tsx
components/shop/shop-store-card.tsx
components/shop/shop-store-detail-sheet.tsx
```

The card generates Naver/Kakao/Google search links from the place name and area. It does not expose API secrets and does not claim exact live pin accuracy.

### 2. Static fallback place discovery endpoint

New file:

```text
app/api/place-discovery/route.ts
```

This endpoint returns curated `data/places.ts` results and exposes a future API contract before TourAPI is enabled.

### 3. Data provider readiness in Trust Center

New files:

```text
data/data-provider-pilot.ts
components/trust/data-provider-readiness-panel.tsx
```

The Trust Center now lists map, TourAPI, Seoul Open Data, and Web Push readiness with required keys, fallback behavior, next steps, and risk notes.

### 4. Environment variables

`.env.example` now includes future provider keys:

```bash
KAKAO_REST_API_KEY=
NAVER_MAP_CLIENT_ID=
NAVER_MAP_CLIENT_SECRET=
TOURAPI_SERVICE_KEY=
SEOUL_OPEN_DATA_KEY=
```

Keep these server-side. Do not use non-public provider secrets in client components.

## Recommended next steps

### v48

- Add server-side map provider adapter with geocoding/static map support.
- Add TourAPI category mapping and cache layer.
- Add JSON import for local backups.
- Add .ics export for saved calendar events and deadlines.
- Add admin/source freshness review flow.
