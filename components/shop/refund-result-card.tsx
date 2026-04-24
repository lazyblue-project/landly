"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, CircleHelp, ArrowRight } from "lucide-react";
import { RefundEligibilityResult } from "@/types";
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
      <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.className}`}>
        <Icon size={14} />
        {lt(meta.label)}
      </div>

      <div className="mt-3 space-y-2">
        {result.reasons.map((reason) => (
          <p key={reason} className="text-sm leading-relaxed text-gray-700">
            • {lt(reason)}
          </p>
        ))}
      </div>

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
