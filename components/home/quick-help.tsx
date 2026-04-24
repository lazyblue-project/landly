"use client";

import { Phone } from "lucide-react";
import { SectionHeader } from "@/components/common/section-header";
import { useUiCopy } from "@/lib/ui-copy";

export function QuickHelp() {
  const { t } = useUiCopy();

  const emergencyItems = [
    { label: t("home.emergency_police"), number: "112", color: "bg-blue-500" },
    { label: t("home.emergency_ambulance"), number: "119", color: "bg-red-500" },
    { label: t("home.emergency_tourist"), number: "1330", color: "bg-orange-500" },
  ];

  return (
    <section className="px-4 py-4 border-t border-gray-100">
      <SectionHeader
        title={t("home.emergency_title")}
        subtitle={t("home.emergency_subtitle")}
      />
      <div className="grid grid-cols-3 gap-3">
        {emergencyItems.map(({ label, number, color }) => (
          <a
            key={label}
            href={`tel:${number}`}
            className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow active:scale-[0.97]"
          >
            <div className={`${color} p-2.5 rounded-xl`}>
              <Phone size={18} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-800">{number}</span>
            <span className="text-xs text-gray-500 text-center leading-tight">{label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
