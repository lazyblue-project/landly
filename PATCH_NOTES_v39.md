# Landly Patch v39 — Beta QA Handoff & Report Export

Date: 2026-04-29
Base: `landly_kor_patch_v38.zip`
Output: `landly_kor_patch_v39.zip`

## Goal

Make the beta-testing workflow easier to verify and share after the v38 onboarding → Home → Test/Partner handoff work.

v39 keeps the project backend-free and uses Zustand persist/localStorage only.

## Changes

### 1. Pre-share QA checklist

Added:

- `data/pilot-qa-checks.ts`
- `components/test/pilot-qa-checklist.tsx`

The `/test` page now includes a QA checklist before the mission cards. It covers:

- Fresh Home load
- Onboarding completion and launch preview
- Offline core-page cache check
- SOS official-source labels
- Partner disclosure gate
- Feedback report export

Required checks are counted separately from optional checks so the tester can see whether the link is ready to share.

### 2. Persisted QA completion state

Updated:

- `store/app-store.ts`
- `types/index.ts`

Added persisted state:

```ts
completedPilotQaCheckIds: string[]
```

Added action:

```ts
togglePilotQaCheck(id: string)
```

### 3. Feedback report export panel

Added:

- `components/test/beta-report-export-panel.tsx`

The `/test` page can now:

- Copy a Markdown beta report
- Download a JSON report
- Download feedback notes as CSV

The report includes:

- Generated timestamp
- Current app mode/language
- Completed missions
- Feedback note count
- Average clarity score
- Required QA completion
- QA checklist status
- Local feedback notes

No backend, account, or API is used.

### 4. Deep-link mission stabilization

Updated:

- `components/test/beta-feedback-notebook.tsx`

The feedback mission selector now updates when `/test?mission=...` changes after hydration, so the recommended mission and notebook default stay aligned.

### 5. PWA cache version bump

Updated:

- `public/sw.js`

Service worker cache version updated from `v38` to `v39`.

### 6. Korean localization

Updated:

- `lib/text-localizer.ts`

Added Korean labels for QA checklist, report export, and tester handoff copy.

## Manual test checklist

1. Run `npm install` if needed.
2. Run `npx tsc --noEmit`.
3. Run `npm run build`.
4. Open `/test`.
5. Toggle required QA checks.
6. Add one feedback note.
7. Copy Markdown report.
8. Download JSON report.
9. Download CSV report.
10. Open `/test?mission=care` and confirm the notebook mission defaults to Care.

## Notes

- Data stays on the current device only.
- Downloads are generated client-side with `Blob` and `URL.createObjectURL`.
- No new dependencies were added.
