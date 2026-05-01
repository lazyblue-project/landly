# PATCH NOTES — Landly v50

## Version

`landly_kor_patch_v50.zip`

## Theme

**Beta Launch Feedback Loop**

v50 turns Landly from a beta-ready MVP into a tester-learning build. The focus is collecting page-level confusion/usefulness notes without requiring a backend account or live database.

## Added

### 1. In-app feedback capture

Updated:

```text
components/common/feedback-prompt.tsx
```

The shared feedback prompt now supports:

- feedback category: useful, confusing, missing, bug, idea
- clarity score: 1-5
- free-text note
- page path capture
- current language and app mode capture
- localStorage/Zustand save
- optional guarded API submit
- external form/mail fallback

### 2. User feedback data model

Updated:

```text
types/index.ts
store/app-store.ts
```

Added:

```ts
UserFeedbackRecord
UserFeedbackCategory
userFeedbackRecords
addUserFeedbackRecord
removeUserFeedbackRecord
```

### 3. My feedback insights panel

Added:

```text
components/profile/feedback-insights-panel.tsx
```

Updated:

```text
app/my/page.tsx
```

The My page now shows:

- feedback note count
- average clarity score
- confusing note count
- category distribution
- recent notes
- local feedback JSON export
- local delete action for individual notes

### 4. Guarded feedback API shell

Added:

```text
app/api/feedback/route.ts
```

The endpoint validates feedback payloads but does not persist data in this MVP. It is safe to deploy before a real webhook/database exists.

### 5. Feedback audit script

Added:

```text
scripts/audit-feedback-readiness.mjs
```

Updated:

```text
package.json
scripts/audit-release-readiness.mjs
```

New command:

```bash
npm run audit:feedback
```

### 6. Health/release metadata

Updated:

```text
app/api/health/route.ts
lib/release-metadata.ts
data/release-readiness.ts
```

`/api/health` now reports:

- feedback API feature flag state
- `/api/feedback` API shell path

### 7. Backup and PWA version

Updated:

```text
components/profile/data-export-card.tsx
public/sw.js
```

Changes:

- JSON backup metadata `v49` → `v50`
- backup includes `userFeedbackRecords`
- Service Worker cache `v49` → `v50`

## Environment variables

Updated:

```text
.env.example
```

Added:

```bash
NEXT_PUBLIC_ENABLE_FEEDBACK_API=false
LANDLY_FEEDBACK_WEBHOOK_URL=
```

Keep `NEXT_PUBLIC_ENABLE_FEEDBACK_API=false` unless `/api/feedback` is wired to a private server-side webhook/database.

## Validation

Run:

```bash
node scripts/audit-phrase-coverage.mjs
node scripts/audit-feedback-readiness.mjs
node scripts/audit-release-readiness.mjs
```

Expected:

```text
All feedback readiness checks passed.
All release readiness checks passed.
```

## Known limitation

The feedback API shell validates payloads but does not persist them. The main feedback storage in v50 is localStorage/Zustand and JSON export from `/my`.
