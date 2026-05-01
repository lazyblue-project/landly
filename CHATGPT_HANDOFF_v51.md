# ChatGPT Handoff — Landly v51

## Current baseline

Use `landly_kor_patch_v51.zip` as the latest full patch baseline.

## What v51 does

v51 adds a guarded operator dashboard for closed-beta triage:

1. `/admin` summarizes local feedback, translation QA, saved-item activity, schedules, tester progress, and guarded feature status.
2. `/admin` can export a `landly-operator-snapshot-YYYY-MM-DD.json` file.
3. More shows an Operator Insights entry when beta tools are enabled.
4. `/api/health` reports the admin feature flag and admin shell path.
5. Release/admin audit scripts verify the new route and metadata.

## Important files

```text
app/admin/page.tsx
components/admin/operator-insights-dashboard.tsx
app/more/page.tsx
components/layout/bottom-nav.tsx
lib/feature-flags.ts
app/api/health/route.ts
lib/release-metadata.ts
data/release-readiness.ts
scripts/audit-admin-readiness.mjs
scripts/audit-release-readiness.mjs
components/profile/data-export-card.tsx
components/profile/feedback-insights-panel.tsx
public/sw.js
```

## Environment variables

```bash
NEXT_PUBLIC_ENABLE_ADMIN_TOOLS=false
NEXT_PUBLIC_ENABLE_BETA_TOOLS=false
NEXT_PUBLIC_ENABLE_FEEDBACK_API=false
```

Admin access is available when `NEXT_PUBLIC_ENABLE_ADMIN_TOOLS=true` or when the local user is marked as a beta tester.

## Current constraints

- `/admin` is local-device only and does not aggregate feedback across multiple users.
- `/api/feedback` remains a validation-only API stub unless future webhook/database storage is intentionally connected.
- API provider data remains fallback-first.
- Build verification may require running `npm install` locally first.

## Recommended next task

For v52, choose one of two directions:

1. **Closed-beta triage patch**: use exported operator snapshots to fix the highest-confusion route.
2. **Private feedback storage pilot**: connect `/api/feedback` to a server-side webhook/database after privacy copy, retention policy, and owner workflow are decided.

Avoid broad live medical/location API claims until freshness labels, fallback states, and provider terms are finalized.

## Suggested validation

```bash
npm run audit:phrases
npm run audit:feedback
npm run audit:admin
npm run audit:release
npm run lint
npm run build
```
