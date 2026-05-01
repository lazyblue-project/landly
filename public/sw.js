const LANDLY_SW_VERSION = "v53";
const LANDLY_CORE_CACHE = `landly-core-${LANDLY_SW_VERSION}`;
const LANDLY_RUNTIME_CACHE = `landly-runtime-${LANDLY_SW_VERSION}`;

const CORE_ASSETS = [
  "/",
  "/offline",
  "/sos",
  "/assistant",
  "/navigate",
  "/care",
  "/pass",
  "/shop",
  "/shop/checker",
  "/shop/receipts",
  "/shop/guide",
  "/stay",
  "/life",
  "/my",
  "/trust",
  "/partners",
  "/promotions",
  "/stamps",
  "/calendar",
  "/explore",
  "/more",
  "/admin",
  "/launch",
  "/triage",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon.svg",
];

function isSameOrigin(request) {
  try {
    return new URL(request.url).origin === self.location.origin;
  } catch {
    return false;
  }
}

async function cacheCoreAssets() {
  const cache = await caches.open(LANDLY_CORE_CACHE);
  await Promise.allSettled(
    CORE_ASSETS.map(async (asset) => {
      const response = await fetch(asset, { cache: "reload", credentials: "same-origin" });
      if (response.ok || response.type === "opaqueredirect") {
        await cache.put(asset, response);
      }
    })
  );
}

async function notifyClients(type, payload = {}) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: "window" });
  await Promise.all(
    clients.map((client) =>
      client.postMessage({
        type,
        version: LANDLY_SW_VERSION,
        ...payload,
      })
    )
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    cacheCoreAssets()
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("landly-") && ![LANDLY_CORE_CACHE, LANDLY_RUNTIME_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
      .then(() => notifyClients("LANDLY_SW_CORE_READY", { cachedRoutes: CORE_ASSETS.length }))
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "LANDLY_CACHE_CORE") {
    event.waitUntil(
      cacheCoreAssets().then(() =>
        notifyClients("LANDLY_SW_CORE_READY", { cachedRoutes: CORE_ASSETS.length })
      )
    );
  }

  if (event.data?.type === "LANDLY_SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function networkFirstNavigation(request) {
  const cache = await caches.open(LANDLY_CORE_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cachedRequest = await cache.match(request);
    if (cachedRequest) return cachedRequest;

    const cachedPath = await cache.match(new URL(request.url).pathname);
    if (cachedPath) return cachedPath;

    const offlinePage = await cache.match("/offline");
    if (offlinePage) return offlinePage;

    const homePage = await cache.match("/");
    if (homePage) return homePage;

    throw new Error("Landly offline cache is not ready.");
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(LANDLY_RUNTIME_CACHE);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET" || !isSameOrigin(request)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (["style", "script", "worker", "image", "font", "manifest"].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
