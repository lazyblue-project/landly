"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  Copy,
  FileText,
  HeartPulse,
  Languages,
  MapPinned,
  PhoneCall,
  ReceiptText,
  ShieldAlert,
  Wifi,
  WifiOff,
} from "lucide-react";
import { emergencySupportRoutes } from "@/data/emergency-support-routes";
import { offlineKitItems } from "@/data/offline-safety-kit";
import type { OfflineKitCategory } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { usePwaStatus } from "@/hooks/use-pwa-status";

const categoryIcons: Record<OfflineKitCategory, typeof ShieldAlert> = {
  emergency: ShieldAlert,
  language: Languages,
  route: MapPinned,
  refund: ReceiptText,
  care: HeartPulse,
  stay: FileText,
};

const categoryClasses: Record<OfflineKitCategory, string> = {
  emergency: "border-rose-100 bg-rose-50 text-rose-700",
  language: "border-violet-100 bg-violet-50 text-violet-700",
  route: "border-sky-100 bg-sky-50 text-sky-700",
  refund: "border-amber-100 bg-amber-50 text-amber-700",
  care: "border-emerald-100 bg-emerald-50 text-emerald-700",
  stay: "border-indigo-100 bg-indigo-50 text-indigo-700",
};

function getWidthClass(value: number) {
  if (value >= 90) return "w-11/12";
  if (value >= 80) return "w-4/5";
  if (value >= 70) return "w-3/4";
  if (value >= 60) return "w-3/5";
  if (value >= 50) return "w-1/2";
  if (value >= 35) return "w-1/3";
  return "w-1/5";
}

export function OfflineKitCommandCenter() {
  const user = useAppStore((state) => state.user);
  const savedPassPlans = useAppStore((state) => state.savedPassPlans);
  const receiptRecords = useAppStore((state) => state.receiptRecords);
  const stayDocuments = useAppStore((state) => state.stayDocuments);
  const visitPrepNotes = useAppStore((state) => state.visitPrepNotes);
  const savedCareProviderIds = useAppStore((state) => state.savedCareProviderIds);
  const departureDate = useAppStore((state) => state.departureDate);
  const showSnackbar = useAppStore((state) => state.showSnackbar);
  const { lt } = useLocalizedText();
  const { online, offlineReady } = usePwaStatus();

  const stats = useMemo(() => {
    const savedPhraseCount = user.savedPhraseIds.length;
    const routeCount = savedPassPlans.length;
    const receiptFocusCount = receiptRecords.filter((record) => record.refundStatus === "pending" || record.refundStatus === "needs-check").length;
    const careReady = visitPrepNotes.length > 0 || savedCareProviderIds.length > 0;
    const stayReady = stayDocuments.length > 0;
    const signals = [offlineReady, savedPhraseCount >= 3, routeCount > 0, receiptFocusCount > 0 || Boolean(departureDate), careReady, stayReady].filter(Boolean).length;

    return {
      savedPhraseCount,
      routeCount,
      receiptFocusCount,
      careReady,
      stayReady,
      readinessScore: Math.min(100, 22 + signals * 13),
      preparedCount: signals,
    };
  }, [departureDate, offlineReady, receiptRecords, savedCareProviderIds.length, savedPassPlans.length, stayDocuments.length, user.savedPhraseIds.length, visitPrepNotes.length]);

  const recommendedItems = useMemo(
    () =>
      [...offlineKitItems]
        .sort((a, b) => {
          const aMode = a.recommendedModes.includes(user.mode) ? -10 : 0;
          const bMode = b.recommendedModes.includes(user.mode) ? -10 : 0;
          return a.priority + aMode - (b.priority + bMode);
        })
        .slice(0, 5),
    [user.mode]
  );

  const handleCopy = async (text: string) => {
    await window.navigator.clipboard.writeText(text);
    showSnackbar(lt("Copied to clipboard"), "success");
  };

  const NetworkIcon = online ? Wifi : WifiOff;

  return (
    <section className="px-4 py-4">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-4 text-white shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-sky-100 ring-1 ring-white/15">
              <NetworkIcon size={13} />
              {online ? lt("Online now") : lt("Offline mode detected")}
            </div>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-emerald-100 ring-1 ring-white/15">
              <BadgeCheck size={13} />
              {lt(offlineReady ? "Core kit cached" : "Preparing offline kit")}
            </div>
            <h2 className="mt-3 text-xl font-black tracking-tight">{lt("Offline safety kit")}</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-200">
              {lt("Prepare the cards you need when airport Wi-Fi, maps, translation, or search are unreliable.")}
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 text-sky-100 ring-1 ring-white/15">
            <ShieldAlert size={22} />
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-white p-3 text-gray-900 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">{lt("Offline readiness")}</p>
              <p className="mt-1 text-3xl font-black text-gray-900">{stats.readinessScore}</p>
            </div>
            <div className="rounded-2xl bg-sky-50 px-3 py-2 text-right">
              <p className="text-[10px] font-bold uppercase tracking-wide text-sky-600">{lt("Prepared signals")}</p>
              <p className="mt-1 text-sm font-black text-sky-900">{stats.preparedCount}/6</p>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
            <div className={cn("h-full rounded-full bg-sky-600", getWidthClass(stats.readinessScore))} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-gray-50 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{lt("Phrases")}</p>
              <p className="mt-1 text-sm font-black text-gray-900">{stats.savedPhraseCount}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{lt("Routes")}</p>
              <p className="mt-1 text-sm font-black text-gray-900">{stats.routeCount}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{lt("Needs check")}</p>
              <p className="mt-1 text-sm font-black text-gray-900">{stats.receiptFocusCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {emergencySupportRoutes.slice(0, 4).map((route) => (
            <div key={route.id} className="rounded-3xl bg-white/10 p-3 ring-1 ring-white/15">
              <p className="text-[11px] font-bold text-slate-200">{lt(route.title)}</p>
              <a href={`tel:${route.number}`} className="mt-1 flex items-center gap-2 text-2xl font-black text-white">
                <PhoneCall size={15} />
                {route.number}
              </a>
              <button
                type="button"
                onClick={() => void handleCopy(route.koreanScript)}
                className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-sky-100 ring-1 ring-white/10"
              >
                <Copy size={11} />
                {lt("Copy Korean script")}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {recommendedItems.map((item) => {
          const Icon = categoryIcons[item.category];
          return (
            <Link key={item.id} href={item.href} className="block rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className={cn("rounded-2xl border p-2", categoryClasses[item.category])}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900">{lt(item.title)}</p>
                    {item.recommendedModes.includes(user.mode) ? (
                      <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">{lt("Recommended")}</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(item.description)}</p>
                  <p className="mt-2 rounded-2xl bg-gray-50 px-3 py-2 text-[11px] leading-relaxed text-gray-600">
                    <BadgeCheck size={13} className="mr-1 inline text-emerald-600" />
                    {lt(item.offlineValue)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.checklist.slice(0, 3).map((check) => (
                      <span key={check} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600">
                        <CheckCircle2 size={11} />
                        {lt(check)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
