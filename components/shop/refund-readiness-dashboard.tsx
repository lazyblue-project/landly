"use client";

import Link from "next/link";
import { CalendarDays, FileCheck2, Plane, ReceiptText } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { getReceiptReadiness } from "@/lib/shop-utils";
import { useLocalizedText } from "@/lib/text-localizer";

export function RefundReadinessDashboard() {
  const { receiptRecords, departureDate } = useAppStore();
  const readiness = getReceiptReadiness(receiptRecords);
  const { lt } = useLocalizedText();

  const cards = [
    {
      label: "Estimated pending refund",
      value: `₩${readiness.estimatedRefundTotal.toLocaleString()}`,
      detail: "Rough guide only",
      icon: ReceiptText,
    },
    {
      label: "Receipts to check",
      value: readiness.pendingCount.toString(),
      detail: readiness.needPassportCount > 0 ? "Passport reminder needed" : "Passport status looks ready",
      icon: FileCheck2,
    },
    {
      label: "Departure",
      value: departureDate ?? "Not set",
      detail: "Use guide before airport day",
      icon: Plane,
    },
  ];

  return (
    <section className="px-4 pt-4">
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-emerald-950">{lt("Refund readiness")}</p>
            <p className="mt-1 text-xs leading-relaxed text-emerald-800">
              {lt("Track receipts, passport readiness, and departure-day refund steps in one place.")}
            </p>
          </div>
          <div className="rounded-2xl bg-white px-3 py-2 text-xs font-bold text-emerald-700">
            {readiness.readinessPercent}%
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          {cards.map(({ label, value, detail, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl bg-white p-3">
              <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">{lt(label)}</p>
                <p className="truncate text-sm font-semibold text-gray-900">{lt(value)}</p>
              </div>
              <p className="max-w-[104px] text-right text-[11px] leading-snug text-gray-500">{lt(detail)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href="/shop/receipts" className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white">
            <ReceiptText size={14} />
            {lt("Open receipts")}
          </Link>
          <Link href="/shop/guide" className="inline-flex items-center justify-center gap-1 rounded-xl bg-white px-3 py-2.5 text-xs font-semibold text-emerald-700">
            <CalendarDays size={14} />
            {lt("Airport checklist")}
          </Link>
        </div>
      </div>
    </section>
  );
}
