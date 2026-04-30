# Landly v36 Patch Notes — Beta Feedback UX

## Goal
Make Landly easier to test with real users after the PWA, trust, and home simplification work from v31–v35.

## Added
- Beta pilot readiness dashboard on `/test`
- Mission completion tracking persisted in Zustand/localStorage
- Local feedback notebook for capturing tester notes without adding a backend
- Feedback report copy flow for sharing notes after a test session
- Home Explore link to the beta test guide

## Updated
- `store/app-store.ts`
  - added `completedBetaMissionIds`
  - added `betaFeedbackRecords`
  - added `toggleBetaMissionCompleted`, `addBetaFeedbackRecord`, `removeBetaFeedbackRecord`
- `types/index.ts`
  - added `BetaMissionId`, `BetaFeedbackMood`, `BetaFeedbackRecord`
- `app/test/page.tsx`
  - uses mission completion and feedback notebook state
  - changes Stay mission link from `/life` to `/stay`
- `components/test/beta-mission-card.tsx`
  - completion badge
  - mark tested / incomplete action
- `lib/text-localizer.ts`
  - Korean mappings for beta testing and feedback notebook copy

## Notes
- No backend, database, analytics SDK, or new dependency was added.
- Feedback records are stored only on the current device via the existing Zustand persist store.
- Run `npx tsc --noEmit` and `npm run build` after applying.
