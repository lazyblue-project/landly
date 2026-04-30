"use client";

import { CheckCircle2, DownloadCloud, Router, ShieldCheck, Wifi, WifiOff } from "lucide-react";
import { usePwaStatus } from "@/hooks/use-pwa-status";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";

const coreItems = [
  "Home dashboard",
  "Emergency help",
  "Offline kit",
  "Phrase assistant",
  "Map handoff",
] as const;

export function OfflinePwaStatusCard() {
  const { online, serviceWorkerSupported, serviceWorkerReady, offlineReady } = usePwaStatus();
  const { lt } = useLocalizedText();
  const NetworkIcon = online ? Wifi : WifiOff;

  const statusRows = [
    {
      label: "Network",
      value: online ? "Online now" : "Offline mode detected",
      ready: online,
    },
    {
      label: "Service worker",
      value: serviceWorkerSupported ? (serviceWorkerReady ? "Active" : "Preparing") : "Not supported",
      ready: serviceWorkerSupported && serviceWorkerReady,
    },
    {
      label: "Core cache",
      value: offlineReady ? "Ready for offline launch" : "Preparing core kit",
      ready: offlineReady,
    },
  ];

  return (
    <section className="px-4 pb-2">
      <div className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold text-sky-700">
              <NetworkIcon size={13} />
              {lt(offlineReady ? "Offline launch ready" : "Offline launch preparing")}
            </div>
            <h2 className="mt-3 text-lg font-black text-gray-900">{lt("PWA offline status")}</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              {lt("Landly saves the core emergency, phrase, map, and offline pages so they can open faster when the connection is unstable.")}
            </p>
          </div>
          <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {statusRows.map((row) => (
            <div key={row.label} className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{lt(row.label)}</p>
              <p className={cn("mt-1 text-xs font-black", row.ready ? "text-emerald-700" : "text-amber-700")}>{lt(row.value)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-3xl bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <DownloadCloud size={15} className="text-slate-600" />
            <p className="text-xs font-black text-slate-900">{lt("Core pages cached")}</p>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {coreItems.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-gray-700">
                <CheckCircle2 size={14} className={offlineReady ? "text-emerald-600" : "text-gray-300"} />
                {lt(item)}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
          <Router size={14} className="mt-0.5 shrink-0" />
          <p>
            {lt("Offline cache helps open prepared pages, but live maps, official websites, payments, calls, and real-time search still require network access.")}
          </p>
        </div>
      </div>
    </section>
  );
}
