"use client";

import { useMemo, useState } from "react";
import { SourceDisclosure } from "@/components/common/source-disclosure";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { RefundCheckerForm } from "@/components/shop/refund-checker-form";
import { RefundResultCard } from "@/components/shop/refund-result-card";
import { officialSources } from "@/data/official-sources";
import { getRefundEligibility } from "@/hooks/use-refund-eligibility";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";
import type { RefundEligibilityInput } from "@/types";

const defaultInput: RefundEligibilityInput = {
  stayLengthCategory: "under-6-months",
  purchaseAmount: 30000,
  itemOpened: false,
  departureWithin3Months: true,
  residentStatus: "tourist",
  itemCategory: "beauty",
};

export default function ShopCheckerPage() {
  const [input, setInput] = useState<RefundEligibilityInput>(defaultInput);
  const result = useMemo(() => getRefundEligibility(input), [input]);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const { lt } = useLocalizedText();
  const refundSource = officialSources.find((source) => source.id === "official_refund");

  if (!hasHydrated) {
    return (
      <AppShell>
        <TopBar title={lt("Refund Checker")} />
        <PageSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title={lt("Refund Checker")} />
      <div className="space-y-4 px-4 py-4">
        {refundSource ? (
          <div className="rounded-3xl border border-amber-100 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">{lt("Official refund source")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt("Landly gives a quick estimate. The official source and store counter decide the actual refund process.")}</p>
            <SourceDisclosure metadata={refundSource.metadata} compact className="mt-3" />
          </div>
        ) : null}
        <RefundCheckerForm value={input} onChange={(patch) => setInput((prev) => ({ ...prev, ...patch }))} />
        <RefundResultCard result={result} purchaseAmount={input.purchaseAmount} />
      </div>
    </AppShell>
  );
}
