# Landly — Developer Context for AI-Assisted Development

> Current baseline: **v50** — Beta Launch Feedback Loop  
> Date: 2026-05-02

## Project overview

Landly is a mobile-first PWA that helps foreigners visit or live in Korea. It is organized around real-life situations rather than generic menus: arrival, transport, shopping/refund, care/pharmacy, SOS, Korean phrases, long-stay settlement, saved items, offline safety, trust/freshness checks, and beta feedback loops.

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
npm run audit:feedback
npm run audit:release
npm run lint
npm run build
```

## Current data model

Landly is still an MVP/prototype build. It uses static/demo data and localStorage. v47 added API route shells for map preview and place discovery. v48 added local data portability. v49 added release guardrails, health checks, and safe route fallbacks. v50 adds in-app feedback capture and a guarded feedback API shell.

Important trust rule: demo/static information must stay clearly labeled and should not be treated as guaranteed live information.

## Version history summary

### v45

- Two-step fast onboarding with optional setup.
- Mode-based bottom navigation.
- Feature flags for beta tools and partner lanes.
- SOS romanization + browser TTS.
- Local JSON export from My.
- Service worker cache expansion.

### v46

- Home global search across phrases, places, care, SOS, shop, stay, and official sources.
- Translation issue reporting from phrase cards.
- ja/zh beta UI dictionaries.
- Translation feedback included in local exports.

### v47

- Reusable Map Preview Pilot card for places, care providers, and shop stores.
- Generated Naver/Kakao/Google map handoff links.
- `/api/map-preview` safe route shell.
- `/api/place-discovery` static fallback endpoint.
- Trust Center data provider readiness panel.

### v48

- `/my` JSON import/export.
- `/calendar` `.ics` export.
- Local System/Light/Dark appearance preference.
- Dark-mode bridge CSS.
- API route fallback metadata.

### v49

- `app/error.tsx` and `app/not-found.tsx` safe route fallbacks.
- `/api/health` deployment smoke endpoint.
- Trust Center release-readiness panel.
- `scripts/audit-release-readiness.mjs`.

### v50 implementation summary

#### 1. In-app feedback capture

Updated file:

```text
components/common/feedback-prompt.tsx
```

The shared feedback prompt now supports local feedback capture with category, rating, note, page path, language, and app mode. It keeps the external feedback form/mail link as a fallback.

#### 2. Feedback state and backup support

Updated files:

```text
types/index.ts
store/app-store.ts
components/profile/data-export-card.tsx
```

New type:

```ts
UserFeedbackRecord
```

New persisted state:

```ts
userFeedbackRecords
```

Backups now include `userFeedbackRecords` and use metadata version `v50`.

#### 3. My feedback insights

New file:

```text
components/profile/feedback-insights-panel.tsx
```

Updated file:

```text
app/my/page.tsx
```

The My page shows feedback count, average clarity score, category distribution, recent notes, and JSON export.

#### 4. Guarded feedback API shell

New file:

```text
app/api/feedback/route.ts
```

The route validates feedback payloads and returns an accepted response, but does not persist data in the MVP. It is intended for future server-side webhook/database wiring.

Relevant env vars:

```bash
NEXT_PUBLIC_ENABLE_FEEDBACK_API=false
LANDLY_FEEDBACK_WEBHOOK_URL=
```

#### 5. Release/audit updates

Updated files:

```text
lib/release-metadata.ts
data/release-readiness.ts
app/api/health/route.ts
public/sw.js
scripts/audit-release-readiness.mjs
```

New file:

```text
scripts/audit-feedback-readiness.mjs
```

Package command:

```bash
npm run audit:feedback
```

## Next recommended direction after v50

1. Run a closed beta with 5-10 users and collect local feedback exports.
2. Convert repeated `confusing`, `missing`, and `bug` notes into a v51 product patch.
3. Only then connect `/api/feedback` to real storage or a private webhook.
4. Keep live map/place/care APIs in fallback mode until provider terms, caching, quota, and source freshness labels are finalized.
