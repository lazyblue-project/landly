import { phrases } from "@/data/phrases";
import type { Language } from "@/types";

export type UiLocale = "en" | "ko" | "zh" | "ja";
export type LanguageSupportLevel = "full-ui" | "beta-ui" | "phrase-support" | "partial-phrase-support";

export const fullUiLocales: readonly UiLocale[] = ["en", "ko"];
export const betaUiLocales: readonly UiLocale[] = ["zh", "ja"];
export const phraseSupportLocales: readonly Language[] = ["en", "ko", "zh", "ja", "es", "fr"];

const phraseTranslationLanguages: Language[] = ["zh", "ja", "es", "fr"];
const corePhraseCoverageThreshold = 75;

function calculatePhraseCoverage(language: Language) {
  if (language === "en" || language === "ko") return 100;
  if (phrases.length === 0) return 0;

  const translatedCount = phrases.filter((phrase) => Boolean(phrase.translations[language])).length;
  return Math.round((translatedCount / phrases.length) * 100);
}

export const languagePhraseCoverage: Record<Language, number> = {
  en: 100,
  ko: 100,
  zh: calculatePhraseCoverage("zh"),
  ja: calculatePhraseCoverage("ja"),
  es: calculatePhraseCoverage("es"),
  fr: calculatePhraseCoverage("fr"),
};

const translatedPhraseCoverageDetails = Object.fromEntries(
  phraseTranslationLanguages.map((language) => {
    const translated = phrases.filter((phrase) => Boolean(phrase.translations[language])).length;
    return [language, { translated, total: phrases.length, coverage: languagePhraseCoverage[language] }];
  })
) as Record<Exclude<Language, "en" | "ko">, { translated: number; total: number; coverage: number }>;

export const languagePhraseCoverageDetails: Record<Language, { translated: number; total: number; coverage: number }> = {
  en: { translated: phrases.length, total: phrases.length, coverage: 100 },
  ko: { translated: phrases.length, total: phrases.length, coverage: 100 },
  ...translatedPhraseCoverageDetails,
};

export const languageDisplayNames: Record<Language, { native: string; english: string; short: string }> = {
  en: { native: "English", english: "English", short: "EN" },
  ko: { native: "한국어", english: "Korean", short: "KO" },
  zh: { native: "中文", english: "Chinese", short: "ZH" },
  ja: { native: "日本語", english: "Japanese", short: "JA" },
  es: { native: "Español", english: "Spanish", short: "ES" },
  fr: { native: "Français", english: "French", short: "FR" },
};

export function resolveUiLocale(language: Language): UiLocale {
  if (language === "ko") return "ko";
  if (language === "zh") return "zh";
  if (language === "ja") return "ja";
  return "en";
}

export function getLanguageSupportLevel(language: Language): LanguageSupportLevel {
  if (language === "en" || language === "ko") return "full-ui";
  if (language === "zh" || language === "ja") return "beta-ui";
  return languagePhraseCoverage[language] >= corePhraseCoverageThreshold ? "phrase-support" : "partial-phrase-support";
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
  const coverage = languagePhraseCoverage[language];

  if (level === "full-ui") {
    return {
      level,
      coverage,
      badge: "Full UI",
      title: "Full interface support",
      description: "Landly menus, onboarding, saved items, and phrase cards are supported in this language.",
      shortDescription: "Menus and phrase cards are available in this language.",
    };
  }

  if (level === "beta-ui") {
    return {
      level,
      coverage,
      badge: `Beta UI · Phrase ${coverage}%`,
      title: `${languageName} beta interface support`,
      description: "Core navigation, onboarding, and search are translated in beta. Deeper feature screens may still fall back to English while phrase cards use verified translations.",
      shortDescription: "Core menus are translated in beta; deeper screens may fall back to English.",
    };
  }

  if (level === "partial-phrase-support") {
    return {
      level,
      coverage,
      badge: `Translation in progress · ${coverage}%`,
      title: `${languageName} translation in progress`,
      description: "Landly menus currently stay in English. Essential phrase cards use this language only when a verified translation is available.",
      shortDescription: "Menus stay in English; essential phrases are partially translated.",
    };
  }

  return {
    level,
    coverage,
    badge: `Phrase support · ${coverage}%`,
    title: `${languageName} phrase support`,
    description: "Landly menus currently stay in English for this language. Korean show-cards and phrase cards still use your selected language when a translation is available.",
    shortDescription: "Menus stay in English; phrase cards use this language when available.",
  };
}
