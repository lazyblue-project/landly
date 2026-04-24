"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { RefundCheckerForm } from "@/components/shop/refund-checker-form";
import { RefundResultCard } from "@/components/shop/refund-result-card";
import { getRefundEligibility } from "@/hooks/use-refund-eligibility";
import { RefundEligibilityInput } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";

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
  const { lt } = useLocalizedText();

  return (
    <AppShell>
      <TopBar title={lt("Refund Checker")} />
      <div className="px-4 py-4 space-y-4">
        <RefundCheckerForm value={input} onChange={(patch) => setInput((prev) => ({ ...prev, ...patch }))} />
        <RefundResultCard result={result} />
      </div>
    </AppShell>
  );
}
