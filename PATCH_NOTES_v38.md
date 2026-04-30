# Landly Patch v38 — Onboarding → Home → Test/Partner Connection

## Goal

Make the first-run journey feel connected after v36 beta testing and v37 partner disclosure work:

- Show users what their onboarding choices will unlock before they finish setup.
- Connect Home to the recommended beta test mission.
- Connect Home to the relevant partner/disclosure lane without hiding commercial context.
- Let `/test?mission=...` and `/partners?category=...&audience=...` open the right context directly.

## Key Changes

### 1. Central onboarding handoff map

Added `data/onboarding-launch-actions.ts`.

Each `OnboardingNeed` now maps to:

- Primary next route
- Beta mission route
- Partner/disclosure route
- Safety or official-source note

Examples:

- `shopping_refund` → refund checker → refund beta mission → shopping partner lane
- `hospital_pharmacy` → care triage → care beta mission → care partner disclosure
- `emergency_help` → SOS → SOS clarity test → trust/official-source rules

### 2. Onboarding launch preview

Added `components/onboarding/onboarding-launch-preview.tsx` and displayed it on the final onboarding city step.

The preview shows:

- First Home action
- Recommended beta mission
- Relevant partner/disclosure lane
- Safety/source note

### 3. Home pilot loop panel

Added `components/home/home-pilot-panel.tsx` and inserted it into `app/page.tsx` after Ready.

The panel shows:

- Recommended pilot based on onboarding profile
- Test completion state
- Feedback note count
- Partner disclosure acknowledgment count
- Link to trust rules

### 4. Beta test deep-linking

Updated `/test` so `?mission=arrival|shop|care|sos|stay|assistant` highlights the matching mission.

Also updated `BetaMissionCard` with:

- `highlighted` prop
- Mission anchor id
- Recommended badge

Updated `BetaFeedbackNotebook` with `defaultMissionId`, so feedback starts on the highlighted mission.

### 5. Partner deep-linking

Updated `/partners` so query parameters initialize filters:

- `?category=shopping`
- `?audience=shopper`
- both together, e.g. `/partners?category=care&audience=wellness`

### 6. PWA cache version

Updated `public/sw.js` version to `v38`.

### 7. i18n / Korean copy

Added Korean copy for v38 onboarding handoff, pilot loop, beta mission highlighting, and partner route labels.

## Files Added

- `data/onboarding-launch-actions.ts`
- `components/onboarding/onboarding-launch-preview.tsx`
- `components/home/home-pilot-panel.tsx`
- `PATCH_NOTES_v38.md`

## Files Updated

- `app/onboarding/page.tsx`
- `app/page.tsx`
- `app/test/page.tsx`
- `app/partners/page.tsx`
- `components/test/beta-mission-card.tsx`
- `components/test/beta-feedback-notebook.tsx`
- `lib/text-localizer.ts`
- `i18n/messages/en.json`
- `i18n/messages/ko.json`
- `public/sw.js`
- `LANDLY_DEV_CONTEXT.md`

## Manual QA

1. Start from `/onboarding`.
2. Choose a first need, then reach the city step.
3. Confirm the launch preview changes by first need.
4. Finish onboarding and open Home.
5. Confirm the Pilot loop panel appears after Ready.
6. Tap the beta mission CTA and confirm `/test?mission=...` highlights the expected card.
7. Add a feedback note and confirm the default mission is preselected.
8. Tap partner lane and confirm `/partners` opens with the expected filter.
9. Confirm emergency first need routes to `/trust` for official-source rules rather than a commercial lane.

## Validation

Run locally:

```bash
npm install
npx tsc --noEmit
npm run build
npm run dev
```
