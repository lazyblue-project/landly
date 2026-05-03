# Landly v54 Patch Notes — Beta Patch Planning Board

## Summary

v54 converts the v53 feedback triage output into a concrete next-patch action plan. The new planning layer keeps the product local-first and guarded for beta/operator use, but makes it easier to decide what should be fixed in the next ZIP patch.

## Added

- `/plan` guarded Beta Patch Plan Board
- `/api/patch-plan` non-persistent API shell
- `lib/beta-patch-plan.ts` planning engine
- `components/admin/beta-patch-planner-dashboard.tsx`
- `npm run audit:plan`
- `NEXT_PUBLIC_ENABLE_PLAN_TOOLS=false`

## Patch planner behavior

The planner consumes `userFeedbackRecords`, `betaFeedbackRecords`, and `translationFeedbackRecords`. It first builds a triage report, then converts issues into patch tasks with priority, workstream, status, suggested owner, effort estimate, release target, acceptance criteria, evidence snippets, and source contexts.

## Updated

- `/more` Beta Tools now links to Patch Plan Board
- `/admin`, `/launch`, and `/triage` link into `/plan`
- `/api/health` reports `planTools`, `/plan`, and `/api/patch-plan`
- `public/sw.js` cache version updated to `v54`
- core release route list includes `/plan`
- release readiness audit checks the new planner files and env flag

## Verification

Run:

```bash
node scripts/audit-phrase-coverage.mjs
node scripts/audit-feedback-readiness.mjs
node scripts/audit-admin-readiness.mjs
node scripts/audit-launch-readiness.mjs
node scripts/audit-triage-readiness.mjs
node scripts/audit-plan-readiness.mjs
node scripts/audit-release-readiness.mjs
```
