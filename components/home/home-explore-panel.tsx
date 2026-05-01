"use client";

import Link from "next/link";
import { ArrowRight, BadgePercent, BookOpenText, Gift, TestTube2, HeartPulse, Plane, ShieldAlert, ShoppingBag, Sparkles } from "lucide-react";
import { isBetaToolsEnabled, isPartnerOffersEnabled } from "@/lib/feature-flags";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";

const serviceItems = [
  { href: "/pass", label: "Pass", description: "Arrival, transit, and first 72 hours", icon: Plane, tone: "bg-sky-50 text-sky-700 ring-sky-100" },
  { href: "/shop", label: "Shop", description: "Refund wallet and shopping help", icon: ShoppingBag, tone: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
  { href: "/care", label: "Care", description: "Clinic, pharmacy, and visit prep", icon: HeartPulse, tone: "bg-rose-50 text-rose-700 ring-rose-100" },
  { href: "/sos", label: "SOS", description: "Emergency numbers and scripts", icon: ShieldAlert, tone: "bg-amber-50 text-amber-700 ring-amber-100" },
  { href: "/stay", label: "Stay", description: "90-day settlement planner", icon: BookOpenText, tone: "bg-violet-50 text-violet-700 ring-violet-100" },
];

const loopItems = [
  { id: "stamps", href: "/stamps", label: "Stamp missions", description: "Turn useful actions into progress", icon: Sparkles, tone: "bg-amber-50 text-amber-700 ring-amber-100" },
  { id: "promotions", href: "/promotions", label: "Promotions", description: "Persona-based events and coupons", icon: Gift, tone: "bg-violet-50 text-violet-700 ring-violet-100" },
  { id: "partners", href: "/partners", label: "Partner offers", description: "Clearly labeled commercial lanes", icon: BadgePercent, tone: "bg-rose-50 text-rose-700 ring-rose-100" },
  { id: "test", href: "/test", label: "Beta test guide", description: "Run missions and collect feedback notes", icon: TestTube2, tone: "bg-blue-50 text-blue-700 ring-blue-100" },
];

export function HomeExplorePanel() {
  const { lt } = useLocalizedText();
  const isBetaTester = useAppStore((state) => state.isBetaTester);
  const visibleLoopItems = loopItems.filter((item) => {
    if (item.id === "partners") return isPartnerOffersEnabled(isBetaTester);
    if (item.id === "test") return isBetaToolsEnabled(isBetaTester);
    return true;
  });

  return (
    <section className="px-4 py-4">
      <div className="rounded-[2rem] border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-violet-600">{lt("Explore")}</p>
            <h2 className="mt-1 text-lg font-black text-gray-950">{lt("Open a Landly lane")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {lt("Use deeper tools only when you need them, instead of crowding the first screen.")}
            </p>
          </div>
          <Link href="/more" className="shrink-0 rounded-2xl bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 ring-1 ring-gray-100">
            {lt("More")}
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {serviceItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-2 rounded-2xl px-2 py-3 text-center transition-colors hover:bg-gray-50">
                <span className={`rounded-2xl p-2.5 ring-1 ${item.tone}`}>
                  <Icon size={17} />
                </span>
                <span className="text-[11px] font-bold text-gray-800">{lt(item.label)}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-3 space-y-2">
          {visibleLoopItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-3xl bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                <span className={`rounded-2xl p-2 ring-1 ${item.tone}`}>
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-950">{lt(item.label)}</p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{lt(item.description)}</p>
                </div>
                <ArrowRight size={15} className="shrink-0 text-gray-400" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
