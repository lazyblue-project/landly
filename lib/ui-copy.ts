"use client";

import en from "@/i18n/messages/en.json";
import ko from "@/i18n/messages/ko.json";
import { resolveUiLocale, type UiLocale } from "@/lib/i18n-support";
import { useAppStore } from "@/store/app-store";
import { Language } from "@/types";

type Dictionary = Record<string, unknown>;
type Vars = Record<string, string | number>;

const dictionaries: Record<UiLocale, Dictionary> = { en, ko };

function getNestedValue(source: Dictionary, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === "object" && segment in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, source);
}

function interpolate(template: string, vars?: Vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`));
}

export function translateUi(
  language: Language,
  key: string,
  vars?: Vars,
  fallback?: string
): string {
  const locale = resolveUiLocale(language);
  const localized = getNestedValue(dictionaries[locale], key);
  const english = getNestedValue(dictionaries.en, key);
  const value = localized ?? english ?? fallback ?? key;

  if (typeof value !== "string") {
    return fallback ?? key;
  }

  return interpolate(value, vars);
}

export function useUiCopy() {
  const language = useAppStore((state) => state.user.language);

  return {
    language,
    locale: resolveUiLocale(language),
    t: (key: string, vars?: Vars, fallback?: string) =>
      translateUi(language, key, vars, fallback),
  };
}
