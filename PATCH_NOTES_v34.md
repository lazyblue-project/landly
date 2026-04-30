# Landly v34 Patch Notes — Home UX: Now / Ready / Explore

## Goal

v34 simplifies the Home screen so first-time users can understand Landly faster. Instead of stacking many full feature modules on the first screen, Home now follows a clearer mobile-first hierarchy:

1. **Now** — the single next best action and two quick backup actions.
2. **Ready** — compact safety readiness for offline, language, maps, and trust.
3. **Explore** — deeper Landly service lanes and retention loops.

This keeps all existing feature pages intact while reducing first-screen cognitive load.

## Changed files

- `app/page.tsx`
  - Replaced the long stacked Home composition with `HomeHero`, `HomeNowPanel`, `HomeReadyPanel`, `HomeExplorePanel`, and `FeedbackPrompt`.
  - Switched Home store usage to Zustand selectors.
  - Uses `PageSkeleton` during hydration.

- `components/home/home-now-panel.tsx`
  - New primary Home section.
  - Uses `useSmartActionEngine()` to show one clear recommended next step.
  - Shows readiness score and attention count.
  - Shows two backup actions below the primary CTA.

- `components/home/home-ready-panel.tsx`
  - New readiness section.
  - Summarizes offline cache status, language kit progress, map handoff readiness, and trust/source labeling.

- `components/home/home-explore-panel.tsx`
  - New service exploration section.
  - Keeps Pass, Shop, Care, SOS, Stay shortcuts visible without crowding the top of Home.
  - Adds compact links to Stamps, Promotions, and Partner Offers.

- `hooks/use-smart-action-engine.ts`
  - Switched from whole-store subscription to selector-based Zustand reads to reduce broad Home re-renders.

- `lib/text-localizer.ts`
  - Added Korean copy for the new v34 Home sections and status labels.

- `LANDLY_DEV_CONTEXT.md`
  - Updated current version to v34.
  - Added v34 components to the structure.
  - Added v34 to version history.

## Notes

- Existing Home components such as `SituationActionDashboard`, `SmartActionBrief`, `TodayDashboard`, `RetentionLoopStrip`, and `HomeServiceHub` are preserved for reuse or future A/B testing.
- No backend/API/database changes.
- No new dependencies.
