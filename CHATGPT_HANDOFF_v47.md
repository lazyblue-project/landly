# ChatGPT Handoff — Landly v47

## Current baseline

Use `landly_kor_patch_v47.zip` as the latest baseline.

## Patch focus

v47 prepares the project for real map/place API integration while keeping the current build safe for beta testing.

## Key changes

- Added `lib/map-handoff.ts` to generate safe Naver/Kakao/Google map search links.
- Added `components/common/map-preview-card.tsx` and wired it into Place, Care, and Shop cards/detail sheets.
- Added `/api/map-preview` route shell for future static map/geocoding work.
- Added `/api/place-discovery` route shell that currently returns curated static `places` data.
- Added `data/data-provider-pilot.ts` and `components/trust/data-provider-readiness-panel.tsx`.
- Updated Trust Center to show API provider readiness and safety risks.
- Updated `public/sw.js` to v47.
- Updated `.env.example`, `README.md`, `LANDLY_DEV_CONTEXT.md`, and `PATCH_NOTES_v47.md`.

## Validation done

- `node scripts/audit-phrase-coverage.mjs` passed.
- `npm ci` and `tsc --noEmit` could not be completed in this environment due timeout/no dependency install.

## Recommended next patch

v48 should focus on one of the following:

1. Add a server-side map provider adapter with real coordinates/static map rendering.
2. Add TourAPI category mapping and cached discovery response.
3. Add JSON backup import.
4. Add `.ics` export for saved calendar events/deadlines.

Do not expose non-public API keys in client components.
