"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CareHero } from "@/components/care/care-hero";
import { CareQuickActions } from "@/components/care/care-quick-actions";
import { SymptomTriage } from "@/components/care/symptom-triage";
import { TriageResultCard } from "@/components/care/triage-result-card";
import { CareDiscovery } from "@/components/care/care-discovery";
import { VisitPrep } from "@/components/care/visit-prep";
import { HelpLauncher } from "@/components/care/help-launcher";
import { getCareTriageResult } from "@/hooks/use-care-triage";
import { CareProviderCategory, CareTriageInput } from "@/types";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

const allowedTabs = new Set(["overview", "triage", "providers", "prep", "help"]);
const providerCategories = new Set<CareProviderCategory | "all">(["all", "pharmacy", "clinic", "hospital", "dermatology", "dentist", "health-checkup", "wellness", "mental-health-support"]);
const defaultInput: CareTriageInput = { symptomCategory: "fever-cold", severityLevel: "mild", isBreathingIssue: false, isHeavyBleeding: false, hasChestPain: false, isNightTime: false, userType: "traveler" };

export default function CarePage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const tab = searchParams.get("tab") ?? "overview";
  const activeTab = allowedTabs.has(tab) ? tab : "overview";
  const categoryParam = (searchParams.get("category") ?? "all") as CareProviderCategory | "all";
  const initialProviderCategory = providerCategories.has(categoryParam) ? categoryParam : "all";
  const [tabValue, setTabValue] = useState(activeTab);
  const [input, setInput] = useState<CareTriageInput>(defaultInput);
  const result = useMemo(() => getCareTriageResult(input), [input]);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const { lt } = useLocalizedText();

  useEffect(() => { setTabValue(activeTab); }, [activeTab]);
  const updateTabQuery = (nextTab: string) => { const params = new URLSearchParams(searchParams.toString()); params.set("tab", nextTab); const query = params.toString(); router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }); };
  const handleTabChange = (nextTab: string) => { setTabValue(nextTab); updateTabQuery(nextTab); };

  if (!hasHydrated) return <AppShell><TopBar title={lt("Landly Care")} /><PageSkeleton /></AppShell>;

  return (
    <AppShell>
      <TopBar title={lt("Landly Care")} />
      <CareHero />
      <div className="px-4 py-4">
        <Tabs value={tabValue} onValueChange={handleTabChange} className="gap-4">
          <TabsList variant="line" className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap rounded-none px-1">
            <TabsTrigger value="overview">{lt("Overview")}</TabsTrigger>
            <TabsTrigger value="triage">{lt("Triage")}</TabsTrigger>
            <TabsTrigger value="providers">{lt("Providers")}</TabsTrigger>
            <TabsTrigger value="prep">{lt("Visit prep")}</TabsTrigger>
            <TabsTrigger value="help">{lt("Help")}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4"><CareQuickActions /><div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm leading-relaxed text-gray-600 shadow-sm"><p className="font-semibold text-gray-900">{lt("How Landly Care helps")}</p><p className="mt-2">{lt("Use Landly Care to separate urgent situations from everyday clinic needs, find foreigner-friendly providers, prepare the phrases you may need, and keep your visit summary together.")}</p><p className="mt-2 text-xs text-gray-500">{lt("This service is a guide and organizer, not a diagnosis tool or medical advice replacement.")}</p></div></TabsContent>
          <TabsContent value="triage" className="space-y-4"><SymptomTriage value={input} onChange={(patch) => setInput((prev) => ({ ...prev, ...patch }))} /><TriageResultCard result={result} /></TabsContent>
          <TabsContent value="providers" className="space-y-4"><CareDiscovery initialCategory={initialProviderCategory} /></TabsContent>
          <TabsContent value="prep" className="space-y-4"><VisitPrep /></TabsContent>
          <TabsContent value="help" className="space-y-4"><HelpLauncher /></TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
