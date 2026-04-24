"use client";

import Link from "next/link";
import { ArrowRight, Receipt, Search, ShieldCheck } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

const actions = [
  { href: "/shop?tab=stores", title: "Find tax refund shops", description: "Immediate and general refund-friendly stores in one place.", icon: Search },
  { href: "/shop/checker", title: "Check refund eligibility", description: "See if a purchase likely qualifies before you pay.", icon: ShieldCheck },
  { href: "/shop/receipts", title: "Save shopping receipts", description: "Keep pending and completed refund notes together.", icon: Receipt },
];

export function ShopQuickActions() {
  const { lt } = useLocalizedText();
  return (
    <section className="px-4 pt-4">
      <div className="space-y-3">
        {actions.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600"><Icon size={18} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{lt(title)}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{lt(description)}</p>
            </div>
            <ArrowRight size={16} className="mt-1 text-gray-400" />
          </Link>
        ))}
      </div>
    </section>
  );
}
