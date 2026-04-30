"use client";

import { useEffect } from "react";
import { resolveUiLocale } from "@/lib/i18n-support";
import { useAppStore } from "@/store/app-store";

export function HtmlLangSync() {
  const language = useAppStore((state) => state.user.language);
  const hasHydrated = useAppStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    document.documentElement.lang = resolveUiLocale(language);
    document.documentElement.dataset.landlyLanguage = language;
  }, [hasHydrated, language]);

  return null;
}
