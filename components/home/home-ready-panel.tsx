"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Languages, Map, ShieldCheck, Wifi, WifiOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { essentialLanguagePhraseIds } from "@/data/language-readiness";
import { usePwaStatus } from "@/hooks/use-pwa-status";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

interface ReadyCard {
  id: string;
  href: string;
  title: string;
  description: string;
  status: string;
  ready: boolean;
  icon: LucideIcon;
  tone: string;
}

export function HomeReadyPanel() {
  const savedPhraseIds = useAppStore((state) => state.user.savedPhraseIds);
  const savedPlaceIds = useAppStore((state) => state.user.savedPlaceIds);
  const savedPassPlans = useAppStore((state) => state.savedPassPlans);
  const savedCareProviderIds = useAppStore((state) => state.savedCareProviderIds);
  const { online, offlineReady } = usePwaStatus();
  const { lt } = useLocalizedText();

  const savedEssentialCount = essentialLanguagePhraseIds.filter((id) => savedPhraseIds.includes(id)).length;
  const routeReadyCount = [savedPlaceIds.length > 0, savedPassPlans.length > 0, savedCareProviderIds.length > 0].filter(Boolean).length;
  const NetworkIcon = online ? Wifi : WifiOff;

  const cards: ReadyCard[] = [
    {
      id: "offline",
      href: "/offline",
      title: "Offline kit",
      description: "Emergency, phrase, map, and safety pages prepared for weak network moments.",
      status: offlineReady ? "Core kit cached" : "Preparing offline kit",
      ready: offlineReady,
      icon: NetworkIcon,
      tone: "bg-slate-900 text-white ring-slate-700",
    },
    {
      id: "language",
      href: "/assistant",
      title: "Language kit",
      description: "Save show-to-staff phrases before taxi, checkout, clinic, or emergency moments.",
      status: `${savedEssentialCount}/${essentialLanguagePhraseIds.length} ${lt("saved")}`,
      ready: savedEssentialCount >= Math.min(3, essentialLanguagePhraseIds.length),
      icon: Languages,
      tone: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    },
    {
      id: "map",
      href: "/navigate",
      title: "Map handoff",
      description: "Open Google Maps, NAVER Map, destination phrases, and backup checks together.",
      status: `${routeReadyCount}/3 ${lt("ready")}`,
      ready: routeReadyCount > 0,
      icon: Map,
      tone: "bg-blue-50 text-blue-700 ring-blue-100",
    },
    {
      id: "trust",
      href: "/trust",
      title: "Trust check",
      description: "Know what is official, curated, demo, partner, or needs confirmation before acting.",
      status: "Source labels visible",
      ready: true,
      icon: ShieldCheck,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
  ];

  return (
    <section className="px-4 pt-4">
      <div className="rounded-[2rem] border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600">{lt("Ready")}</p>
            <h2 className="mt-1 text-lg font-black text-gray-950">{lt("Before you move")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {lt("A quick safety check for network, language, route, and information reliability.")}
            </p>
          </div>
          <Link href="/offline" className="rounded-2xl bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 ring-1 ring-gray-100">
            {online ? lt("Online") : lt("Offline")}
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.id} href={card.href} className="rounded-3xl border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                <div className="flex items-start justify-between gap-2">
                  <div className={cn("rounded-2xl p-2 ring-1", card.tone)}>
                    <Icon size={17} />
                  </div>
                  {card.ready ? <CheckCircle2 size={16} className="text-emerald-600" /> : <ArrowRight size={15} className="text-gray-400" />}
                </div>
                <p className="mt-3 text-sm font-black text-gray-950">{lt(card.title)}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">{lt(card.description)}</p>
                <p className="mt-2 text-[11px] font-bold text-blue-700">{lt(card.status)}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
