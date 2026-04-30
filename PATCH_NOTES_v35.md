# Landly Korean Patch v35 — Trust & Official Source Hardening

## Goal
Strengthen Landly's trust layer so users can clearly distinguish official sources, curated guidance, demo data, partner offers, and cards that require live confirmation before action.

## Key changes

1. Added `lib/trust-freshness.ts`
   - Parses ISO dates and legacy `Apr 2026`-style month labels.
   - Computes `fresh`, `aging`, `stale`, and `unknown` freshness states.
   - Provides safer CTA labels such as `Open official source first` and `Confirm source before acting`.

2. Added `data/official-sources.ts`
   - Centralizes official-source cards for:
     - 119 emergency / ambulance guide
     - 1330 tourist helpline
     - VisitKorea tax refund rules
     - 1345 immigration contact center
     - Medical Korea foreign patient support

3. Upgraded `SourceDisclosure`
   - Shows freshness badge next to trust label.
   - Warns when information is demo, needs-check, stale, unknown, or marked for confirmation.
   - Uses safer official-source CTA copy.

4. Updated `TrustBadgeRow` source logic through `lib/trust-badges.ts`
   - Replaces generic `Recently checked` badge with computed freshness status.

5. Strengthened `/trust`
   - Hydration guard added.
   - Trust command center now counts fresh checks and stale/unknown items.
   - Official sources board now uses centralized official-source data.

6. Strengthened `/sos`
   - Hydration guard added.
   - Emergency number hub now displays source/freshness disclosure for each official route.
   - 119, 1330, 1345 routes now connect to official public sources where available.

7. Strengthened Shop refund flow
   - `/shop/checker` now shows official refund source disclosure before the quick estimate.
   - `/shop/guide` now shows official refund source disclosure before user-facing checklist.
   - Refund confidence helper now uses the 15,000 KRW minimum threshold already used by the eligibility hook.

8. Normalized trust metadata dates
   - Replaced legacy `Apr 2026` labels with ISO `2026-04-29` in trust-enabled mock data.

## Validation notes
- `public/sw.js` syntax check was attempted and passed before `npx tsc --noEmit` triggered dependency resolution.
- Full TypeScript/build validation was not completed in the container because `node_modules` was not installed and `npx tsc --noEmit` timed out while resolving packages.

## Local validation
```bash
npm install
npx tsc --noEmit
npm run build
npm run dev
```
