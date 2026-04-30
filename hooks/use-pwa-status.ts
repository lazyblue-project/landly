"use client";

import { useEffect, useState } from "react";
import { landlyOfflineReadyStorageKey, landlyPwaReadyEventName } from "@/components/layout/pwa-cache-provider";

interface PwaStatus {
  online: boolean;
  serviceWorkerSupported: boolean;
  serviceWorkerReady: boolean;
  offlineReady: boolean;
}

function getInitialOnline() {
  if (typeof window === "undefined") return true;
  return window.navigator.onLine;
}

function getInitialOfflineReady() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(landlyOfflineReadyStorageKey) === "true";
}

function getInitialServiceWorkerReady() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return false;
  return Boolean(navigator.serviceWorker.controller);
}

export function usePwaStatus(): PwaStatus {
  const [online, setOnline] = useState(getInitialOnline);
  const [serviceWorkerReady, setServiceWorkerReady] = useState(getInitialServiceWorkerReady);
  const [offlineReady, setOfflineReady] = useState(getInitialOfflineReady);

  useEffect(() => {
    const serviceWorkerSupported = "serviceWorker" in navigator;

    const refreshOfflineReady = () => {
      setOfflineReady(window.localStorage.getItem(landlyOfflineReadyStorageKey) === "true");
      setServiceWorkerReady(serviceWorkerSupported && Boolean(navigator.serviceWorker.controller));
    };

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    const handleControllerChange = () => setServiceWorkerReady(true);
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "LANDLY_SW_CORE_READY") refreshOfflineReady();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener(landlyPwaReadyEventName, refreshOfflineReady);
    navigator.serviceWorker?.addEventListener("controllerchange", handleControllerChange);
    navigator.serviceWorker?.addEventListener("message", handleMessage);

    if (serviceWorkerSupported) {
      navigator.serviceWorker.ready
        .then(() => refreshOfflineReady())
        .catch(() => setServiceWorkerReady(false));
    }

    refreshOfflineReady();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener(landlyPwaReadyEventName, refreshOfflineReady);
      navigator.serviceWorker?.removeEventListener("controllerchange", handleControllerChange);
      navigator.serviceWorker?.removeEventListener("message", handleMessage);
    };
  }, []);

  return {
    online,
    serviceWorkerSupported: typeof navigator !== "undefined" && "serviceWorker" in navigator,
    serviceWorkerReady,
    offlineReady,
  };
}
