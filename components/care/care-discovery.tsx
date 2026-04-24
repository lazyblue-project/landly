"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { FilterChip } from "@/components/common/filter-chip";
import { EmptyState } from "@/components/common/empty-state";
import { CareProviderCategory, Language } from "@/types";
import { useCareProviders } from "@/hooks/use-care-providers";
import { CareProviderCard } from "./care-provider-card";
import { CareProviderDetailSheet } from "./care-provider-detail-sheet";
import { useLocalizedText } from "@/lib/text-localizer";

const categories: { value: CareProviderCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "clinic", label: "Clinic" },
  { value: "hospital", label: "Hospital" },
  { value: "dermatology", label: "Dermatology" },
  { value: "dentist", label: "Dentist" },
  { value: "health-checkup", label: "Checkup" },
  { value: "mental-health-support", label: "Mental health" },
];

const languages: { value: Language | "all"; label: string }[] = [
  { value: "all", label: "Any language" },
  { value: "en", label: "English" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
];

interface CareDiscoveryProps {
  initialCategory?: CareProviderCategory | "all";
}

export function CareDiscovery({ initialCategory = "all" }: CareDiscoveryProps) {
  const {
    providers,
    category,
    setCategory,
    search,
    setSearch,
    language,
    setLanguage,
    internationalOnly,
    setInternationalOnly,
    openNowOnly,
    setOpenNowOnly,
    reservationOnly,
    setReservationOnly,
  } = useCareProviders(initialCategory);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = providers.find((provider) => provider.id === selectedId) ?? null;
  const { lt } = useLocalizedText();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lt("Search clinic, pharmacy, checkup...")}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-900"
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {categories.map((option) => (
            <FilterChip key={option.value} label={lt(option.label)} active={category === option.value} onClick={() => setCategory(option.value)} />
          ))}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {languages.map((option) => (
            <FilterChip key={option.value} label={lt(option.label)} active={language === option.value} onClick={() => setLanguage(option.value)} />
          ))}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <FilterChip label={lt("International")} active={internationalOnly} onClick={() => setInternationalOnly(!internationalOnly)} />
          <FilterChip label={lt("Reservation")} active={reservationOnly} onClick={() => setReservationOnly(!reservationOnly)} />
          <FilterChip label={lt("Open late")} active={openNowOnly} onClick={() => setOpenNowOnly(!openNowOnly)} />
        </div>
      </div>

      <div className="space-y-3">
        {providers.length === 0 ? (
          <EmptyState title={lt("No care providers found")} description={lt("Try another category, language, or a shorter search term.")} />
        ) : (
          providers.map((provider) => <CareProviderCard key={provider.id} provider={provider} onOpen={() => setSelectedId(provider.id)} />)
        )}
      </div>

      <CareProviderDetailSheet provider={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
}
