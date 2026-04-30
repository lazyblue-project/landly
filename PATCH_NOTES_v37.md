# Landly Korean Patch v37 — Partner Commercial Disclosure Hardening

## Goal
Make partner monetization tests safer and more transparent before Landly collects user interest for coupons, referrals, bookings, or settlement leads.

## Why this patch
Partner and affiliate-style flows must clearly disclose commercial relationships before a user treats an offer as a neutral recommendation. The patch keeps Landly's mock/static architecture but adds explicit disclosure UI, per-offer acknowledgment, and safer lead-interest gating.

## Changes

### 1. Partner disclosure utility
- Added `lib/partner-disclosure.ts`.
- Centralizes revenue model copy for affiliate, referral, commission, sponsored, and pilot flows.
- Adds disclosure severity: `low`, `medium`, `high`.
- Adds partner disclosure principles:
  - Commercial labels stay visible
  - No hidden paid ranking
  - Confirm before payment or booking
  - No paid medical priority

### 2. Partner offer type expansion
- Updated `types/index.ts`.
- Added:
  - `PartnerDisclosureSeverity`
  - `PartnerCommercialDisclosure`
  - optional `commercialDisclosure` on `PartnerOffer`

### 3. Partner offer data enrichment
- Updated `data/partner-offers.ts`.
- Each partner lane now has a clear user-impact note and ranking note.
- Care referral offer is marked as high-severity disclosure because it can involve sensitive medical context.

### 4. Per-offer disclosure card
- Added `components/partners/partner-commercial-disclosure-card.tsx`.
- Shows:
  - How Landly may earn
  - What the user should know
  - Ranking note
  - Scenario-specific confirmation checklist
  - Acknowledgment button

### 5. Commercial policy panel
- Added `components/partners/partner-commercial-policy-panel.tsx`.
- Displays Landly's partner transparency rules at the top of `/partners`.

### 6. Safer interest gating
- Updated `components/partners/partner-offer-card.tsx`.
- Users must acknowledge the disclosure before using `Send interest`.
- `Save offer` remains available because it is a lower-risk local action.

### 7. Store persistence
- Updated `store/app-store.ts`.
- Added `acknowledgedPartnerDisclosureIds`.
- Added `acknowledgePartnerDisclosure(id)` action.
- Acknowledgment persists in localStorage.

### 8. Partners page improvements
- Updated `app/partners/page.tsx`.
- Adds `Disclosed` metric.
- Uses selector-based Zustand subscriptions.
- Adds commercial policy panel and per-offer disclosure state.

### 9. PWA cache update
- Updated `public/sw.js` to `v37`.
- Added `/partners` to core cached routes.

### 10. Korean localization
- Updated `lib/text-localizer.ts` with v37 disclosure and partner-policy copy.

## Files changed
- `app/partners/page.tsx`
- `components/partners/partner-offer-card.tsx`
- `components/partners/partner-offer-command-center.tsx`
- `components/partners/partner-monetization-disclosure.tsx`
- `components/partners/partner-commercial-disclosure-card.tsx`
- `components/partners/partner-commercial-policy-panel.tsx`
- `data/partner-offers.ts`
- `lib/partner-disclosure.ts`
- `lib/text-localizer.ts`
- `public/sw.js`
- `store/app-store.ts`
- `types/index.ts`
- `LANDLY_DEV_CONTEXT.md`

## Validation checklist
Run locally:

```bash
npm install
npx tsc --noEmit
npm run build
npm run dev
```

Manual checks:
1. Open `/partners`.
2. Confirm the policy panel appears below the hero cards.
3. Open a partner offer card and check the disclosure block.
4. Press `Send interest` before acknowledgment; it should prompt disclosure review instead of sending interest.
5. Press `I understand this disclosure`.
6. Press `Send interest` again and confirm the card switches to `Interest sent`.
7. Refresh the page and confirm disclosure acknowledgment persists.
8. In DevTools → Application → Service Worker, confirm `landly-core-v37` cache includes `/partners`.
