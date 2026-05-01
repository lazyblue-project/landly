# PATCH NOTES — Landly v52

## Package

`landly_kor_patch_v52.zip`

## Release name

**v52 — Beta Launch Control Room**

## Purpose

v52 builds on v51 Operator Insights by adding a launch-focused checklist and smoke-test control room for closed beta deployment. The goal is to make the handoff from “local MVP” to “shareable Vercel beta link” safer and easier to repeat.

## Added

### 1. Beta Launch Control route

- New guarded route: `/launch`
- Available when local beta tester mode is enabled or `NEXT_PUBLIC_ENABLE_LAUNCH_TOOLS=true`
- Shows launch readiness score, required checklist status, automatic local signals, and manual smoke-test items

### 2. Launch checklist data model

- New data file: `data/beta-launch-checklist.ts`
- New type support: `LaunchChecklistItem`, `LaunchChecklistCategory`
- Checklist covers onboarding, travel journey, long-stay journey, SOS/offline, feedback capture, translation QA, backup/calendar handoff, health smoke check, and operator snapshot export

### 3. Launch report export

- New export file format: `landly-beta-launch-report-YYYY-MM-DD.json`
- Includes release metadata, readiness score, profile mode/language, saved-item metrics, feedback counts, checklist status, recent feedback, and translation QA reports

### 4. More/Admin/Health integration

- `/more` beta tools now link to **Beta Launch Control**
- `/admin` links to the launch checklist
- `/api/health` now reports `launchTools` flag and `/launch` shell
- Bottom nav groups `/launch` under More

### 5. Release metadata and audits

- Release metadata updated to `v52`
- Service Worker cache updated to `v52`
- Export metadata updated to `v52`
- New script:

```bash
npm run audit:launch
```

## Updated scripts

```bash
npm run audit:phrases
npm run audit:feedback
npm run audit:admin
npm run audit:launch
npm run audit:release
```

## Notes

This patch still does not enable live map/place/medical data. API integrations remain fallback-first and guarded. v52 is focused on closed-beta readiness, smoke testing, and launch report handoff.
