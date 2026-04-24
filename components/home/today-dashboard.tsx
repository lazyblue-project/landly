"use client";

import Link from "next/link";
import { ArrowRight, BellRing, CalendarDays, CloudSun, FileClock, PlaneLanding } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useReminderEngine } from "@/hooks/use-reminder-engine";
import { useLocalizedText } from "@/lib/text-localizer";

function getWeatherSnapshot(city: string) {
  const month = new Date().getMonth();

  if (month >= 11 || month <= 1) return { summary: "Cold and dry", temperature: "1°–6°C" };
  if (month >= 5 && month <= 7) return { summary: "Warm with humidity", temperature: "23°–30°C" };
  return { summary: city === "Busan" ? "Comfortable seaside weather" : city === "Jeju" ? "Mild with breeze" : "Comfortable city weather", temperature: "12°–22°C" };
}

export function TodayDashboard() {
  const { user, calendarEvents } = useAppStore();
  const { summary } = useReminderEngine();
  const { lt } = useLocalizedText();
  const today = new Date().toISOString().slice(0, 10);
  const todayEvents = calendarEvents.filter((event) => event.date === today).slice(0, 3);
  const weather = getWeatherSnapshot(user.city);

  return (
    <section className="space-y-3 px-4 pt-4">
      <div className="grid grid-cols-2 gap-3">
        <Link href="/calendar" className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm hover:bg-gray-50">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{lt("Today")}</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{lt("Calendar")}</p>
            </div>
            <CalendarDays size={18} className="text-sky-600" />
          </div>
          <div className="mt-4 space-y-2">
            {todayEvents.length === 0 ? <p className="text-sm text-gray-500">{lt("No saved plans yet. Tap to add or view events.")}</p> : todayEvents.map((event) => (
              <div key={event.id} className="rounded-2xl bg-sky-50 px-3 py-2">
                <p className="text-xs font-semibold text-sky-900">{lt(event.title)}</p>
                {event.location ? <p className="mt-1 text-[11px] text-sky-700">{lt(event.location)}</p> : null}
              </div>
            ))}
          </div>
          <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-700">
            {lt("Open Calendar")} <ArrowRight size={14} />
          </div>
        </Link>

        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-amber-700/70">{lt("Today")}</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">{lt("Weather")}</p>
            </div>
            <CloudSun size={18} className="text-amber-600" />
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-gray-900">{weather.temperature}</p>
            <p className="mt-1 text-sm text-gray-700">{lt(user.city)}</p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">{lt(weather.summary)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Link href="/pass?tab=first72" className="rounded-3xl border border-sky-100 bg-sky-50 p-4 shadow-sm hover:bg-sky-100/60">
          <PlaneLanding size={18} className="text-sky-700" />
          <p className="mt-3 text-sm font-semibold text-gray-900">{lt("Arrival 72h")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt("Fast-start checklist after landing.")}</p>
        </Link>
        <Link href="/stay?tab=first90" className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm hover:bg-emerald-100/60">
          <FileClock size={18} className="text-emerald-700" />
          <p className="mt-3 text-sm font-semibold text-gray-900">{lt("Stay 90d")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt("Long-stay missions with less guesswork.")}</p>
        </Link>
        <Link href="/my" className="rounded-3xl border border-violet-100 bg-violet-50 p-4 shadow-sm hover:bg-violet-100/60">
          <BellRing size={18} className="text-violet-700" />
          <p className="mt-3 text-sm font-semibold text-gray-900">{lt("Reminders")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">{summary.dueSoon + summary.overdue} {lt("items need attention.")}</p>
        </Link>
      </div>
    </section>
  );
}
