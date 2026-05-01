"use client";

import { useEffect } from "react";

export type LandlyThemeMode = "light" | "dark" | "system";

export const LANDLY_THEME_STORAGE_KEY = "landly-theme-mode";

function getStoredThemeMode(): LandlyThemeMode {
  if (typeof window === "undefined") return "system";
  const value = window.localStorage.getItem(LANDLY_THEME_STORAGE_KEY);
  return value === "light" || value === "dark" || value === "system" ? value : "system";
}

function shouldUseDarkMode(mode: LandlyThemeMode) {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function applyThemeMode(mode: LandlyThemeMode) {
  const root = document.documentElement;
  const dark = shouldUseDarkMode(mode);
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
  root.dataset.landlyTheme = mode;
}

export function setLandlyThemeMode(mode: LandlyThemeMode) {
  window.localStorage.setItem(LANDLY_THEME_STORAGE_KEY, mode);
  applyThemeMode(mode);
  window.dispatchEvent(new CustomEvent("landly-theme-change", { detail: { mode } }));
}

export function getLandlyThemeMode() {
  return getStoredThemeMode();
}

export function ThemeSync() {
  useEffect(() => {
    const applyStored = () => applyThemeMode(getStoredThemeMode());
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");

    applyStored();

    media?.addEventListener("change", applyStored);
    window.addEventListener("storage", applyStored);
    window.addEventListener("landly-theme-change", applyStored);

    return () => {
      media?.removeEventListener("change", applyStored);
      window.removeEventListener("storage", applyStored);
      window.removeEventListener("landly-theme-change", applyStored);
    };
  }, []);

  return null;
}
