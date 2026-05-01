import { careProviders } from "@/data/care-providers";
import { officialSources } from "@/data/official-sources";
import { phrases } from "@/data/phrases";
import { places } from "@/data/places";
import { shopStores } from "@/data/shop-stores";
import { sosScenarios } from "@/data/sos-scenarios";
import { stayResources } from "@/data/stay-resources";
import type { Language, PhraseCard } from "@/types";

export type GlobalSearchCategory = "phrase" | "place" | "care" | "sos" | "shop" | "stay" | "official";

export interface GlobalSearchResult {
  id: string;
  category: GlobalSearchCategory;
  title: string;
  subtitle: string;
  meta: string;
  href: string;
  external?: boolean;
  searchText: string;
  priority: number;
}

const categoryPriority: Record<GlobalSearchCategory, number> = {
  sos: 120,
  care: 105,
  phrase: 95,
  official: 85,
  place: 75,
  stay: 65,
  shop: 60,
};

export const globalSearchCategoryLabels: Record<GlobalSearchCategory, string> = {
  phrase: "Phrases",
  place: "Places",
  care: "Care",
  sos: "SOS",
  shop: "Shop",
  stay: "Stay",
  official: "Official",
};

function getPhraseLocalizedText(phrase: PhraseCard, language: Language) {
  if (language === "ko") return phrase.korean;
  if (language === "en") return phrase.english;
  return phrase.translations[language] ?? phrase.english;
}

function normalize(value: string) {
  return value.toLocaleLowerCase();
}

function joinSearchText(values: Array<string | string[] | undefined>) {
  return values
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

export function buildGlobalSearchResults(language: Language): GlobalSearchResult[] {
  const phraseResults: GlobalSearchResult[] = phrases.map((phrase) => {
    const localized = getPhraseLocalizedText(phrase, language);
    return {
      id: `phrase:${phrase.id}`,
      category: "phrase",
      title: phrase.korean,
      subtitle: localized,
      meta: phrase.category.replace(/_/g, " "),
      href: `/assistant?category=${phrase.category}`,
      searchText: joinSearchText([
        phrase.korean,
        phrase.romanization,
        phrase.english,
        localized,
        phrase.situation,
        phrase.category,
        phrase.tags,
      ]),
      priority: categoryPriority.phrase,
    };
  });

  const placeResults: GlobalSearchResult[] = places.map((place) => ({
    id: `place:${place.id}`,
    category: "place",
    title: place.name,
    subtitle: place.description,
    meta: `${place.city} · ${place.category}`,
    href: `/explore?category=${place.category}`,
    searchText: joinSearchText([
      place.name,
      place.description,
      place.category,
      place.address,
      place.city,
      place.tags,
      place.supportedLanguages,
    ]),
    priority: categoryPriority.place + (place.needsConfirmation ? 0 : 5),
  }));

  const careResults: GlobalSearchResult[] = careProviders.map((provider) => ({
    id: `care:${provider.id}`,
    category: "care",
    title: provider.name,
    subtitle: provider.description,
    meta: `${provider.district} · ${provider.category}`,
    href: `/care?category=${provider.category}`,
    searchText: joinSearchText([
      provider.name,
      provider.description,
      provider.category,
      provider.district,
      provider.specialties,
      provider.supportedLanguages,
    ]),
    priority: categoryPriority.care + (provider.trustLevel === "official" ? 10 : 0),
  }));

  const sosResults: GlobalSearchResult[] = sosScenarios.map((scenario) => ({
    id: `sos:${scenario.id}`,
    category: "sos",
    title: scenario.title,
    subtitle: scenario.summary,
    meta: scenario.severity,
    href: "/sos",
    searchText: joinSearchText([
      scenario.title,
      scenario.summary,
      scenario.severity,
      scenario.steps,
      scenario.actions.map((action) => action.label),
    ]),
    priority: categoryPriority.sos + (scenario.severity === "urgent" ? 20 : 0),
  }));

  const shopResults: GlobalSearchResult[] = shopStores.map((store) => ({
    id: `shop:${store.id}`,
    category: "shop",
    title: store.name,
    subtitle: store.description,
    meta: `${store.district} · ${store.refundType}`,
    href: `/shop?category=${store.category}`,
    searchText: joinSearchText([
      store.name,
      store.description,
      store.category,
      store.district,
      store.refundType,
      store.tags,
      store.supportedLanguages,
    ]),
    priority: categoryPriority.shop + (store.refundType === "immediate" || store.refundType === "both" ? 10 : 0),
  }));

  const stayResults: GlobalSearchResult[] = stayResources.map((resource) => ({
    id: `stay:${resource.id}`,
    category: "stay",
    title: resource.title,
    subtitle: resource.description,
    meta: `${resource.provider} · ${resource.type}`,
    href: resource.link ?? "/stay",
    external: Boolean(resource.link),
    searchText: joinSearchText([resource.title, resource.description, resource.provider, resource.type, resource.contactLabel, resource.contactValue]),
    priority: categoryPriority.stay + (resource.trustLevel === "official" ? 10 : 0),
  }));

  const officialResults: GlobalSearchResult[] = officialSources.map((source) => ({
    id: `official:${source.id}`,
    category: "official",
    title: source.title,
    subtitle: source.description,
    meta: source.category,
    href: source.primaryHref,
    external: true,
    searchText: joinSearchText([source.title, source.description, source.category, source.primaryLabel, source.metadata.sourceLabel]),
    priority: categoryPriority.official + Math.max(0, 10 - source.priority),
  }));

  return [
    ...sosResults,
    ...careResults,
    ...phraseResults,
    ...officialResults,
    ...placeResults,
    ...stayResults,
    ...shopResults,
  ];
}

export function searchGlobalResults(
  allResults: GlobalSearchResult[],
  query: string,
  selectedCategory: GlobalSearchCategory | "all" = "all"
) {
  const normalizedQuery = normalize(query.trim());
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return allResults
    .filter((result) => selectedCategory === "all" || result.category === selectedCategory)
    .map((result) => {
      if (terms.length === 0) return { result, score: result.priority };
      const title = normalize(result.title);
      const subtitle = normalize(result.subtitle);
      const meta = normalize(result.meta);
      const searchText = result.searchText;
      const score = terms.reduce((sum, term) => {
        if (title.includes(term)) return sum + 40;
        if (meta.includes(term)) return sum + 18;
        if (subtitle.includes(term)) return sum + 14;
        if (searchText.includes(term)) return sum + 8;
        return sum - 100;
      }, result.priority);
      return { result, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
    .map(({ result }) => result);
}
