"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Phone, ShieldAlert } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { PhraseCard } from "@/components/common/phrase-card";
import { SosScenario, sosScenarios } from "@/data/sos-scenarios";
import { phrases } from "@/data/phrases";
import { triggerHaptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";

const severityStyle = {
  urgent: "border-red-100 bg-red-50 text-red-700",
  soon: "border-amber-100 bg-amber-50 text-amber-700",
  help: "border-blue-100 bg-blue-50 text-blue-700",
} as const;

export function SosScenarioList() {
  const [selected, setSelected] = useState<SosScenario | null>(null);
  const { lt } = useLocalizedText();
  const selectedPhrases = useMemo(
    () => (selected ? phrases.filter((phrase) => selected.phraseIds.includes(phrase.id)) : []),
    [selected]
  );

  return (
    <section className="space-y-3 px-4 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-red-600">{lt("SOS scenarios")}</p>
        <h2 className="mt-1 text-lg font-bold text-gray-900">{lt("Choose what happened")}</h2>
        <p className="mt-1 text-sm leading-relaxed text-gray-500">
          {lt("Each scenario gives you call buttons, next steps, and Korean phrases to show immediately.")}
        </p>
      </div>

      {sosScenarios.map((scenario) => (
        <button
          key={scenario.id}
          type="button"
          onClick={() => {
            triggerHaptic("medium");
            setSelected(scenario);
          }}
          className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-transform active:scale-[0.99]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                className={cn(
                  "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                  severityStyle[scenario.severity]
                )}
              >
                {lt(scenario.severity)}
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-900">{lt(scenario.title)}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt(scenario.summary)}</p>
            </div>
            <ChevronRight size={18} className="mt-1 shrink-0 text-gray-400" />
          </div>
        </button>
      ))}

      <BottomSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? lt(selected.title) : undefined}
        description={selected ? lt(selected.summary) : undefined}
        className="max-h-[88vh] overflow-y-auto"
      >
        {selected ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-2">
              {selected.actions.map((action) =>
                action.type === "tel" ? (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between rounded-2xl border border-gray-200 px-3 py-3 text-sm font-medium text-gray-800"
                  >
                    {lt(action.label)}
                    <Phone size={16} className="text-amber-600" />
                  </a>
                ) : (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between rounded-2xl border border-gray-200 px-3 py-3 text-sm font-medium text-gray-800"
                    onClick={() => setSelected(null)}
                  >
                    {lt(action.label)}
                    <ShieldAlert size={16} className="text-blue-600" />
                  </Link>
                )
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{lt("What to do now")}</p>
              <ol className="mt-2 space-y-2">
                {selected.steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white">
                      {index + 1}
                    </span>
                    <span>{lt(step)}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{lt("Ready Korean phrases")}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {lt("Tap Show to display a large Korean card to nearby staff.")}
                </p>
              </div>
              {selectedPhrases.map((phrase) => (
                <PhraseCard key={phrase.id} phrase={phrase} />
              ))}
            </div>
          </div>
        ) : null}
      </BottomSheet>
    </section>
  );
}
