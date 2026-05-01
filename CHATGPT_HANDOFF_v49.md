# Landly v49 Handoff

## Current baseline

Use `landly_kor_patch_v49.zip` as the latest baseline.

## Patch goal

v49 focuses on release guardrails rather than new product surface area:

- safe route error recovery
- not-found recovery
- deployment health endpoint
- Trust Center release-readiness visibility
- release audit command
- v49 service worker/cache metadata

## Key files added

```text
app/error.tsx
app/not-found.tsx
app/api/health/route.ts
lib/release-metadata.ts
data/release-readiness.ts
components/trust/release-readiness-panel.tsx
scripts/audit-release-readiness.mjs
PATCH_NOTES_v49.md
CHATGPT_HANDOFF_v49.md
```

## Key files updated

```text
app/trust/page.tsx
components/profile/data-export-card.tsx
components/trust/data-provider-readiness-panel.tsx
public/sw.js
.env.example
package.json
README.md
LANDLY_DEV_CONTEXT.md
```

## Commands to run after unpacking

```bash
npm install
npm run audit:phrases
npm run audit:release
npm run lint
npm run build
```

## Smoke test routes

```text
/
/trust
/offline
/sos
/api/health
```

## Important product constraint

Do not present place, medical, map, refund, or settlement data as guaranteed live data. API provider integrations are still fallback-first until server-side key handling, quota policy, caching, and source freshness labels are fully verified.

## Recommended v50 direction

Create a controlled external-beta package:

1. Tester landing/checklist summary.
2. Combined beta issue export: UX feedback + translation feedback + readiness metadata.
3. Optional single-provider live API pilot only after server-side keys and freshness labels are ready.
