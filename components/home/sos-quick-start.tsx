"use client";

import Link from "next/link";
import { ArrowRight, ShieldAlert, Siren } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

export function SosQuickStart() {
  const { lt } = useLocalizedText();
  return (
    <section className="px-4 pt-4">
      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Landly SOS")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt("One fast path for emergency phrases, urgent phone numbers, lost-item help, and late-night care decisions.")}</p>
          </div>
          <div className="rounded-2xl bg-white p-2 text-amber-600 shadow-sm">
            <Siren size={20} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href="/sos" className="inline-flex items-center justify-between rounded-2xl bg-white px-3 py-3 text-sm font-medium text-gray-800 shadow-sm">
            {lt("Quick support")}
            <ShieldAlert size={16} className="text-amber-600" />
          </Link>
          <Link href="/assistant?category=emergency" className="inline-flex items-center justify-between rounded-2xl bg-amber-600 px-3 py-3 text-sm font-medium text-white shadow-sm">
            {lt("Emergency phrase")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
