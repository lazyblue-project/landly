"use client";

import { PageSkeleton } from "@/components/common/page-skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { TrustLayerPanel } from "@/components/common/trust-layer-panel";
import { InfoTrustCommandCenter } from "@/components/trust/info-trust-command-center";
import { TrustChecklistBoard } from "@/components/trust/trust-checklist-board";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";

export default function TrustPage() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const { lt } = useLocalizedText();

  if (!hasHydrated) {
    return (
      <AppShell>
        <TopBar title={lt("Trust Center")} showBack />
        <PageSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title={lt("Trust Center")} showBack />
      <div className="space-y-4 px-4 py-4">
        <InfoTrustCommandCenter />
        <TrustLayerPanel
          title="How Landly labels information"
          description="Official sources, curated guidance, partner information, and demo data are separated so users can make safer decisions."
        />
        <TrustChecklistBoard />
      </div>
    </AppShell>
  );
}
