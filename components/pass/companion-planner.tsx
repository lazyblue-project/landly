"use client";

import { useMemo, useState } from "react";
import { Users, Baby, BriefcaseMedical, Accessibility, Trash2 } from "lucide-react";
import { CompanionProfile, CompanionRelation, Language, MobilityNeed } from "@/types";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

const relationOptions: Array<{ value: CompanionRelation; label: string }> = [
  { value: "partner", label: "Partner" },
  { value: "child", label: "Child" },
  { value: "parent", label: "Parent" },
  { value: "friend", label: "Friend" },
  { value: "coworker", label: "Coworker" },
  { value: "group", label: "Group member" },
];
const languageOptions: Language[] = ["en", "ko", "zh", "ja", "es", "fr"];
const mobilityOptions: Array<{ value: MobilityNeed; label: string }> = [
  { value: "none", label: "No extra mobility support" },
  { value: "stroller", label: "Stroller" },
  { value: "wheelchair", label: "Wheelchair" },
  { value: "slow-walking", label: "Slow walking" },
];

interface CompanionPlannerProps { onApplyGroupSize: (size: number) => void; }

export function CompanionPlanner({ onApplyGroupSize }: CompanionPlannerProps) {
  const { companions, saveCompanion, removeCompanion } = useAppStore();
  const { lt } = useLocalizedText();
  const [draft, setDraft] = useState<Omit<CompanionProfile, "id">>({ name: "", relation: "partner", language: "en", mobilityNeed: "none", hasHeavyLuggage: false, needsLateNightSupport: false, needsMedicalSupport: false, note: "" });
  const summary = useMemo(() => ({ total: companions.length + 1, heavyLuggage: companions.filter((item) => item.hasHeavyLuggage).length, specialMobility: companions.filter((item) => item.mobilityNeed !== "none").length, medical: companions.filter((item) => item.needsMedicalSupport).length, lateNight: companions.filter((item) => item.needsLateNightSupport).length }), [companions]);

  const handleSave = () => {
    if (draft.name.trim() === "") return;
    saveCompanion({ ...draft, id: `companion_${Date.now()}`, name: draft.name.trim(), note: draft.note?.trim() || undefined });
    setDraft({ name: "", relation: "partner", language: "en", mobilityNeed: "none", hasHeavyLuggage: false, needsLateNightSupport: false, needsMedicalSupport: false, note: "" });
  };

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-violet-100 bg-violet-50 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-100"><Users size={13} /> {lt("Group & companions")}</div>
            <p className="mt-3 text-base font-semibold text-gray-900">{lt("Plan for the people you are actually moving with")}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{lt("Use this when your best airport route changes because of children, luggage, medical needs, or slower walking speed.")}</p>
          </div>
          <button type="button" onClick={() => onApplyGroupSize(summary.total)} className="rounded-2xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-700">{lt("Apply group size")} ({summary.total})</button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-white p-3 ring-1 ring-violet-100"><p className="text-[11px] text-gray-500">{lt("Travelers")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{summary.total}</p></div>
          <div className="rounded-2xl bg-white p-3 ring-1 ring-violet-100"><p className="text-[11px] text-gray-500">{lt("Heavy luggage")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{summary.heavyLuggage}</p></div>
          <div className="rounded-2xl bg-white p-3 ring-1 ring-violet-100"><p className="text-[11px] text-gray-500">{lt("Mobility support")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{summary.specialMobility}</p></div>
          <div className="rounded-2xl bg-white p-3 ring-1 ring-violet-100"><p className="text-[11px] text-gray-500">{lt("Medical / night")}</p><p className="mt-1 text-lg font-semibold text-gray-900">{summary.medical + summary.lateNight}</p></div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">{lt("Add a companion")}</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="col-span-2 space-y-1.5"><span className="text-xs font-medium text-gray-600">{lt("Name or label")}</span><input value={draft.name} onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none" placeholder={lt("Mom / Child / Friend 1")} /></label>
          <label className="space-y-1.5"><span className="text-xs font-medium text-gray-600">{lt("Relation")}</span><select value={draft.relation} onChange={(event) => setDraft((prev) => ({ ...prev, relation: event.target.value as CompanionRelation }))} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none">{relationOptions.map((option) => <option key={option.value} value={option.value}>{lt(option.label)}</option>)}</select></label>
          <label className="space-y-1.5"><span className="text-xs font-medium text-gray-600">{lt("Main language")}</span><select value={draft.language ?? "en"} onChange={(event) => setDraft((prev) => ({ ...prev, language: event.target.value as Language }))} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none">{languageOptions.map((lang) => <option key={lang} value={lang}>{lt(lang)}</option>)}</select></label>
          <label className="col-span-2 space-y-1.5"><span className="text-xs font-medium text-gray-600">{lt("Mobility")}</span><select value={draft.mobilityNeed} onChange={(event) => setDraft((prev) => ({ ...prev, mobilityNeed: event.target.value as MobilityNeed }))} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none">{mobilityOptions.map((option) => <option key={option.value} value={option.value}>{lt(option.label)}</option>)}</select></label>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-3">
          <label className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2.5"><input type="checkbox" checked={draft.hasHeavyLuggage} onChange={(event) => setDraft((prev) => ({ ...prev, hasHeavyLuggage: event.target.checked }))} /> {lt("Heavy luggage")}</label>
          <label className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2.5"><input type="checkbox" checked={draft.needsLateNightSupport} onChange={(event) => setDraft((prev) => ({ ...prev, needsLateNightSupport: event.target.checked }))} /> {lt("Late-night support")}</label>
          <label className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2.5"><input type="checkbox" checked={draft.needsMedicalSupport} onChange={(event) => setDraft((prev) => ({ ...prev, needsMedicalSupport: event.target.checked }))} /> {lt("Medical support")}</label>
        </div>
        <label className="mt-3 block space-y-1.5"><span className="text-xs font-medium text-gray-600">{lt("Notes")}</span><textarea value={draft.note} onChange={(event) => setDraft((prev) => ({ ...prev, note: event.target.value }))} className="min-h-20 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none" placeholder={lt("Stroller, cannot use stairs easily, needs pharmacy stop, etc.")} /></label>
        <button type="button" onClick={handleSave} className="mt-3 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700">{lt("Save companion")}</button>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Saved companion notes")}</p>
            <p className="mt-1 text-xs text-gray-500">{lt("Keep practical travel constraints visible before you pick a route.")}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600"><Baby size={12} /> {companions.length} {lt("saved")}</div>
        </div>
        <div className="space-y-3">
          {companions.length === 0 ? <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">{lt("Add the people you are travelling with so route choices stay realistic.")}</div> : companions.map((companion) => (
            <div key={companion.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-sm font-semibold text-gray-900">{companion.name}</p><p className="mt-1 text-xs text-gray-500">{lt(companion.relation)} · {lt(companion.language ?? "en")}</p></div>
                <button type="button" onClick={() => removeCompanion(companion.id)} className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100" aria-label={lt("Remove")}><Trash2 size={14} /></button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                {companion.mobilityNeed !== "none" ? <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 font-semibold text-violet-700"><Accessibility size={12} /> {lt(companion.mobilityNeed)}</span> : null}
                {companion.hasHeavyLuggage ? <span className="rounded-full bg-sky-50 px-2.5 py-1 font-semibold text-sky-700">{lt("Heavy luggage")}</span> : null}
                {companion.needsMedicalSupport ? <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 font-semibold text-rose-700"><BriefcaseMedical size={12} /> {lt("Medical support")}</span> : null}
                {companion.needsLateNightSupport ? <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">{lt("Night support")}</span> : null}
              </div>
              {companion.note ? <p className="mt-3 text-xs leading-relaxed text-gray-600">{companion.note}</p> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
