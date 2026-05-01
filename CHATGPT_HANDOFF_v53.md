# Landly v53 Handoff — Beta Feedback Triage Board

## Current baseline
Use `landly_kor_patch_v53.zip` as the latest baseline.

## What changed in v53
- Added guarded `/triage` page.
- Added `components/admin/feedback-triage-dashboard.tsx`.
- Added `lib/beta-triage.ts` to compute P0/P1/P2/P3 patch priorities.
- Added `/api/triage` non-persistent analysis shell.
- Updated `/more`, `/admin`, `/launch`, `/api/health`, service worker, release metadata, and environment docs.
- Added `npm run audit:triage`.

## Feature flag
```bash
NEXT_PUBLIC_ENABLE_TRIAGE_TOOLS=false
```

The triage page is visible when:
- `NEXT_PUBLIC_ENABLE_TRIAGE_TOOLS=true`, or
- admin tools are enabled, or
- local Beta Tester mode is enabled.

## Validation commands
```bash
node scripts/audit-phrase-coverage.mjs
node scripts/audit-feedback-readiness.mjs
node scripts/audit-admin-readiness.mjs
node scripts/audit-launch-readiness.mjs
node scripts/audit-triage-readiness.mjs
node scripts/audit-release-readiness.mjs
```

## Recommended next step
v54 should focus on one of these paths depending on v53 triage output:

1. If P0/P1 safety or bug issues exist: patch those first.
2. If translation issues dominate: expand ja/zh UI translation coverage and phrase QA.
3. If no critical issues exist: begin a small real-data pilot, preferably map/static preview or TourAPI exploration.

## Important constraint
Do not connect persistence to `/api/triage` until a privacy-safe storage strategy is selected. The current API intentionally returns `persisted: false`.
