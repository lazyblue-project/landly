"use client";

import { PageSkeleton } from "@/components/common/page-skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { DepartureChecklist } from "@/components/shop/departure-checklist";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

export default function ShopGuidePage() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const { lt } = useLocalizedText();

  if (!hasHydrated) {
    return (
      <AppShell>
        <TopBar title={lt("Refund Guide")} />
        <PageSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title={lt("Refund Guide")} />
      <div className="space-y-4 px-4 py-4">
        <DepartureChecklist />
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">{lt("Immediate vs general refund")}</p>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-600">
            <p>
              <span className="font-medium text-gray-900">{lt("Immediate refund:")}</span> {lt("Some stores can process the refund at checkout when your purchase qualifies and your passport is available.")}
            </p>
            <p>
              <span className="font-medium text-gray-900">{lt("General refund:")}</span> {lt("You may need to keep the receipt and complete refund-related steps later at an airport, kiosk, downtown counter, or other official channel.")}
            </p>
            <p className="text-xs text-gray-500">
              {lt("Always confirm the latest store and airport process on the official channel because participation and procedures can change.")}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
