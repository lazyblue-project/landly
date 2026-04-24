import { Language } from "@/types";

export const i18nConfig = {
  defaultLocale: "en" as Language,
  locales: ["en", "ko", "zh", "ja", "es", "fr"] as Language[],
  localeLabels: {
    en: "English",
    ko: "한국어",
    zh: "中文",
    ja: "日本語",
    es: "Español",
    fr: "Français",
  } as Record<Language, string>,
};

export type MessageKey = keyof typeof import("./messages/en.json");
