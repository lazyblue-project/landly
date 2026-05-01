# Landly — Developer Context for AI-Assisted Development

> Current baseline: **v49** — QA Guardrails & Release Health  
> Date: 2026-05-02

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
npm run audit:release
npm run lint
npm run build
```

## Current data model

Landly is still an MVP/prototype build. It uses static/demo data and localStorage. v47 added API route shells for map preview and place discovery. v48 added local data portability. v49 adds release guardrails, health checks, and safe route fallbacks.

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

### v49 implementation summary

#### 1. Safe route fallbacks

New files:

```text
app/error.tsx
app/not-found.tsx
```

The error fallback lets users retry the current route or jump to Home/SOS. The not-found fallback guides users away from stale links or hidden feature-flagged routes.

#### 2. Health endpoint

New file:

```text
app/api/health/route.ts
```

The endpoint returns release metadata, core route count, feature flag state, provider key presence, API shell paths, and fallback data mode. It uses `Cache-Control: no-store` and does not expose secret values.

#### 3. Release metadata and Trust Center readiness

New files:

```text
lib/release-metadata.ts
data/release-readiness.ts
components/trust/release-readiness-panel.tsx
```

Updated file:

```text
app/trust/page.tsx
```

Trust Center now shows release-readiness status, guarded live-data notes, and operator checklist items.

#### 4. Release audit script

New file:

```text
scripts/audit-release-readiness.mjs
```

Updated file:

```text
package.json
```

Run:

```bash
npm run audit:release
```

The audit checks v49 required files, phrase coverage, service worker version, backup metadata version, release docs, API route shells, and Trust Center wiring.

#### 5. Version updates

Updated files:

```text
public/sw.js
components/profile/data-export-card.tsx
.env.example
README.md
LANDLY_DEV_CONTEXT.md
PATCH_NOTES_v49.md
CHATGPT_HANDOFF_v49.md
```

## Recommended next step — v50

v50 should focus on a controlled beta handoff package:

1. Add a tester landing page or checklist summary for external reviewers.
2. Add a lightweight issue-export bundle combining beta feedback, translation feedback, and route readiness.
3. Start a single live provider pilot only after server-side key handling and source freshness labels are verified.
