# Landly v32 Patch Notes — Offline PWA Core

## Theme
Turn the existing Offline Kit concept into a real PWA-ready offline layer.

## What changed

### 1. Service worker added
- Added `public/sw.js`.
- Pre-caches the most important Landly routes:
  - `/`
  - `/offline`
  - `/sos`
  - `/assistant`
  - `/navigate`
  - `/care`
  - `/pass`
  - `/shop`
  - `/stay`
  - `/more`
- Adds runtime caching for same-origin static assets such as scripts, styles, images, fonts, and manifest files.
- Navigation requests use network-first behavior and fall back to cached pages, then `/offline`, then `/`.

### 2. PWA registration lifecycle
- Added `components/layout/pwa-cache-provider.tsx`.
- Registered from `app/layout.tsx`.
- Marks core offline readiness in localStorage after the service worker is ready.
- Shows a one-time snackbar when the offline core kit is ready.

### 3. Offline readiness hook
- Added `hooks/use-pwa-status.ts`.
- Provides:
  - `online`
  - `serviceWorkerSupported`
  - `serviceWorkerReady`
  - `offlineReady`

### 4. Offline UI upgraded
- Added `components/offline/offline-pwa-status-card.tsx`.
- Added the PWA status card to `/offline`.
- Updated `OfflineSafetyStrip` to show:
  - network state
  - core cache state
  - saved offline preparation count
- Updated `OfflineKitCommandCenter` to include the service-worker cache as one readiness signal.

### 5. Manifest enhanced
- Added:
  - `id`
  - `scope`
  - app shortcuts for SOS, Offline Kit, and Map Handoff.

### 6. Localization
- Added Korean translations for new PWA/offline status copy.

## Validation checklist

After applying this patch:

```bash
npm install
npx tsc --noEmit
npm run build
npm run dev
```

Manual browser checks:

1. Open `http://localhost:3001`.
2. Open DevTools > Application > Service Workers.
3. Confirm `/sw.js` is registered.
4. Open `/offline`.
5. Confirm the PWA status card appears.
6. Open DevTools > Network and enable Offline.
7. Refresh `/offline`, `/sos`, `/assistant`, or `/navigate`.
8. Confirm a cached Landly page still opens.
9. Re-enable network and confirm the app continues normally.

## Notes

- This patch does not add external dependencies.
- Live maps, official websites, payments, calls, and real-time search still require a network connection.
- The service worker is intentionally conservative and caches same-origin GET requests only.
