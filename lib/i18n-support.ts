import type { Language } from "@/types";

export type UiLocale = "en" | "ko";
export type LanguageSupportLevel = "full-ui" | "phrase-support";

export const fullUiLocales: readonly UiLocale[] = ["en", "ko"];
export const phraseSupportLocales: readonly Language[] = ["en", "ko", "zh", "ja", "es", "fr"];

export const languageDisplayNames: Record<Language, { native: string; english: string; short: string }> = {
  en: { native: "English", english: "English", short: "EN" },
  ko: { native: "한국어", english: "Korean", short: "KO" },
  zh: { native: "中文", english: "Chinese", short: "ZH" },
  ja: { native: "日本語", english: "Japanese", short: "JA" },
  es: { native: "Español", english: "Spanish", short: "ES" },
  fr: { native: "Français", english: "French", short: "FR" },
};

export function resolveUiLocale(language: Language): UiLocale {
  return language === "ko" ? "ko" : "en";
}

export function getLanguageSupportLevel(language: Language): LanguageSupportLevel {
  return language === "en" || language === "ko" ? "full-ui" : "phrase-support";
}

export function hasFullUiSupport(language: Language) {
  return getLanguageSupportLevel(language) === "full-ui";
}

export function getLanguageLabel(language: Language, format: "native" | "english" | "combined" | "short" = "native") {
  const label = languageDisplayNames[language];
  if (format === "english") return label.english;
  if (format === "short") return label.short;
  if (format === "combined" && label.native !== label.english) return `${label.native} · ${label.english}`;
  return label.native;
}

export function getLanguageSupportCopy(language: Language) {
  const level = getLanguageSupportLevel(language);
  const languageName = getLanguageLabel(language, "english");

  if (level === "full-ui") {
    return {
      level,
      badge: "Full UI",
      title: "Full interface support",
      description: "Landly menus, onboarding, saved items, and phrase cards are supported in this language.",
      shortDescription: "Menus and phrase cards are available in this language.",
    };
  }

  return {
    level,
    badge: "Phrase support",
    title: `${languageName} phrase support`,
    description: "Landly menus currently stay in English for this language. Korean show-cards and phrase cards still use your selected language when a translation is available.",
    shortDescription: "Menus stay in English; phrase cards use this language when available.",
  };
}
