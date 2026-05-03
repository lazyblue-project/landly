# ChatGPT Handoff — Landly v54

## Current baseline

- Version: `v54`
- Release name: `Beta Patch Planning Board`
- Main new route: `/plan`
- New API shell: `/api/patch-plan`
- New audit: `npm run audit:plan`

## What v54 adds

v54 turns beta triage into an execution-ready patch queue. The new `/plan` page is hidden for general users and becomes available when `NEXT_PUBLIC_ENABLE_PLAN_TOOLS=true`, admin/triage tools are enabled, or local beta tester mode is enabled.

The planner converts local tester signals into patch tasks with owner, effort, release target, status, acceptance criteria, source evidence, and contexts.

## Important files

- `app/plan/page.tsx`
- `app/api/patch-plan/route.ts`
- `components/admin/beta-patch-planner-dashboard.tsx`
- `lib/beta-patch-plan.ts`
- `scripts/audit-plan-readiness.mjs`
- `lib/release-metadata.ts`
- `app/api/health/route.ts`
- `app/more/page.tsx`
- `public/sw.js`

## QA checklist

```bash
node scripts/audit-phrase-coverage.mjs
node scripts/audit-feedback-readiness.mjs
node scripts/audit-admin-readiness.mjs
node scripts/audit-launch-readiness.mjs
node scripts/audit-triage-readiness.mjs
node scripts/audit-plan-readiness.mjs
node scripts/audit-release-readiness.mjs
```

Manual smoke test: enable beta tester mode, open `/more`, open `/triage`, then `/plan`, export `landly-beta-patch-plan-YYYY-MM-DD.json`, and confirm `/api/health` includes `planTools`, `/plan`, and `/api/patch-plan`.
