# ChatGPT Handoff — Landly v52

Use `landly_kor_patch_v52.zip` as the latest full patch baseline.

## What v52 does

v52 adds a guarded **Beta Launch Control Room** for closed-beta deployment readiness:

- New `/launch` page
- New `BetaLaunchControlRoom` component
- New `data/beta-launch-checklist.ts`
- New launch report export
- New `NEXT_PUBLIC_ENABLE_LAUNCH_TOOLS` feature flag
- `/api/health` now includes launch tool state
- `/more` beta tools and `/admin` link into `/launch`
- Service Worker and export metadata updated to v52

## Recommended validation

Run these before creating the next patch ZIP or deploying to Vercel:

```bash
npm run audit:phrases
npm run audit:feedback
npm run audit:admin
npm run audit:launch
npm run audit:release
npm run build
```

If npm install/build times out in the execution environment, at minimum run the Node audit scripts directly:

```bash
node scripts/audit-phrase-coverage.mjs
node scripts/audit-feedback-readiness.mjs
node scripts/audit-admin-readiness.mjs
node scripts/audit-launch-readiness.mjs
node scripts/audit-release-readiness.mjs
```

## Suggested next direction after v52

1. Run an actual beta test round with 3–5 users.
2. Export `/launch` report before sharing the beta link.
3. Export `/admin` snapshot after tester feedback is collected.
4. Convert repeated `todo`, `watch`, `confusing`, `missing`, and `bug` signals into the next patch.
5. Only after this, consider connecting a server-side feedback webhook or real map/place provider.
