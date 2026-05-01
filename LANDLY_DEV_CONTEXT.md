# Landly — Developer Context for AI-Assisted Development

> Current baseline: **v52** — Beta Launch Feedback Loop  
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

Landly is still an MVP/prototype build. It uses static/demo data and localStorage. v47 added API route shells for map preview and place discovery. v48 added local data portability. v49 added release guardrails, health checks, and safe route fallbacks. v51 adds in-app feedback capture and a guarded feedback API shell.

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

### v51 implementation summary

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

Backups now include `userFeedbackRecords` and use metadata version `v51`.

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

## Next recommended direction after v51

1. Run a closed beta with 5-10 users and collect local feedback exports.
2. Convert repeated `confusing`, `missing`, and `bug` notes into a v51 product patch.
3. Only then connect `/api/feedback` to real storage or a private webhook.
4. Keep live map/place/care APIs in fallback mode until provider terms, caching, quota, and source freshness labels are finalized.


### v51 implementation summary

#### 1. Operator Insights route

New files:

```text
app/admin/page.tsx
components/admin/operator-insights-dashboard.tsx
```

The route is guarded by local beta tester mode or `NEXT_PUBLIC_ENABLE_ADMIN_TOOLS=true`. It summarizes feedback, translation QA, saved activity, schedule activity, tester progress, guarded feature status, and exports a local operator snapshot.

#### 2. Admin gate and navigation

Updated files:

```text
lib/feature-flags.ts
app/more/page.tsx
components/layout/bottom-nav.tsx
.env.example
```

New feature flag:

```bash
NEXT_PUBLIC_ENABLE_ADMIN_TOOLS=false
```

#### 3. Release metadata and audits

Updated files:

```text
lib/release-metadata.ts
data/release-readiness.ts
app/api/health/route.ts
public/sw.js
components/profile/data-export-card.tsx
components/profile/feedback-insights-panel.tsx
```

New file:

```text
scripts/audit-admin-readiness.mjs
```

Package command:

```bash
npm run audit:admin
```

## Next recommended direction after v51

1. Run closed-beta sessions and export `landly-operator-snapshot-YYYY-MM-DD.json` from /admin.
2. Fix the highest-confusion route before adding broad live-data features.
3. Consider private feedback storage only after privacy copy, retention policy, and operator workflow are defined.

### v52 implementation summary

Landly v52 adds the guarded `/launch` Beta Launch Control Room. It provides a required launch checklist, readiness score, automatic local smoke signals, `/api/health` handoff, and `landly-beta-launch-report` export. Use `/launch` before sharing a beta link and `/admin` after each tester round.

New/updated files include:

- `app/launch/page.tsx`
- `components/admin/beta-launch-control-room.tsx`
- `data/beta-launch-checklist.ts`
- `scripts/audit-launch-readiness.mjs`
- `lib/release-metadata.ts`
- `app/api/health/route.ts`

Next recommended direction: run a real tester round, export `/launch` and `/admin` reports, then patch the most repeated confusing/missing/bug signals before adding live API dependencies.
