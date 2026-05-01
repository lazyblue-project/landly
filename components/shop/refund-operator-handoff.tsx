"use client";

import { ArrowUpRight, Languages, MapPin, Plane, ReceiptText } from "lucide-react";
import { SourceDisclosure } from "@/components/common/source-disclosure";
import { getRefundOperatorsForAmount, refundOperators } from "@/data/refund-operators";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";
import type { RefundOperator } from "@/types";

interface RefundOperatorHandoffProps {
  purchaseAmount?: number;
  compact?: boolean;
  className?: string;
}

function formatWon(amount: number) {
  return `₩${amount.toLocaleString()}`;
}

function getVisibleOperators(purchaseAmount?: number) {
  if (!purchaseAmount) return refundOperators;
  const matched = getRefundOperatorsForAmount(purchaseAmount);
  return matched.length > 0 ? matched : refundOperators;
}

function OperatorCard({ operator, compact = false }: { operator: RefundOperator; compact?: boolean }) {
  const { lt } = useLocalizedText();
  const primaryCounter = operator.airportCounters[0];
  const languageLabel = operator.supportedLanguages.map((language) => language.toUpperCase()).join(" · ");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{lt(operator.name)}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(operator.summary)}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700">
          <ReceiptText size={17} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-gray-50 px-3 py-2">
          <p className="text-[11px] text-gray-500">{lt("Minimum receipt")}</p>
          <p className="mt-0.5 text-sm font-semibold text-gray-900">{formatWon(operator.minAmount)}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 px-3 py-2">
          <p className="text-[11px] text-gray-500">{lt("Best for")}</p>
          <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-relaxed text-gray-900">{lt(operator.bestFor)}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
          <Languages size={12} /> {languageLabel}
        </span>
        {operator.channels.slice(0, compact ? 3 : operator.channels.length).map((channel) => (
          <span key={channel} className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
            {lt(channel)}
          </span>
        ))}
      </div>

      {primaryCounter ? (
        <div className="mt-3 rounded-2xl bg-amber-50 p-3">
          <div className="flex items-start gap-2">
            <MapPin size={15} className="mt-0.5 shrink-0 text-amber-700" />
            <div className="min-w-0 text-xs leading-relaxed text-amber-800">
              <p className="font-semibold text-amber-900">{lt("Airport fallback")}</p>
              <p className="mt-0.5">
                {lt(primaryCounter.airport)} · {lt(primaryCounter.terminal)} · {primaryCounter.floor} · {lt(primaryCounter.location)}
              </p>
              <p className="mt-0.5 opacity-80">{lt(primaryCounter.operatingHours)}</p>
            </div>
          </div>
        </div>
      ) : null}

      {!compact ? (
        <div className="mt-3 space-y-1.5">
          {operator.checklist.slice(0, 3).map((item) => (
            <p key={item} className="text-xs leading-relaxed text-gray-600">• {lt(item)}</p>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={operator.webUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition-transform active:scale-[0.97]"
        >
          {lt("Open official operator")}
          <ArrowUpRight size={14} />
        </a>
        <SourceDisclosure metadata={operator} compact />
      </div>
    </div>
  );
}

export function RefundOperatorHandoff({ purchaseAmount, compact = false, className }: RefundOperatorHandoffProps) {
  const { lt } = useLocalizedText();
  const visibleOperators = getVisibleOperators(purchaseAmount).slice(0, compact ? 2 : 4);
  const belowMinimum = typeof purchaseAmount === "number" && purchaseAmount > 0 && purchaseAmount < 15000;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-white p-2 text-emerald-700 shadow-sm">
            <Plane size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">{lt("Choose your refund handoff")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">
              {belowMinimum
                ? lt("This receipt is below the common minimum. Use the guide to confirm whether the store can combine receipts or offer a different process.")
                : lt("Match the logo on your receipt, then choose a mobile, web, kiosk, or airport counter route before departure.")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {visibleOperators.map((operator) => (
          <OperatorCard key={operator.id} operator={operator} compact={compact} />
        ))}
      </div>
    </div>
  );
}
