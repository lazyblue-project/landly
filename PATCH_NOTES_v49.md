# Landly Patch Notes — v49

## Version focus

**v49 — QA Guardrails & Release Health**

This patch hardens Landly before live provider integrations. It adds safe route recovery, a deployment health endpoint, Trust Center release-readiness visibility, and a release audit script.

## Added

### 1. Safe route fallbacks

New files:

```text
app/error.tsx
app/not-found.tsx
```

- Route errors now show a recovery screen with `Try again`, `Go to Home`, and `Open SOS` actions.
- Stale or invalid links now show a not-found screen with Home, Trust Center, and SOS actions.

### 2. Health endpoint

New file:

```text
app/api/health/route.ts
```

Returns:

- release version and name
- release date
- core route count
- feature flag state
- provider key presence as booleans only
- API shell paths
- fallback data mode

No secret values are exposed.

### 3. Release metadata and readiness panel

New files:

```text
lib/release-metadata.ts
data/release-readiness.ts
components/trust/release-readiness-panel.tsx
```

Updated file:

```text
app/trust/page.tsx
```

Trust Center now shows v49 readiness checks and operator next steps.

### 4. Release audit command

New file:

```text
scripts/audit-release-readiness.mjs
```

Updated file:

```text
package.json
```

New command:

```bash
npm run audit:release
```

The audit checks required v49 files, service worker version, backup metadata version, phrase coverage, docs, environment variable docs, and Trust Center wiring.

## Updated

- `public/sw.js`: service worker cache version `v48` → `v49`
- `components/profile/data-export-card.tsx`: backup export metadata `v48` → `v49`
- `.env.example`: added v49 operational note for `/api/health`
- `README.md`: updated for v49
- `LANDLY_DEV_CONTEXT.md`: updated for v49

## Validation performed

```bash
node scripts/audit-phrase-coverage.mjs
node scripts/audit-release-readiness.mjs
```

Expected phrase coverage remains:

```text
zh: 50/50
ja: 50/50
es: 50/50
fr: 50/50
```

## Known limitation

This patch does not enable live Kakao/Naver/TourAPI/Seoul Open Data calls. Provider keys are still treated as future server-side configuration, and map/place APIs remain fallback-first.
