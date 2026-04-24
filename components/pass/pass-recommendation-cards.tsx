"use client";

import { ArrowUpRight, Check, Clock3, CreditCard, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TrustBadgeRow } from "@/components/common/trust-badge-row";
import { PassOption, TransitOption } from "@/types";
import { getPassTrustBadges, getTransitTrustBadges } from "@/lib/trust-badges";
import { useLocalizedText } from "@/lib/text-localizer";

interface PassRecommendationCardsProps {
  transitOptions: TransitOption[];
  recommendedPass: PassOption | null;
  selectedTransitOptionId?: string;
  onSelectTransit: (optionId: string) => void;
  onSave: () => void;
  onOpenRoute: (option: TransitOption) => void;
}

export function PassRecommendationCards({ transitOptions, recommendedPass, selectedTransitOptionId, onSelectTransit, onSave, onOpenRoute }: PassRecommendationCardsProps) {
  const selectedOption = transitOptions.find((option) => option.id === selectedTransitOptionId) ?? transitOptions[0];
  const { lt } = useLocalizedText();

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Best arrival routes")}</p>
            <p className="mt-1 text-xs text-gray-500">{lt("Choose the route you actually want, then save that exact option.")}</p>
          </div>
          <button onClick={onSave} className="rounded-xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-700">{lt("Save")} {selectedOption ? lt(selectedOption.title) : lt("plan")}</button>
        </div>

        <div className="mt-4 space-y-3">
          {transitOptions.map((option, index) => {
            const isSelected = option.id === selectedTransitOptionId;
            const trustBadges = getTransitTrustBadges(option);
            return (
              <div key={option.id} className={["rounded-2xl border p-4 transition-colors", isSelected ? "border-sky-300 bg-sky-50" : "border-gray-100 bg-gray-50"].join(" ")}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{lt(option.title)}</p>
                      {index === 0 ? <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">{lt("Recommended")}</Badge> : null}
                      {isSelected ? <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{lt("Selected")}</Badge> : null}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt(option.summary)}</p>
                  </div>
                  <button type="button" onClick={() => onSelectTransit(option.id)} className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${isSelected ? "bg-sky-600 text-white" : "bg-white text-gray-700 ring-1 ring-gray-200"}`}>
                    {isSelected ? <Check size={13} /> : null}
                    {isSelected ? lt("Selected") : lt("Choose")}
                  </button>
                </div>

                <TrustBadgeRow badges={trustBadges} compact />

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="rounded-xl bg-white px-3 py-2">{lt("Cost")}: {lt(option.costLevel)}</div>
                  <div className="rounded-xl bg-white px-3 py-2">{lt("Speed")}: {lt(option.timeLevel)}</div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {option.reasons.map((reason) => (
                    <div key={reason} className="flex items-start gap-2 text-xs text-gray-600"><Sparkles size={13} className="mt-0.5 text-sky-600" />{lt(reason)}</div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button type="button" onClick={() => onOpenRoute(option)} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700">
                    {lt(option.ctaLabel)} <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {recommendedPass ? (
        <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">{lt("Best pass for this arrival")}</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{lt(recommendedPass.title)}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt(recommendedPass.summary)}</p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-2 text-sky-600"><CreditCard size={18} /></div>
          </div>
          <TrustBadgeRow badges={getPassTrustBadges(recommendedPass)} compact />
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-900">{lt("Why this fits")}</p>
            <div className="mt-2 space-y-1.5">{recommendedPass.reasons.map((reason) => <p key={reason} className="text-xs leading-relaxed text-gray-600">• {lt(reason)}</p>)}</div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-900">{lt("Things to watch")}</p>
            <div className="mt-2 space-y-1.5">{recommendedPass.cautionNotes.map((note) => <p key={note} className="text-xs leading-relaxed text-gray-600">• {lt(note)}</p>)}</div>
          </div>
          <a href={recommendedPass.ctaTarget} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white">{lt(recommendedPass.ctaLabel)} <ArrowUpRight size={14} /></a>
        </section>
      ) : null}
    </div>
  );
}
