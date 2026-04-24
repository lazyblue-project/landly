"use client";

import type { ComponentType } from "react";
import { launcherItems } from "@/data/pass-data";
import { QuickLauncher } from "@/types";
import { ArrowUpRight, Car, CircleHelp, CreditCard, MapPin, Train } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

const iconMap: Record<QuickLauncher["type"], ComponentType<{ size?: number; className?: string }>> = {
  taxi: Car,
  rail: Train,
  map: MapPin,
  help: CircleHelp,
  transit: CreditCard,
};

interface PassLauncherGridProps {
  onOpenRoutePlanner?: () => void;
}

export function PassLauncherGrid({ onOpenRoutePlanner }: PassLauncherGridProps) {
  const { lt } = useLocalizedText();
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-gray-900">{lt("Quick launch")}</p>
        <p className="mt-1 text-xs text-gray-500">{lt("Open the right service fast, or save your own route into Calendar.")}</p>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {launcherItems.map((item) => {
          const Icon = iconMap[item.type];
          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex rounded-xl bg-white p-2 text-sky-600 shadow-sm"><Icon size={18} /></div>
                  <p className="mt-3 text-sm font-semibold text-gray-900">{lt(item.title)}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">{lt(item.description)}</p>
                </div>
                <ArrowUpRight size={16} className="text-gray-400" />
              </div>
            </>
          );

          if (item.type === "map") {
            return <button key={item.id} type="button" onClick={onOpenRoutePlanner} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100">{content}</button>;
          }

          return <a key={item.id} href={item.href} target="_blank" rel="noreferrer" className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100">{content}</a>;
        })}
      </div>
    </section>
  );
}
