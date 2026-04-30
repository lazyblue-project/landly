# Landly Korean Patch v30 — Navigation & Map Handoff

## Summary

v30 adds a navigation handoff layer so users can open Google Maps, NAVER Map, route backup checks, and Korean destination phrases from one place.

## New files

- `data/navigation-handoff.ts`
  - Situation-based route handoff data for arrival, saved places, shopping, care, and stay/admin tasks.
- `components/navigation/navigation-handoff-center.tsx`
  - Shared map handoff command center with map launch buttons, phrase copy, checklist, and personalized ranking.
- `app/navigate/page.tsx`
  - New standalone Map Handoff page.

## Updated files

- `types/index.ts`
  - Added `NavigationHandoffCategory` and `NavigationHandoff`.
- `app/page.tsx`
  - Added compact Map Handoff card on Home.
- `data/more-menu.ts`
  - Added `Map handoff` entry.
- `lib/text-localizer.ts`
  - Added Korean strings for map handoff, route checks, and Korean phrase copy.
- `i18n/messages/en.json`
  - Added `navigation` copy namespace.
- `i18n/messages/ko.json`
  - Added Korean `navigation` copy namespace.
- `LANDLY_DEV_CONTEXT.md`
  - Updated to v30.

## UX impact

- Users can choose Google Maps or NAVER Map from one route card.
- Users can copy Korean phrases for taxi/help desk/staff before moving.
- Home now surfaces a compact readiness card for map handoff.
- More page exposes the full Map Handoff center.
- Route suggestions are ranked using user mode, first need, saved places, saved stores, saved care providers, and saved arrival plans.

## Verification notes

- JSON parse check passed for `en.json` and `ko.json`.
- Duplicate Korean text-localizer key check passed.
- ZIP integrity check passed.
- Full `npx tsc --noEmit` and `npm run build` should be run locally after installing dependencies.
