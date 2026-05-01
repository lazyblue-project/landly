# Landly v53 Patch Notes — Beta Feedback Triage Board

## Goal
Turn closed-beta feedback into a concrete next-patch queue instead of leaving notes scattered across My, Test, Launch, and Operator screens.

## Added

### 1. Guarded Beta Triage page
- Added `/triage`.
- Access is guarded by `NEXT_PUBLIC_ENABLE_TRIAGE_TOOLS=true`, admin tools, or local Beta Tester mode.
- The page groups local signals into P0/P1/P2/P3 priorities.

### 2. Local-first triage engine
- Added `lib/beta-triage.ts`.
- Inputs:
  - `userFeedbackRecords`
  - `betaFeedbackRecords`
  - `translationFeedbackRecords`
- Output:
  - total signals
  - issue count
  - P0/P1 counts
  - average rating
  - recommended next patch
  - evidence snippets
  - suggested action per issue

### 3. Triage report export
- Added `components/admin/feedback-triage-dashboard.tsx`.
- Exports `landly-beta-triage-report-YYYY-MM-DD.json`.
- Includes raw local signals and computed priorities.

### 4. Triage API shell
- Added `/api/triage`.
- `GET` returns schema guidance.
- `POST` accepts feedback arrays and returns a computed report.
- No payload is persisted.

### 5. Operator/Launch integration
- `/more` Beta Tools links to `/triage`.
- `/admin` links to the triage board.
- `/launch` links to the triage board.
- Bottom navigation treats `/triage` as a More route.

### 6. Release/health updates
- Release metadata updated to `v53`.
- `/api/health` now reports `triageTools` and `/triage` shell status.
- Service worker cache version updated to `v53` and includes `/triage`.
- `.env.example` documents `NEXT_PUBLIC_ENABLE_TRIAGE_TOOLS`.

### 7. Audit script
- Added `npm run audit:triage`.
- Updated release/admin/launch/feedback audits to `v53` metadata.

## Notes
- This patch still uses localStorage/Zustand data for beta operations.
- `/api/triage` is intentionally non-persistent until a database/webhook is selected.
- Use the triage board after each tester round to decide whether the next patch should be safety, UX, translation, or backlog polish.
