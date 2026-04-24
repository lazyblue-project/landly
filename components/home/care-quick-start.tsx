"use client";

import Link from "next/link";
import { ArrowRight, ShieldPlus, Stethoscope } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

export function CareQuickStart() {
  const { lt } = useLocalizedText();
  return (
    <section className="px-4 pt-4">
      <div className="rounded-3xl border border-rose-100 bg-rose-50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Landly Care")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt("Get the right help, faster.")}</p>
          </div>
          <div className="rounded-2xl bg-white p-2 text-rose-600 shadow-sm">
            <Stethoscope size={20} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href="/care?tab=triage" className="inline-flex items-center justify-between rounded-2xl bg-white px-3 py-3 text-sm font-medium text-gray-800 shadow-sm">
            {lt("Triage")}
            <ShieldPlus size={16} className="text-rose-600" />
          </Link>
          <Link href="/care?tab=overview" className="inline-flex items-center justify-between rounded-2xl bg-rose-600 px-3 py-3 text-sm font-medium text-white shadow-sm">
            {lt("Open Care")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
