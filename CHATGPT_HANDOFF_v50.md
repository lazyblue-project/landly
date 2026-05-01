# ChatGPT Handoff — Landly v50

## Current baseline

Use `landly_kor_patch_v50.zip` as the latest full patch baseline.

## What v50 does

v50 adds a production-safe beta feedback loop:

1. Shared `FeedbackPrompt` captures page-level notes locally.
2. `/my` shows feedback insights and lets operators export feedback JSON.
3. `/api/feedback` is added as a guarded API shell for future webhook/database wiring.
4. Backup/export now includes `userFeedbackRecords`.
5. Release audits now check feedback readiness.

## Important files

```text
components/common/feedback-prompt.tsx
components/profile/feedback-insights-panel.tsx
app/api/feedback/route.ts
types/index.ts
store/app-store.ts
components/profile/data-export-card.tsx
scripts/audit-feedback-readiness.mjs
scripts/audit-release-readiness.mjs
lib/release-metadata.ts
data/release-readiness.ts
public/sw.js
```

## Current constraints

- No real feedback database is connected.
- `/api/feedback` validates but does not persist payloads.
- Live map/place/care provider APIs are still guarded/fallback-first.
- Build verification may require running `npm install` locally first.

## Recommended next task

For v51, use feedback exports to decide the next UX patch. Recommended priorities:

1. Add a tester summary dashboard that groups feedback by route/context.
2. Improve the highest-confusion route from v50 feedback.
3. Add optional webhook forwarding to `/api/feedback` only after privacy copy and storage ownership are settled.
4. Continue avoiding live medical/location claims until provider freshness and fallback policies are finalized.

## Suggested validation

```bash
npm run audit:phrases
npm run audit:feedback
npm run audit:release
npm run lint
npm run build
```
