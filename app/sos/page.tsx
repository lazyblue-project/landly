"use client";

import { PageSkeleton } from "@/components/common/page-skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { TrustLayerPanel } from "@/components/common/trust-layer-panel";
import { TopBar } from "@/components/layout/top-bar";
import { SosHero } from "@/components/sos/sos-hero";
import { SosScenarioList } from "@/components/sos/sos-scenario-list";
import { EmergencyNumberHub } from "@/components/sos/emergency-number-hub";
import { EmergencyScriptPanel } from "@/components/sos/emergency-script-panel";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";

export default function SosPage() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const { lt } = useLocalizedText();

  if (!hasHydrated) {
    return (
      <AppShell>
        <TopBar title={lt("SOS")} />
        <PageSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title={lt("SOS")} />
      <SosHero />
      <div className="px-4 pt-4"><TrustLayerPanel description="Emergency numbers are official routes, but scenario guidance is a Landly-curated checklist. Call local emergency services first when safety is at risk." /></div>
      <EmergencyNumberHub />
      <EmergencyScriptPanel />
      <SosScenarioList />
    </AppShell>
  );
}
