"use client";

import { ShieldAlert, Siren } from "lucide-react";
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

        <div className="mt-4 grid grid-cols-2 gap-2">
          <a
            href="tel:1330"
            className="inline-flex items-center justify-between rounded-2xl bg-white px-3 py-3 text-sm font-medium text-gray-800 shadow-sm"
          >
            {lt("Tourist hotline")}
            <ShieldAlert size={16} className="text-amber-600" />
          </a>
          <a
            href="tel:112"
            className="inline-flex items-center justify-between rounded-2xl bg-amber-600 px-3 py-3 text-sm font-medium text-white shadow-sm"
          >
            {lt("Police 112")}
            <ShieldAlert size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
