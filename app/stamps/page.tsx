"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Award, CheckCircle2, ExternalLink, Plus, Sparkles, Target, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { officialStampGoals } from "@/data/stamp-catalog";
import { useAppStore } from "@/store/app-store";
import { StampCategory, StampGoal } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";
import { StampRetentionLoop } from "@/components/stamps/stamp-retention-loop";

const categories: Array<{ id: "all" | StampCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "food", label: "Food" },
  { id: "location", label: "Location" },
  { id: "culture", label: "Culture" },
  { id: "transport", label: "Transport" },
  { id: "life", label: "Life" },
  { id: "shopping", label: "Shopping" },
  { id: "care", label: "Care" },
];

function getLevel(completedCount: number) {
  if (completedCount >= 10) return "Korea Local Pro";
  if (completedCount >= 6) return "Seoul Comfort Level";
  if (completedCount >= 3) return "Korea Explorer";
  return "Arrival Starter";
}

function StampGoalCard({ goal, completed, onToggle, onRemove }: { goal: StampGoal; completed: boolean; onToggle: () => void; onRemove?: () => void; }) {
  const { lt } = useLocalizedText();
  return (
    <div className={`rounded-3xl border p-4 shadow-sm transition-colors ${completed ? "border-emerald-200 bg-emerald-50" : "border-gray-100 bg-white"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">{lt(goal.category)}</span>
            <span className="text-xs font-medium text-gray-400">+{goal.points} pt</span>
            {goal.source === "custom" ? <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">{lt("My goal")}</span> : null}
          </div>
          <p className="mt-3 text-sm font-semibold text-gray-900">{lt(goal.title)}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt(goal.description)}</p>
          {goal.city ? <p className="mt-2 text-[11px] font-medium text-gray-400">{lt("Best in")} {lt(goal.city)}</p> : null}
          {goal.nudge ? <p className="mt-2 rounded-2xl bg-gray-50 px-3 py-2 text-[11px] leading-relaxed text-gray-500">{lt(goal.nudge)}</p> : null}
        </div>
        {onRemove ? <button type="button" onClick={onRemove} className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100" aria-label={lt("Remove")}><Trash2 size={14} /></button> : null}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2">
        {goal.href ? <Link href={goal.href} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200"><ExternalLink size={16} /> {lt("Open step")}</Link> : null}
        <button type="button" onClick={onToggle} className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${completed ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-sky-600 text-white hover:bg-sky-700"}`}><CheckCircle2 size={16} /> {lt(completed ? "Completed" : "Mark complete")}</button>
      </div>
    </div>
  );
}

export default function StampsPage() {
  const { hasHydrated, customStampGoals, completedStampGoalIds, addCustomStampGoal, removeCustomStampGoal, toggleStampGoalCompleted } = useAppStore();
  const { lt } = useLocalizedText();
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]["id"]>("all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<StampCategory>("food");

  const allGoals = useMemo(() => [...officialStampGoals, ...customStampGoals], [customStampGoals]);
  const visibleGoals = useMemo(() => activeCategory === "all" ? allGoals : allGoals.filter((goal) => goal.category === activeCategory), [activeCategory, allGoals]);
  const completedGoals = allGoals.filter((goal) => completedStampGoalIds.includes(goal.id));
  const completedCount = completedGoals.length;
  const totalPoints = completedGoals.reduce((sum, goal) => sum + goal.points, 0);
  const categorySummary = categories.filter((item) => item.id !== "all").map((item) => ({ id: item.id, label: item.label, done: allGoals.filter((goal) => goal.category === item.id && completedStampGoalIds.includes(goal.id)).length, total: allGoals.filter((goal) => goal.category === item.id).length }));
  const handleAddGoal = () => { if (!title.trim()) return; addCustomStampGoal({ title: title.trim(), description: description.trim() || "My own Korea goal", category }); setTitle(""); setDescription(""); setCategory("food"); };

  if (!hasHydrated) return <AppShell><TopBar title={lt("Stamps")} showBack /><div className="flex min-h-[60vh] items-center justify-center px-4 text-sm text-gray-500">{lt("Preparing your achievement dashboard…")}</div></AppShell>;

  return (
    <AppShell>
      <TopBar title={lt("Stamps")} showBack />
      <div className="space-y-4 px-4 py-4">
        <StampRetentionLoop />

        <section className="rounded-3xl bg-gradient-to-br from-amber-50 via-white to-sky-50 p-5 shadow-sm ring-1 ring-amber-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-100"><Award size={13} /> {lt(getLevel(completedCount))}</div>
              <p className="mt-3 text-lg font-semibold text-gray-900">{lt("Track what you have done in Korea")}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{lt("Use official Landly goals for travel and life moments, or add your own personal mission.")}</p>
            </div>
            <Sparkles className="mt-1 text-amber-500" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100"><p className="text-[11px] font-medium text-gray-500">{lt("Completed")}</p><p className="mt-1 text-xl font-semibold text-gray-900">{completedCount}</p></div>
            <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100"><p className="text-[11px] font-medium text-gray-500">{lt("Points")}</p><p className="mt-1 text-xl font-semibold text-gray-900">{totalPoints}</p></div>
            <div className="rounded-2xl bg-white p-3 ring-1 ring-gray-100"><p className="text-[11px] font-medium text-gray-500">{lt("My goals")}</p><p className="mt-1 text-xl font-semibold text-gray-900">{customStampGoals.length}</p></div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900"><Target size={16} className="text-sky-600" /> {lt("Progress by category")}</div>
          <div className="mt-3 grid grid-cols-2 gap-3">{categorySummary.map((item) => <button key={item.id} type="button" onClick={() => setActiveCategory(item.id)} className={`rounded-2xl border px-3 py-3 text-left transition-colors ${activeCategory === item.id ? "border-sky-200 bg-sky-50" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}><p className="text-xs font-semibold text-gray-900">{lt(item.label)}</p><p className="mt-1 text-xs text-gray-500">{item.done} / {item.total} {lt("completed")}</p></button>)}</div>
          <div className="mt-3 flex flex-wrap gap-2">{categories.map((item) => <button key={item.id} type="button" onClick={() => setActiveCategory(item.id)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${activeCategory === item.id ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{lt(item.label)}</button>)}</div>
        </section>

        <section className="space-y-3">{visibleGoals.map((goal) => <StampGoalCard key={goal.id} goal={goal} completed={completedStampGoalIds.includes(goal.id)} onToggle={() => toggleStampGoalCompleted(goal.id)} onRemove={goal.source === "custom" ? () => removeCustomStampGoal(goal.id) : undefined} />)}</section>

        <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900"><Plus size={16} className="text-sky-600" /> {lt("Add my own goal")}</div>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt("Good for resident tasks, food buckets, or small location goals that matter to you.")}</p>
          <div className="mt-4 space-y-3">
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder={lt("Example: Finish ARC photo prep")} className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none" />
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder={lt("Optional note")} rows={3} className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none" />
            <div className="flex flex-wrap gap-2">{categories.filter((item) => item.id !== "all").map((item) => <button key={item.id} type="button" onClick={() => setCategory(item.id as StampCategory)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${category === item.id ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"}`}>{lt(item.label)}</button>)}</div>
            <button type="button" onClick={handleAddGoal} className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700">{lt("Save my stamp goal")}</button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
