"use client";

import { CheckCircle2, Circle, ClipboardCheck } from "lucide-react";
import { lifeChecklist } from "@/data/life-checklist";
import { ChecklistCategory, LifeChecklistItem, StayPlanInput } from "@/types";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

interface StayChecklistPriorityLanesProps {
  input: StayPlanInput;
  activeCategory: ChecklistCategory | "all";
  onCategoryChange: (value: ChecklistCategory | "all") => void;
}

interface ChecklistLane {
  id: string;
  title: string;
  subtitle: string;
  items: LifeChecklistItem[];
}

const studentPriority: ChecklistCategory[] = ["registration", "housing", "telecom", "healthcare", "work_school", "support"];
const workerPriority: ChecklistCategory[] = ["registration", "housing", "telecom", "banking", "healthcare", "tax", "work_school"];
const generalPriority: ChecklistCategory[] = ["registration", "housing", "telecom", "banking", "healthcare", "support", "tax"];

function getPriorityCategories(input: StayPlanInput): ChecklistCategory[] {
  if (input.stayType === "student") return studentPriority;
  if (input.stayType === "worker" || input.stayType === "working-holiday") return workerPriority;
  return generalPriority;
}

function getLaneItems(categories: ChecklistCategory[], start: number, end: number): LifeChecklistItem[] {
  const categorySet = new Set(categories.slice(start, end));
  return lifeChecklist.filter((item) => categorySet.has(item.category)).sort((a, b) => a.order - b.order).slice(0, 4);
}

export function StayChecklistPriorityLanes({ input, activeCategory, onCategoryChange }: StayChecklistPriorityLanesProps) {
  const { user } = useAppStore();
  const { lt } = useLocalizedText();
  const priorityCategories = getPriorityCategories(input);
  const lanes: ChecklistLane[] = [
    {
      id: "now",
      title: "Do this first",
      subtitle: "Items that often block registration, banking, insurance, or daily apps.",
      items: getLaneItems(priorityCategories, 0, 3),
    },
    {
      id: "month",
      title: "This month",
      subtitle: "Set up the systems you will keep using after the first week.",
      items: getLaneItems(priorityCategories, 3, 6),
    },
    {
      id: "later",
      title: "Before it gets urgent",
      subtitle: "Lower-frequency admin tasks that are easier when documents are organized.",
      items: getLaneItems(priorityCategories, 6, priorityCategories.length),
    },
  ];

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{lt("Priority lanes")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {lt("Landly reorders the checklist by your stay type so you do not start from a random admin list.")}
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700"><ClipboardCheck size={18} /></div>
      </div>

      <div className="mt-4 space-y-3">
        {lanes.map((lane) => (
          <div key={lane.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
            <p className="text-sm font-semibold text-gray-900">{lt(lane.title)}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(lane.subtitle)}</p>
            <div className="mt-3 grid gap-2">
              {lane.items.map((item) => {
                const done = user.completedChecklistIds.includes(item.id);
                const active = activeCategory === item.category;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onCategoryChange(item.category)}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-3 text-left transition-colors",
                      active ? "border-emerald-200 bg-white shadow-sm" : "border-transparent bg-white/70",
                    )}
                  >
                    <span className="mt-0.5 text-emerald-600">{done ? <CheckCircle2 size={17} /> : <Circle size={17} />}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-gray-900">{lt(item.title)}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-gray-500">{lt(item.description)}</span>
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-500">{lt(item.category.replace("_", " "))}</span>
                  </button>
                );
              })}
              {lane.items.length === 0 ? <p className="rounded-xl bg-white p-3 text-xs text-gray-500">{lt("No priority items in this lane yet.")}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
