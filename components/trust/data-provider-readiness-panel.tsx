"use client";

import { DatabaseZap, KeyRound, MapPinned, ShieldAlert } from "lucide-react";
import { dataProviderPilots, DataProviderPilotStatus } from "@/data/data-provider-pilot";
import { useLocalizedText } from "@/lib/text-localizer";

const statusStyle: Record<DataProviderPilotStatus, string> = {
  "ready-shell": "bg-emerald-50 text-emerald-700 ring-emerald-100",
  "needs-key": "bg-amber-50 text-amber-700 ring-amber-100",
  future: "bg-gray-50 text-gray-700 ring-gray-100",
  disabled: "bg-rose-50 text-rose-700 ring-rose-100",
};

const statusLabel: Record<DataProviderPilotStatus, string> = {
  "ready-shell": "Ready shell",
  "needs-key": "Needs API key",
  future: "Future",
  disabled: "Disabled",
};

export function DataProviderReadinessPanel() {
  const { lt } = useLocalizedText();
  const sorted = [...dataProviderPilots].sort((a, b) => a.priority - b.priority);

  return (
    <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-sky-50 p-2 text-sky-700">
          <DatabaseZap size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">{lt("Data provider pilot")}</p>
          <h2 className="mt-1 text-lg font-semibold text-gray-950">{lt("API-ready without overpromising live data")}</h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            {lt("v49 keeps safe map handoff and API route shells, then adds health checks and release-readiness guardrails before live API calls are enabled.")}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {sorted.map((provider) => (
          <div key={provider.id} className="rounded-2xl bg-gray-50 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-gray-950">{lt(provider.name)}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${statusStyle[provider.status]}`}>
                    {lt(statusLabel[provider.status])}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(provider.currentFallback)}</p>
              </div>
              <MapPinned size={16} className="shrink-0 text-sky-600" />
            </div>

            <div className="mt-3 grid gap-2 text-xs text-gray-600">
              <div className="rounded-xl bg-white p-2">
                <p className="font-semibold text-gray-800">{lt("Next step")}</p>
                <p className="mt-1 leading-relaxed">{lt(provider.nextStep)}</p>
              </div>
              <div className="rounded-xl bg-white p-2">
                <div className="flex items-start gap-2">
                  <ShieldAlert size={13} className="mt-0.5 shrink-0 text-amber-600" />
                  <p className="leading-relaxed">{lt(provider.riskNote)}</p>
                </div>
              </div>
              {provider.envKeys.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {provider.envKeys.map((key) => (
                    <span key={key} className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 font-mono text-[10px] text-gray-700 ring-1 ring-gray-100">
                      <KeyRound size={10} /> {key}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
