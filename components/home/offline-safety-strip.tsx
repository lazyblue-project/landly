"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, DownloadCloud, ShieldAlert, Wifi, WifiOff } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";
import { usePwaStatus } from "@/hooks/use-pwa-status";

export function OfflineSafetyStrip() {
  const user = useAppStore((state) => state.user);
  const savedPassPlans = useAppStore((state) => state.savedPassPlans);
  const receiptRecords = useAppStore((state) => state.receiptRecords);
  const visitPrepNotes = useAppStore((state) => state.visitPrepNotes);
  const stayDocuments = useAppStore((state) => state.stayDocuments);
  const { lt } = useLocalizedText();
  const { online, offlineReady } = usePwaStatus();

  const preparedCount = useMemo(() => {
    return [
      user.savedPhraseIds.length >= 3,
      savedPassPlans.length > 0,
      receiptRecords.length > 0,
      visitPrepNotes.length > 0,
      stayDocuments.length > 0,
    ].filter(Boolean).length;
  }, [receiptRecords.length, savedPassPlans.length, stayDocuments.length, user.savedPhraseIds.length, visitPrepNotes.length]);

  const NetworkIcon = online ? Wifi : WifiOff;
  const CacheIcon = offlineReady ? CheckCircle2 : DownloadCloud;
  const statusLabel = !online ? "Offline mode detected" : offlineReady ? "Core kit cached" : "Preparing offline kit";

  return (
    <section className="px-4 pt-4">
      <Link href="/offline" className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-900 p-4 text-white shadow-sm transition-colors hover:bg-slate-800">
        <div className="rounded-2xl bg-white/10 p-2 text-sky-100 ring-1 ring-white/15">
          <ShieldAlert size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-sky-100 ring-1 ring-white/10">
              <NetworkIcon size={12} />
              {online ? lt("Online now") : lt("Offline mode detected")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-100 ring-1 ring-white/10">
              <CacheIcon size={12} />
              {lt(statusLabel)}
            </span>
          </div>
          <p className="mt-2 text-sm font-black">{lt("Offline safety kit")}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-300">
            {lt("Emergency numbers, Korean show-cards, routes, receipts, care notes, and documents.")}
          </p>
        </div>
        <div className="shrink-0 rounded-2xl bg-white/10 px-3 py-2 text-right ring-1 ring-white/15">
          <p className="text-[10px] font-bold text-slate-300">{lt("Ready")}</p>
          <p className="text-sm font-black text-white">{preparedCount}/5</p>
        </div>
        <ArrowRight size={16} className="shrink-0 text-slate-300" />
      </Link>
    </section>
  );
}
