"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, CircleHelp, ArrowRight, ReceiptText } from "lucide-react";
import type { RefundEligibilityResult } from "@/types";
import { useLocalizedText } from "@/lib/text-localizer";

interface RefundResultCardProps {
  result: RefundEligibilityResult;
}

const statusMap = {
  eligible: {
    label: "Likely eligible",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  "not-eligible": {
    label: "Not eligible",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: AlertTriangle,
  },
  "check-in-store": {
    label: "Check in store",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: CircleHelp,
  },
} as const;

const actionMap = {
  "find-stores": { href: "/shop?tab=stores", label: "Find stores" },
  "save-receipt": { href: "/shop/receipts", label: "Save receipt" },
  "view-guide": { href: "/shop/guide", label: "View guide" },
};

export function RefundResultCard({ result }: RefundResultCardProps) {
  const meta = statusMap[result.status];
  const Icon = meta.icon;
  const { lt } = useLocalizedText();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.className}`}>
          <Icon size={14} />
          {lt(meta.label)}
        </div>
        <div className="rounded-2xl bg-gray-50 px-3 py-2 text-right">
          <p className="text-[11px] text-gray-500">{lt("Estimated refund")}</p>
          <p className="text-sm font-semibold text-gray-900">₩{result.estimatedRefundAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-gray-50 px-3 py-2">
          <p className="text-[11px] text-gray-500">{lt("Refund confidence")}</p>
          <p className="mt-0.5 text-sm font-semibold text-gray-900">{lt(result.confidence)}</p>
        </div>
        <div className="rounded-2xl bg-gray-50 px-3 py-2">
          <p className="text-[11px] text-gray-500">{lt("Next step")}</p>
          <p className="mt-0.5 text-sm font-semibold text-gray-900">{lt(result.status === "eligible" ? "Save receipt" : "Confirm first")}</p>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {result.reasons.map((reason) => (
          <p key={reason} className="text-sm leading-relaxed text-gray-700">
            • {lt(reason)}
          </p>
        ))}
      </div>

      {result.checklist.length > 0 ? (
        <div className="mt-4 rounded-2xl bg-emerald-50 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <ReceiptText size={14} />
            {lt("Before you leave the store")}
          </div>
          <div className="space-y-1.5">
            {result.checklist.map((item) => (
              <p key={item} className="text-xs leading-relaxed text-emerald-800">• {lt(item)}</p>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid gap-2">
        {result.nextActions.map((action) => {
          const item = actionMap[action];
          return (
            <Link key={action} href={item.href} className="inline-flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3 text-sm font-medium text-gray-800">
              {lt(item.label)}
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
