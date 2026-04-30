# Landly Patch Notes v31

## Theme

Stability, accessibility, hydration safety, and reminder-date correctness for the v30 Map Handoff baseline.

## Changes

1. Accessibility and mobile safety
   - Removed the viewport zoom lock from `app/layout.tsx`.
   - Added `viewportFit: "cover"` for safer iOS PWA rendering.
   - Updated `AppShell` bottom padding to respect `env(safe-area-inset-bottom)`.

2. Bottom sheet UX hardening
   - Added dialog semantics, `aria-modal`, labelled/described IDs, Escape-key close, and body scroll lock.
   - Added safer max-height scrolling for long sheets.
   - Applied the same behavior to both `components/common/bottom-sheet.tsx` and `components/ui/bottom-sheet.tsx`.

3. Reminder date correctness
   - Replaced UTC-prone `new Date(YYYY-MM-DD)` parsing with local date parsing.
   - Replaced `toISOString().slice(0, 10)` checkpoint formatting with local date formatting.
   - Switched `useReminderEngine()` to selector-based store reads for lower rerender pressure.

4. Hydration consistency
   - Added hydration guards to Assistant, Explore, and More pages.
   - Localized More page tester/feedback text through `lt()`.

5. Stay route structure
   - Moved Stay/Life shared page content into `components/stay/stay-page-content.tsx`.
   - Updated `/stay` and `/life` pages to render the shared content without importing another page file directly.

6. Store syntax fix
   - Removed the duplicated `addStayDocument` key in `store/app-store.ts`.

## Verify

```bash
npm install
npx tsc --noEmit
npm run build
```

## Notes

This patch intentionally excludes previous `_patch_*` temporary folders when packaged as `landly_kor_patch_v31.zip`.
