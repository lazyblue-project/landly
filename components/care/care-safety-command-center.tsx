"use client";

import Link from "next/link";
import { AlertTriangle, Ambulance, ClipboardCheck, Languages, Phone, ShieldAlert } from "lucide-react";
import { emergencySupportRoutes } from "@/data/emergency-support-routes";
import { CareTriageResult } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

interface CareSafetyCommandCenterProps {
  result?: CareTriageResult;
  compact?: boolean;
}

const supportRouteIds = ["medical", "police", "tourist"] as const;

export function CareSafetyCommandCenter({ result, compact = false }: CareSafetyCommandCenterProps) {
  const { lt } = useLocalizedText();
  const showSnackbar = useAppStore((state) => state.showSnackbar);
  const isEmergency = result?.level === "emergency";
  const supportRoutes = emergencySupportRoutes.filter((route) => supportRouteIds.includes(route.id as (typeof supportRouteIds)[number]));
  const emergencyPhrase = isEmergency
    ? "응급상황입니다. 119에 전화해 주세요."
    : "외국인입니다. 병원/약국 방문에 도움이 필요합니다.";

  const copyPhrase = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(emergencyPhrase);
      showSnackbar(lt("Safety phrase copied."), "success");
    }
  };

  return (
    <section className={cn("rounded-3xl border p-4 shadow-sm", isEmergency ? "border-red-200 bg-red-50" : "border-sky-100 bg-sky-50", compact && "rounded-2xl p-3")}>
      <div className="flex items-start gap-3">
        <div className={cn("rounded-2xl bg-white p-2", isEmergency ? "text-red-600" : "text-sky-600")}>
          {isEmergency ? <AlertTriangle size={20} /> : <ShieldAlert size={20} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-semibold", isEmergency ? "text-red-900" : "text-sky-950")}>{lt("Safety command center")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-700">
            {lt(isEmergency ? "Red flags are selected. Use emergency help first, then use Landly for phrases and visit preparation." : "Use this as an action guide, not a diagnosis. Choose the safest official route first.")}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {supportRoutes.map((route) => (
          <a
            key={route.id}
            href={`tel:${route.number}`}
            className={cn(
              "rounded-2xl bg-white px-3 py-3 text-center shadow-sm",
              route.id === "medical" && isEmergency ? "ring-2 ring-red-500" : ""
            )}
          >
            <p className="text-[11px] font-medium text-gray-500">{lt(route.title)}</p>
            <p className="mt-1 text-lg font-bold text-gray-950">{route.number}</p>
          </a>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2">
        <Link href="/sos" className="flex items-center justify-between rounded-2xl bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm">
          <span className="inline-flex items-center gap-2"><Ambulance size={16} className="text-red-600" /> {lt("Open full SOS flow")}</span>
          <span className="text-xs text-gray-400">→</span>
        </Link>
        <Link href="/care?tab=prep" className="flex items-center justify-between rounded-2xl bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm">
          <span className="inline-flex items-center gap-2"><ClipboardCheck size={16} className="text-rose-600" /> {lt("Prepare visit note")}</span>
          <span className="text-xs text-gray-400">→</span>
        </Link>
      </div>

      <div className="mt-3 rounded-2xl bg-white p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-900"><Languages size={14} /> {lt("Show-to-staff phrase")}</p>
            <p className="mt-2 text-base font-bold text-gray-950">{emergencyPhrase}</p>
            <p className="mt-1 text-xs text-gray-500">{lt(isEmergency ? "Emergency. Please call 119." : "I am a foreigner. I need help visiting a clinic or pharmacy.")}</p>
          </div>
          <button type="button" onClick={copyPhrase} className="shrink-0 rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700">
            {lt("Copy")}
          </button>
        </div>
      </div>
    </section>
  );
}
