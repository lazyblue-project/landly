"use client";

import Link from "next/link";
import { ArrowRight, PlaneLanding, Route } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

export function PassQuickStart() {
  const { lt } = useLocalizedText();

  return (
    <section className="px-4 pt-4">
      <div className="rounded-3xl border border-sky-100 bg-sky-50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Landly Pass")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt("Travel smarter from the moment you land.")}</p>
          </div>
          <div className="rounded-2xl bg-white p-2 text-sky-600 shadow-sm">
            <PlaneLanding size={20} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href="/pass?tab=first72" className="inline-flex items-center justify-between rounded-2xl bg-white px-3 py-3 text-sm font-medium text-gray-800 shadow-sm">
            {lt("First 72h")}
            <Route size={16} className="text-sky-600" />
          </Link>
          <Link href="/pass?tab=arrival" className="inline-flex items-center justify-between rounded-2xl bg-sky-600 px-3 py-3 text-sm font-medium text-white shadow-sm">
            {lt("Open Pass")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
