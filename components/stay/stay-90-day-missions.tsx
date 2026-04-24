"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CheckCircle2, Circle, FileClock, FolderKanban } from "lucide-react";
import { stay90Missions } from "@/data/stay-90-missions";
import { StayMissionPhase, StayType } from "@/types";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

const phaseMeta: Array<{ phase: StayMissionPhase; title: string; subtitle: string }> = [
  { phase: "days_1_7", title: "Days 1–7", subtitle: "Stabilize the things that block everything else." },
  { phase: "days_8_30", title: "Days 8–30", subtitle: "Turn your setup into a repeatable routine." },
  { phase: "days_31_90", title: "Days 31–90", subtitle: "Review the legal and practical pieces before they become urgent." },
];

interface Stay90DayMissionsProps { stayType: StayType; }

export function Stay90DayMissions({ stayType }: Stay90DayMissionsProps) {
  const { completedStayMissionIds, toggleStayMission } = useAppStore();
  const { lt } = useLocalizedText();
  const visibleMissions = useMemo(() => stay90Missions.filter((mission) => !mission.recommendedStayTypes || mission.recommendedStayTypes.includes(stayType)), [stayType]);
  const completed = visibleMissions.filter((mission) => completedStayMissionIds.includes(mission.id)).length;

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100"><FolderKanban size={13} /> {lt("First 90 days")}</div>
            <p className="mt-3 text-base font-semibold text-gray-900">{lt("A calmer mission flow for your first three months in Korea")}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{lt("This mission view works best after you decide your stay type. Use it to avoid discovering official deadlines too late.")}</p>
          </div>
          <div className="rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-emerald-100">
            <p className="text-[11px] uppercase tracking-wide text-emerald-600">{lt("Progress")}</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{completed}/{visibleMissions.length}</p>
          </div>
        </div>
      </section>

      {phaseMeta.map((phase) => {
        const items = visibleMissions.filter((mission) => mission.phase === phase.phase);
        return (
          <section key={phase.phase} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{lt(phase.title)}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(phase.subtitle)}</p>
              </div>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">{items.length} {lt("missions")}</span>
            </div>

            <div className="space-y-3">
              {items.map((mission) => {
                const done = completedStayMissionIds.includes(mission.id);
                return (
                  <div key={mission.id} className={`rounded-2xl border p-4 ${done ? "border-emerald-200 bg-emerald-50" : "border-gray-100 bg-gray-50"}`}>
                    <div className="flex items-start gap-3">
                      <button type="button" onClick={() => toggleStayMission(mission.id)} className="mt-0.5 text-emerald-600" aria-label={done ? lt("Mark stay mission incomplete") : lt("Mark stay mission complete")}>
                        {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">{lt(mission.title)}</p>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-gray-500">{lt(mission.difficulty)}</span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt(mission.description)}</p>
                        {mission.note ? <p className="mt-2 rounded-xl bg-white px-3 py-2 text-[11px] leading-relaxed text-gray-500">{lt(mission.note)}</p> : null}
                        <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-500"><FileClock size={13} /> {lt("Category:")} {lt(mission.category.replace("_", " "))}</div>
                        {mission.href ? <Link href={mission.href} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">{lt("Open related step")}</Link> : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
