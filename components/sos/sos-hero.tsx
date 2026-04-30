"use client";

import { Ambulance, Phone, ShieldAlert, Siren } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

export function SosHero() {
  const { lt } = useLocalizedText();

  return (
    <section className="px-4 pt-4">
      <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Landly SOS")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">
              {lt("A fast path for the moments foreigners get stuck in Korea: lost items, late-night illness, missed transport, and paperwork panic.")}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-2 text-amber-600 shadow-sm">
            <Siren size={20} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <a
            href="tel:119"
            className="inline-flex flex-col items-center justify-center rounded-2xl bg-red-600 px-3 py-3 text-center text-xs font-semibold text-white shadow-sm"
          >
            <Ambulance size={16} />
            <span className="mt-1">119</span>
          </a>
          <a
            href="tel:112"
            className="inline-flex flex-col items-center justify-center rounded-2xl bg-blue-600 px-3 py-3 text-center text-xs font-semibold text-white shadow-sm"
          >
            <ShieldAlert size={16} />
            <span className="mt-1">112</span>
          </a>
          <a
            href="tel:1330"
            className="inline-flex flex-col items-center justify-center rounded-2xl bg-white px-3 py-3 text-center text-xs font-semibold text-gray-800 shadow-sm"
          >
            <Phone size={16} className="text-amber-600" />
            <span className="mt-1">1330</span>
          </a>
        </div>
      </div>
    </section>
  );
}
