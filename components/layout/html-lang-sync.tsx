"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";

export function HtmlLangSync() {
  const language = useAppStore((state) => state.user.language);
  const hasHydrated = useAppStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    document.documentElement.lang = language;
  }, [hasHydrated, language]);

  return null;
}
