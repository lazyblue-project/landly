"use client";

import Link from "next/link";
import { AlertTriangle, Phone, ShieldCheck } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

const redFlags = [
  "Trouble breathing",
  "Severe chest pain",
  "Heavy bleeding",
  "Loss of consciousness",
  "Sudden weakness or confusion",
  "Severe allergic reaction",
];

interface CareEmergencyGateProps {
  compact?: boolean;
}

export function CareEmergencyGate({ compact = false }: CareEmergencyGateProps) {
  const { lt } = useLocalizedText();

  return (
    <section className={cn("rounded-3xl border border-red-100 bg-red-50 p-4 shadow-sm", compact && "rounded-2xl p-3")}>
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 text-red-600">
          <AlertTriangle size={compact ? 16 : 20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-red-900">{lt("Check emergency signs first")}</p>
          <p className="mt-1 text-xs leading-relaxed text-red-800">
            {lt("If any of these are happening, call 119 now or ask someone nearby to call for you.")}
          </p>
        </div>
      </div>

      <div className={cn("mt-3 grid gap-2", compact ? "grid-cols-1" : "grid-cols-2")}>
        {redFlags.map((item) => (
          <div key={item} className="rounded-2xl bg-white px-3 py-2 text-xs font-medium text-red-800">
            • {lt(item)}
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <a href="tel:119" className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-red-600 px-3 py-2.5 text-xs font-semibold text-white">
          <Phone size={14} />
          119
        </a>
        <a href="tel:1330" className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-white px-3 py-2.5 text-xs font-semibold text-red-700">
          <Phone size={14} />
          1330
        </a>
        <Link href="/sos" className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-white px-3 py-2.5 text-xs font-semibold text-red-700">
          <ShieldCheck size={14} />
          SOS
        </Link>
      </div>

      <div className="mt-3 rounded-2xl bg-white p-3">
        <p className="text-xs font-semibold text-gray-900">{lt("Show this phrase if you cannot explain")}</p>
        <p className="mt-2 text-lg font-bold text-gray-950">도와주세요. 119에 전화해 주세요.</p>
        <p className="mt-1 text-xs text-gray-500">{lt("Please help me. Please call 119.")}</p>
      </div>
    </section>
  );
}
