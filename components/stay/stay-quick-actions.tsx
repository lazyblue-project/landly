"use client";

import Link from "next/link";
import { CalendarClock, Files, FolderKanban, Landmark, ShieldCheck } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

const quickActions = [
  { href: "/stay?tab=first90", title: "Track first 90 days", description: "See the missions most likely to unblock your setup fast.", icon: FolderKanban, accent: "text-emerald-700 bg-emerald-100" },
  { href: "/stay?tab=plan", title: "Build my plan", description: "Turn your stay type into the next tasks that matter.", icon: Landmark, accent: "text-sky-700 bg-sky-100" },
  { href: "/stay?tab=checklist", title: "Check deadlines", description: "Registration, housing, insurance, tax, and support basics.", icon: CalendarClock, accent: "text-violet-700 bg-violet-100" },
  { href: "/stay?tab=documents", title: "Save documents", description: "Keep contract, passport, insurance, and school/work notes together.", icon: Files, accent: "text-amber-700 bg-amber-100" },
  { href: "/stay?tab=guides", title: "Find official help", description: "Jump to immigration, NHIS, student, housing, and labor support.", icon: ShieldCheck, accent: "text-rose-700 bg-rose-100" },
];

export function StayQuickActions() {
  const { lt } = useLocalizedText();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {quickActions.map(({ href, title, description, icon: Icon, accent }) => (
        <Link key={href} href={href} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-transform active:scale-[0.99]">
          <div className={`inline-flex rounded-xl p-2 ${accent}`}><Icon size={18} /></div>
          <p className="mt-3 text-sm font-semibold text-gray-900">{lt(title)}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(description)}</p>
        </Link>
      ))}
    </div>
  );
}
