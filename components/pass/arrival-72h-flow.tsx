"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CalendarClock, CheckCircle2, Circle, PlaneLanding, ShieldCheck } from "lucide-react";
import { arrival72Tasks } from "@/data/arrival-72-flow";
import { Arrival72Phase, ArrivalPlanInput } from "@/types";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

const phaseMeta: Array<{ phase: Arrival72Phase; title: string; subtitle: string }> = [
  { phase: "before_landing", title: "Before landing", subtitle: "Lock in the essentials before airport stress begins." },
  { phase: "arrival_day", title: "Arrival day", subtitle: "Make the route choice fit your real condition outside the terminal." },
  { phase: "first_night", title: "First night", subtitle: "Keep fallback help close when you are tired and least flexible." },
  { phase: "day_2", title: "Day 2", subtitle: "Turn your first impression into a smarter setup." },
  { phase: "day_3", title: "Day 3", subtitle: "Move confirmed plans and backups into a calmer routine." },
];

interface Arrival72hFlowProps { input: ArrivalPlanInput; }

export function Arrival72hFlow({ input }: Arrival72hFlowProps) {
  const { completedArrival72TaskIds, toggleArrival72Task } = useAppStore();
  const { lt } = useLocalizedText();

  const groups = useMemo(() => phaseMeta.map((group) => ({ ...group, items: arrival72Tasks.filter((task) => { if (task.phase !== group.phase) return false; if (!task.idealFor) return true; return task.idealFor.includes(input.arrivalTimeBand); }) })), [input.arrivalTimeBand]);
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const completed = groups.reduce((sum, group) => sum + group.items.filter((item) => completedArrival72TaskIds.includes(item.id)).length, 0);

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-sky-100 bg-sky-50 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-100"><PlaneLanding size={13} /> {lt("First 72 hours")}</div>
            <p className="mt-3 text-base font-semibold text-gray-900">{lt("Your calm-start checklist after landing in Korea")}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{input.arrivalDate || lt("your arrival")}, {input.destinationArea}, {lt(input.arrivalTimeBand.replace("_", " "))}</p>
          </div>
          <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm ring-1 ring-sky-100">
            <p className="text-[11px] uppercase tracking-wide text-sky-500">{lt("Progress")}</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{completed}/{total}</p>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/80"><div className="h-2 rounded-full bg-sky-600 transition-all" style={{ width: `${total === 0 ? 0 : (completed / total) * 100}%` }} /></div>
      </section>

      {groups.map((group) => (
        <section key={group.phase} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div><p className="text-sm font-semibold text-gray-900">{lt(group.title)}</p><p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(group.subtitle)}</p></div>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">{group.items.length} {lt("items")}</span>
          </div>
          <div className="space-y-3">
            {group.items.map((task) => {
              const done = completedArrival72TaskIds.includes(task.id);
              return (
                <div key={task.id} className={`rounded-2xl border p-4 transition-colors ${done ? "border-emerald-200 bg-emerald-50" : "border-gray-100 bg-gray-50"}`}>
                  <div className="flex items-start gap-3">
                    <button type="button" onClick={() => toggleArrival72Task(task.id)} className="mt-0.5 text-emerald-600" aria-label={lt(done ? "Completed" : "Mark complete")}>{done ? <CheckCircle2 size={18} /> : <Circle size={18} />}</button>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">{lt(task.title)}</p>
                      <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt(task.description)}</p>
                      {task.note ? <p className="mt-2 rounded-xl bg-white px-3 py-2 text-[11px] leading-relaxed text-gray-500">{lt(task.note)}</p> : null}
                      {task.href ? <Link href={task.href} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-700">{lt("Open related flow")} <ShieldCheck size={13} /></Link> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3"><div className="rounded-2xl bg-amber-50 p-2 text-amber-700"><CalendarClock size={18} /></div><div><p className="text-sm font-semibold text-gray-900">{lt("Pro tip")}</p><p className="mt-1 text-xs leading-relaxed text-gray-600">{lt("Save your chosen arrival route first, then move the confirmed plan into Calendar. It is much easier to trust one saved route than to keep comparing four options after baggage claim.")}</p></div></div>
      </section>
    </div>
  );
}
