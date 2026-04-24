"use client";

import { FilterChip } from "@/components/common/filter-chip";
import { i18nConfig } from "@/i18n/config";
import { useUiCopy } from "@/lib/ui-copy";
import { Language, PlaceCategory, PlaceFilter } from "@/types";

const categories: { value: PlaceCategory | "all"; key: string; fallback: string }[] = [
  { value: "all", key: "explore.category_all", fallback: "All" },
  { value: "food", key: "explore.category_food", fallback: "Food" },
  { value: "cafe", key: "explore.category_cafe", fallback: "Café" },
  { value: "shopping", key: "explore.category_shopping", fallback: "Shopping" },
  { value: "hospital", key: "explore.category_hospital", fallback: "Hospital" },
  { value: "pharmacy", key: "explore.category_pharmacy", fallback: "Pharmacy" },
  { value: "convenience", key: "explore.category_convenience", fallback: "Convenience" },
  { value: "exchange", key: "explore.category_exchange", fallback: "Exchange" },
  { value: "sightseeing", key: "explore.category_sightseeing", fallback: "Sightseeing" },
  { value: "transport", key: "explore.category_transport", fallback: "Transport" },
];

const languageOptions: Language[] = ["en", "ko", "zh", "ja"];

type BooleanFilterKey = "foreignCardSupported" | "reservationSupported" | "lateNight" | "soloFriendly";

const filters: { key: BooleanFilterKey; copyKey: string; fallback: string }[] = [
  { key: "foreignCardSupported", copyKey: "explore.filter_card", fallback: "Foreign card" },
  { key: "reservationSupported", copyKey: "explore.filter_reservation", fallback: "Reservation" },
  { key: "lateNight", copyKey: "explore.filter_late_night", fallback: "Late night" },
  { key: "soloFriendly", copyKey: "explore.filter_solo", fallback: "Solo-friendly" },
];

interface ExploreFiltersProps {
  category: PlaceCategory | "all";
  onCategoryChange: (cat: PlaceCategory | "all") => void;
  activeFilters: PlaceFilter;
  onFilterToggle: (key: BooleanFilterKey) => void;
  onLanguageToggle: (language: Language) => void;
}

export function ExploreFilters({
  category,
  onCategoryChange,
  activeFilters,
  onFilterToggle,
  onLanguageToggle,
}: ExploreFiltersProps) {
  const { t } = useUiCopy();

  return (
    <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
      <div className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-none">
        {categories.map(({ value, key, fallback }) => (
          <FilterChip
            key={value}
            label={t(key, undefined, fallback)}
            active={category === value}
            onClick={() => onCategoryChange(value)}
          />
        ))}
      </div>

      <div className="px-4 pb-2">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {t("explore.filter_language", undefined, "Language support")}
        </p>
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {languageOptions.map((language) => (
            <FilterChip
              key={language}
              label={i18nConfig.localeLabels[language]}
              active={activeFilters.languages.includes(language)}
              onClick={() => onLanguageToggle(language)}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-4 pb-2.5 overflow-x-auto scrollbar-none">
        {filters.map(({ key, copyKey, fallback }) => (
          <FilterChip
            key={key}
            label={t(copyKey, undefined, fallback)}
            active={activeFilters[key] ?? false}
            onClick={() => onFilterToggle(key)}
          />
        ))}
      </div>
    </div>
  );
}
