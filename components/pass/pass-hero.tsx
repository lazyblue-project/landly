"use client";

import Link from "next/link";
import { Plane, ShieldCheck, Train, Users } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

export function PassHero() {
  const { lt } = useLocalizedText();
  return (
    <section className="px-4 pt-4">
      <div className="rounded-3xl bg-gradient-to-br from-sky-600 to-indigo-600 p-5 text-white shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-sky-100">{lt("Landly Pass")}</p>
            <h2 className="mt-1 text-2xl font-bold leading-tight">{lt("Travel smarter from the moment you land.")}</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-sky-100">{lt("Compare airport rail, bus, taxi, and the pass that actually fits your Korea trip. Then use the first-72-hours flow so the next step stays obvious.")}</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3"><Plane size={26} className="text-white" /></div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
          <div className="rounded-2xl bg-white/10 p-3"><Train size={16} className="mb-1" />{lt("Airport routes")}</div>
          <div className="rounded-2xl bg-white/10 p-3"><ShieldCheck size={16} className="mb-1" />{lt("Trusted links")}</div>
          <Link href="/pass?tab=first72" className="rounded-2xl bg-white/10 p-3"><ShieldCheck size={16} className="mb-1" />{lt("First 72h")}</Link>
          <Link href="/pass?tab=companions" className="rounded-2xl bg-white p-3 font-semibold text-sky-700"><Users size={16} className="mb-1" />{lt("Companions")}</Link>
        </div>
      </div>
    </section>
  );
}
