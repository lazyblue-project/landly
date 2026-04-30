"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { localizeText, useLocalizedText } from "@/lib/text-localizer";

const OFFLINE_READY_KEY = "landly-offline-core-ready";
const OFFLINE_READY_NOTIFIED_KEY = "landly-offline-ready-notified";
const READY_EVENT_NAME = "landly:pwa-ready";

function markOfflineReady() {
  window.localStorage.setItem(OFFLINE_READY_KEY, "true");
  window.dispatchEvent(new CustomEvent(READY_EVENT_NAME));
}

export function PwaCacheProvider() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const showSnackbar = useAppStore((state) => state.showSnackbar);
  const { language } = useLocalizedText();

  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "LANDLY_SW_CORE_READY") return;

      const wasReady = window.localStorage.getItem(OFFLINE_READY_KEY) === "true";
      markOfflineReady();

      if (!wasReady && window.localStorage.getItem(OFFLINE_READY_NOTIFIED_KEY) !== "true") {
        window.localStorage.setItem(OFFLINE_READY_NOTIFIED_KEY, "true");
        showSnackbar(localizeText(language, "Offline core kit is ready"), "success");
      }
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(async (registration) => {
        await navigator.serviceWorker.ready;

        const activeWorker = registration.active ?? navigator.serviceWorker.controller;
        activeWorker?.postMessage({ type: "LANDLY_CACHE_CORE" });

        if (registration.active || navigator.serviceWorker.controller) {
          markOfflineReady();
        }
      })
      .catch(() => {
        window.localStorage.removeItem(OFFLINE_READY_KEY);
      });

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [hasHydrated, language, showSnackbar]);

  return null;
}

export const landlyPwaReadyEventName = READY_EVENT_NAME;
export const landlyOfflineReadyStorageKey = OFFLINE_READY_KEY;
