# PATCH NOTES — Landly v51

## Version

`landly_kor_patch_v51.zip`

## Theme

**Operator Insights & Beta Triage**

v51 builds on the v50 feedback loop by adding a guarded operator view. The goal is to make closed-beta results easier to review before deciding the next patch priority.

## Added

### 1. Guarded Operator Insights page

Added:

```text
app/admin/page.tsx
components/admin/operator-insights-dashboard.tsx
```

The new `/admin` page is hidden from general users unless one of the following is true:

```bash
NEXT_PUBLIC_ENABLE_ADMIN_TOOLS=true
```

or local beta tester mode is enabled on the device.

The dashboard summarizes:

- release version/name
- local user feedback count
- average feedback clarity score
- risk signal count: confusing + missing + bug
- translation QA reports by language
- saved-item activity
- calendar/reminder activity
- beta tester progress
- guarded feature status
- recent feedback notes

### 2. Operator snapshot export

The `/admin` dashboard can export:

```text
landly-operator-snapshot-YYYY-MM-DD.json
```

The snapshot includes local beta signals, recent feedback, translation QA records, app mode/language, release metadata, and next-patch triage metrics.

### 3. More page admin entry

Updated:

```text
app/more/page.tsx
components/layout/bottom-nav.tsx
```

When beta tools are enabled, More now includes **Operator Insights**. `/admin` is grouped under the More tab for active-navigation behavior.

### 4. Admin feature flag

Updated:

```text
lib/feature-flags.ts
.env.example
```

Added:

```bash
NEXT_PUBLIC_ENABLE_ADMIN_TOOLS=false
```

`isAdminToolsEnabled()` allows either explicit admin flag access or local beta tester access.

### 5. Health/release metadata update

Updated:

```text
app/api/health/route.ts
lib/release-metadata.ts
data/release-readiness.ts
```

`/api/health` now reports:

- `adminTools` feature flag state
- `/admin` shell path
- v51 release metadata

### 6. Admin readiness audit

Added:

```text
scripts/audit-admin-readiness.mjs
```

Updated:

```text
package.json
scripts/audit-release-readiness.mjs
```

New command:

```bash
npm run audit:admin
```

### 7. Backup and PWA version

Updated:

```text
components/profile/data-export-card.tsx
components/profile/feedback-insights-panel.tsx
public/sw.js
```

Changes:

- JSON backup metadata `v50` → `v51`
- feedback export metadata `v50` → `v51`
- Service Worker cache `v50` → `v51`

## Validation

Run:

```bash
node scripts/audit-phrase-coverage.mjs
node scripts/audit-feedback-readiness.mjs
node scripts/audit-admin-readiness.mjs
node scripts/audit-release-readiness.mjs
```

Expected:

```text
All admin readiness checks passed.
All release readiness checks passed.
```

## Known limitations

- `/admin` reads localStorage/Zustand data only. It does not aggregate multiple testers automatically.
- Real multi-user analytics still requires a server-side feedback store or private webhook.
- Live map/place/care APIs remain fallback-first and guarded.
