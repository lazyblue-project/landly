"use client";

import Link from "next/link";
import { BookOpenText, HeartPulse, Plane, ShieldAlert, ShoppingBag } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

const items = [
  { href: "/pass", label: "Pass", icon: Plane, color: "text-sky-600 bg-sky-50" },
  { href: "/shop", label: "Shop", icon: ShoppingBag, color: "text-emerald-600 bg-emerald-50" },
  { href: "/care", label: "Care", icon: HeartPulse, color: "text-rose-600 bg-rose-50" },
  { href: "/sos", label: "SOS", icon: ShieldAlert, color: "text-orange-600 bg-orange-50" },
  { href: "/stay", label: "Stay", icon: BookOpenText, color: "text-violet-600 bg-violet-50" },
];

export function HomeServiceHub() {
  const { lt } = useLocalizedText();
  return (
    <section className="px-4 pt-4">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-900">{lt("Open a service")}</p>
          <p className="mt-1 text-xs text-gray-500">{lt("Thumb-friendly shortcuts to the main Landly flows.")}</p>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-2 rounded-2xl px-2 py-3 text-center hover:bg-gray-50">
                <div className={`rounded-2xl p-3 ${item.color}`}>
                  <Icon size={18} />
                </div>
                <span className="text-[11px] font-semibold text-gray-700">{lt(item.label)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
