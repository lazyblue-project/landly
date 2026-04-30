"use client";

import Link from "next/link";
import { AlertTriangle, CalendarDays, CheckCircle2, FileCheck2, Plane, ReceiptText, Wallet } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { getReceiptEstimatedRefund, getReceiptReadiness } from "@/lib/shop-utils";
import { useLocalizedText } from "@/lib/text-localizer";

interface RefundWalletDashboardProps {
  compact?: boolean;
}

export function RefundWalletDashboard({ compact = false }: RefundWalletDashboardProps) {
  const { receiptRecords, departureDate } = useAppStore();
  const { lt } = useLocalizedText();
  const readiness = getReceiptReadiness(receiptRecords);
  const activeReceipts = receiptRecords.filter((receipt) => receipt.refundStatus !== "not-eligible");
  const totalPurchaseAmount = activeReceipts.reduce((total, receipt) => total + receipt.amount, 0);
  const totalEstimatedRefund = activeReceipts.reduce((total, receipt) => total + getReceiptEstimatedRefund(receipt), 0);
  const needsCheckCount = activeReceipts.filter((receipt) => receipt.refundStatus === "needs-check").length;

  const nextAction = (() => {
    if (activeReceipts.length === 0) {
      return {
        title: "Add your first receipt",
        description: "Use the mock scan or manual form right after checkout so you do not lose refund details.",
        href: "/shop/receipts",
        icon: ReceiptText,
      };
    }
    if (readiness.needPassportCount > 0) {
      return {
        title: "Confirm passport readiness",
        description: "Some receipts still need passport or counter confirmation before airport day.",
        href: "/shop/receipts",
        icon: FileCheck2,
      };
    }
    if (!departureDate) {
      return {
        title: "Set your departure date",
        description: "Landly can keep the refund checklist visible before you leave Korea.",
        href: "/shop/guide",
        icon: CalendarDays,
      };
    }
    if (readiness.pendingCount > 0) {
      return {
        title: "Review airport refund steps",
        description: "Check pending receipts, unopened items, and the counter or kiosk flow before departure.",
        href: "/shop/guide",
        icon: Plane,
      };
    }
    return {
      title: "Refund wallet looks ready",
      description: "Your active receipts are marked done. Keep them saved until your trip is fully complete.",
      href: "/shop/receipts",
      icon: CheckCircle2,
    };
  })();

  const NextIcon = nextAction.icon;
  const stats = [
    { label: "Total purchases", value: `₩${totalPurchaseAmount.toLocaleString()}` },
    { label: "Estimated refund", value: `₩${totalEstimatedRefund.toLocaleString()}` },
    { label: "Need passport check", value: readiness.needPassportCount.toString() },
    { label: "Needs store check", value: needsCheckCount.toString() },
  ];

  return (
    <section className={compact ? "space-y-3" : "space-y-4"}>
      <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-emerald-50 to-sky-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <Wallet size={13} />
                {lt("Refund Wallet")}
              </div>
              <h2 className="mt-3 text-lg font-bold tracking-tight text-gray-950">{lt("Your tax refund status at a glance")}</h2>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                {lt("Keep receipts, passport readiness, estimated refunds, and airport-day actions together.")}
              </p>
            </div>
            <div className="rounded-2xl bg-white px-3 py-2 text-center shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">{lt("Ready")}</p>
              <p className="text-base font-bold text-emerald-700">{readiness.readinessPercent}%</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/90 px-3 py-2.5 shadow-sm">
                <p className="text-[11px] text-gray-500">{lt(stat.label)}</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-gray-950">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <Link href={nextAction.href} className="flex items-start gap-3 p-4 transition-colors hover:bg-gray-50">
          <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-700">
            <NextIcon size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">{lt(nextAction.title)}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{lt(nextAction.description)}</p>
          </div>
        </Link>
      </div>

      {!compact && readiness.pendingCount > 0 ? (
        <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-amber-800">
          <AlertTriangle size={17} className="mt-0.5 shrink-0" />
          <p className="text-xs leading-relaxed">
            {lt("Pending receipts are only a guide. Final approval depends on store, kiosk, airport, and customs procedures.")}
          </p>
        </div>
      ) : null}
    </section>
  );
}
