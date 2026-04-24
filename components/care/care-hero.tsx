"use client";

import Link from "next/link";
import { HeartPulse, Stethoscope, ShieldPlus } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

export function CareHero() {
  const { lt } = useLocalizedText();

  return (
    <section className="px-4 pt-4">
      <div className="rounded-3xl bg-gradient-to-br from-rose-600 to-pink-600 p-5 text-white shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-rose-100 text-sm">{lt("Landly Care")}</p>
            <h2 className="mt-1 text-2xl font-bold leading-tight">{lt("Get the right help, faster.")}</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-rose-100">
              {lt("Triage the moment, find foreigner-friendly care, and keep your visit prep ready before you go.")}
            </p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3">
            <HeartPulse size={26} className="text-white" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-2xl bg-white/10 p-3">
            <ShieldPlus size={16} className="mb-1" />
            {lt("Symptom guide")}
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <Stethoscope size={16} className="mb-1" />
            {lt("Clinic finder")}
          </div>
          <Link href="/care?tab=help" className="rounded-2xl bg-white p-3 font-semibold text-rose-700">
            {lt("Open help")}
          </Link>
        </div>
      </div>
    </section>
  );
}
