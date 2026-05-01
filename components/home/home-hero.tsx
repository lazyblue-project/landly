"use client";

import Link from "next/link";
import { AlertTriangle, CalendarDays, ToggleLeft, ToggleRight } from "lucide-react";
import { AppMode } from "@/types";
import { getCityCoverage } from "@/lib/city-coverage";
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";

interface HomeHeroProps {
  name: string;
  mode: AppMode;
  city: string;
  onToggleMode: () => void;
}

export function HomeHero({ name, mode, city, onToggleMode }: HomeHeroProps) {
  const isTravel = mode === "travel";
  const { lt, isKo } = useLocalizedText();
  const coverage = getCityCoverage(city);
  const showCoverageNotice = coverage.level !== "ready";

  return (
    <div className={cn("px-4 pt-6 pb-5 transition-colors", isTravel ? "bg-gradient-to-br from-blue-600 to-blue-500" : "bg-gradient-to-br from-emerald-600 to-emerald-500")}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-blue-100">{lt("Hello, {name}!", { name })}</p>
          <h1 className="mt-0.5 text-2xl font-bold text-white">{lt(isTravel ? "Travel Mode" : "Life Mode")}</h1>
          <p className="mt-1 text-xs text-blue-100">{lt(city)}{isKo ? ", 한국" : ", South Korea"}</p>
        </div>

        <button onClick={onToggleMode} className="flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 transition-colors hover:bg-white/30">
          {isTravel ? <ToggleLeft size={18} className="text-white" /> : <ToggleRight size={18} className="text-white" />}
          <span className="text-xs font-medium text-white">{lt(isTravel ? "Switch to Life" : "Switch to Travel")}</span>
        </button>
      </div>

      {showCoverageNotice ? (
        <div className="mt-4 rounded-3xl bg-white/15 p-3 text-white ring-1 ring-white/20">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold">
                {lt(coverage.level === "preparing" ? "City data is being prepared" : "City data is limited")}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/85">
                {lt("Landly will keep Seoul-ready routes, phrases, and official checks visible while {city} content grows.", { city })}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/calendar" className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm">
          <CalendarDays size={16} />
          {lt("Open Calendar")}
        </Link>
        <Link href={isTravel ? "/pass" : "/stay?tab=overview"} className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-white/20">
          {lt(isTravel ? "Open Pass" : "Open Stay")}
        </Link>
      </div>
    </div>
  );
}
