"use client";

import { useEffect, useState } from "react";
import { FilterChip } from "@/components/common/filter-chip";
import { ChecklistItem } from "@/components/common/checklist-item";
import { SectionHeader } from "@/components/common/section-header";
import { useAppStore } from "@/store/app-store";
import { lifeChecklist } from "@/data/life-checklist";
import { ChecklistCategory } from "@/types";

const categories: { value: ChecklistCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "registration", label: "Registration" },
  { value: "telecom", label: "Telecom" },
  { value: "transport", label: "Transport" },
  { value: "banking", label: "Banking" },
  { value: "healthcare", label: "Healthcare" },
  { value: "housing", label: "Housing" },
  { value: "work_school", label: "Work & Study" },
  { value: "tax", label: "Tax" },
  { value: "support", label: "Support" },
];

interface LifeChecklistProps {
  initialCategory?: ChecklistCategory | "all";
  category?: ChecklistCategory | "all";
  onCategoryChange?: (value: ChecklistCategory | "all") => void;
}

export function LifeChecklist({ initialCategory = "all", category: controlledCategory, onCategoryChange }: LifeChecklistProps) {
  const [internalCategory, setInternalCategory] = useState<ChecklistCategory | "all">(initialCategory);
  const { user, toggleChecklistItem } = useAppStore();

  useEffect(() => {
    setInternalCategory(initialCategory);
  }, [initialCategory]);

  const category = controlledCategory ?? internalCategory;
  const handleCategoryChange = (value: ChecklistCategory | "all") => {
    if (controlledCategory === undefined) {
      setInternalCategory(value);
    }
    onCategoryChange?.(value);
  };

  const filtered =
    category === "all"
      ? lifeChecklist
      : lifeChecklist.filter((item) => item.category === category);

  const completedCount = user.completedChecklistIds.length;
  const totalCount = lifeChecklist.length;

  return (
    <div>
      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <SectionHeader
          title={`${completedCount} / ${totalCount} completed`}
          subtitle="Tap an item to expand details"
        />
        <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-emerald-500 transition-all"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="sticky top-14 z-30 flex gap-2 overflow-x-auto border-b border-gray-100 bg-white px-4 py-2.5 scrollbar-none">
        {categories.map(({ value, label }) => (
          <FilterChip
            key={value}
            label={label}
            active={category === value}
            onClick={() => handleCategoryChange(value)}
          />
        ))}
      </div>

      <div className="space-y-3 px-4 py-4">
        {filtered.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            isCompleted={user.completedChecklistIds.includes(item.id)}
            onToggle={() => toggleChecklistItem(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
