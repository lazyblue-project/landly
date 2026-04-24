"use client";

import { useEffect, useMemo, useState } from "react";
import { FilterChip } from "@/components/common/filter-chip";
import { PhraseCard } from "@/components/common/phrase-card";
import { EmptyState } from "@/components/common/empty-state";
import { MessageSquare } from "lucide-react";
import { PhraseCategory, PhraseCard as PhraseCardType } from "@/types";
import { phrases as allPhrases } from "@/data/phrases";
import { useUiCopy } from "@/lib/ui-copy";

interface PhraseGridProps {
  initialCategory?: PhraseCategory | "all";
  category?: PhraseCategory | "all";
  onCategoryChange?: (value: PhraseCategory | "all") => void;
}

export function PhraseGrid({ initialCategory = "all", category: controlledCategory, onCategoryChange }: PhraseGridProps) {
  const [internalCategory, setInternalCategory] = useState<PhraseCategory | "all">(initialCategory);
  const { t } = useUiCopy();

  useEffect(() => {
    setInternalCategory(initialCategory);
  }, [initialCategory]);

  const category = controlledCategory ?? internalCategory;
  const handleCategoryChange = (value: PhraseCategory | "all") => {
    if (controlledCategory === undefined) {
      setInternalCategory(value);
    }
    onCategoryChange?.(value);
  };

  const categories = useMemo(
    () => [
      { value: "all" as const, label: t("explore.category_all", undefined, "All") },
      { value: "taxi" as const, label: t("assistant.category_taxi", undefined, "Taxi") },
      { value: "transport" as const, label: t("assistant.category_transport", undefined, "Transit") },
      { value: "food" as const, label: t("assistant.category_food", undefined, "Food") },
      { value: "allergy" as const, label: t("assistant.category_allergy", undefined, "Allergy") },
      { value: "shopping" as const, label: t("assistant.category_shopping", undefined, "Shopping") },
      { value: "accommodation" as const, label: t("assistant.category_accommodation", undefined, "Hotel") },
      { value: "hospital" as const, label: t("assistant.category_hospital", undefined, "Hospital") },
      { value: "delivery" as const, label: t("assistant.category_delivery", undefined, "Delivery") },
      { value: "lost_complaint" as const, label: t("assistant.category_lost_complaint", undefined, "Lost & Found") },
      { value: "emergency" as const, label: t("assistant.category_emergency", undefined, "Emergency") },
      { value: "settlement" as const, label: t("assistant.category_settlement", undefined, "Settlement") },
    ],
    [t]
  );

  const filtered: PhraseCardType[] =
    category === "all"
      ? allPhrases
      : allPhrases.filter((p) => p.category === category);

  return (
    <div>
      <div className="sticky top-14 z-30 overflow-x-auto border-b border-gray-100 bg-white px-4 py-3 scrollbar-none">
        <div className="flex gap-2">
          {categories.map(({ value, label }) => (
            <FilterChip
              key={value}
              label={label}
              active={category === value}
              onClick={() => handleCategoryChange(value)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<MessageSquare size={40} />}
            title={t("assistant.no_phrases", undefined, "No phrases found")}
          />
        ) : (
          filtered.map((phrase) => (
            <PhraseCard key={phrase.id} phrase={phrase} />
          ))
        )}
      </div>
    </div>
  );
}
