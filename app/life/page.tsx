"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { LifeChecklist } from "@/components/life/life-checklist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChecklistCategory, StayPlanInput } from "@/types";
import { useAppStore } from "@/store/app-store";
import { StayHero } from "@/components/stay/stay-hero";
import { StayQuickActions } from "@/components/stay/stay-quick-actions";
import { StayPlanBuilder } from "@/components/stay/stay-plan-builder";
import { StayPlanSummary } from "@/components/stay/stay-plan-summary";
import { StayDocumentVault } from "@/components/stay/stay-document-vault";
import { StayGuideHub } from "@/components/stay/stay-guide-hub";
import { StaySupportLauncher } from "@/components/stay/stay-support-launcher";
import { StayDeadlineCards } from "@/components/stay/stay-deadline-cards";
import { Stay90DayMissions } from "@/components/stay/stay-90-day-missions";
import { getDefaultStayInput, useStayPlan } from "@/hooks/use-stay-plan";
import { useLocalizedText } from "@/lib/text-localizer";

const allowedTabs = new Set(["overview", "first90", "plan", "checklist", "documents", "guides"]);
const allowedCategories = new Set<ChecklistCategory | "all">(["all", "registration", "telecom", "transport", "banking", "healthcare", "housing", "work_school", "tax", "support"]);

export default function LifePage() {
  return (
    <Suspense>
      <LifePageContent />
    </Suspense>
  );
}

function LifePageContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { user, stayPlanInput, saveStayPlanInput, hasHydrated } = useAppStore();
  const { lt } = useLocalizedText();
  const fallbackInput = useMemo(() => getDefaultStayInput(user), [user]);
  const planInput = stayPlanInput ?? fallbackInput;
  const [draft, setDraft] = useState<StayPlanInput>(planInput);

  useEffect(() => { setDraft(planInput); }, [planInput]);
  const tabParam = searchParams.get("tab");
  const categoryParam = (searchParams.get("category") ?? "all") as ChecklistCategory | "all";
  const activeTab = tabParam && allowedTabs.has(tabParam) ? tabParam : searchParams.get("category") ? "checklist" : "overview";
  const activeCategory = allowedCategories.has(categoryParam) ? categoryParam : "all";
  const [tabValue, setTabValue] = useState(activeTab);

  useEffect(() => { setTabValue(activeTab); }, [activeTab]);
  const replaceQuery = (nextTab: string, nextCategory?: ChecklistCategory | "all") => { const params = new URLSearchParams(searchParams.toString()); params.set("tab", nextTab); if (nextCategory && nextCategory !== "all") params.set("category", nextCategory); else params.delete("category"); const query = params.toString(); router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }); };
  const handleTabChange = (nextTab: string) => { setTabValue(nextTab); replaceQuery(nextTab, nextTab === "checklist" ? activeCategory : undefined); };
  const handleChecklistCategoryChange = (nextCategory: ChecklistCategory | "all") => { if (tabValue !== "checklist") setTabValue("checklist"); replaceQuery("checklist", nextCategory); };

  const { immediateTasks, thisMonthTasks, resources, summary } = useStayPlan(draft);
  const stayTypeLabel = summary.stayType.replace("-", " ");

  if (!hasHydrated) {
    return <AppShell><TopBar title={lt("Landly Stay")} /><div className="flex min-h-[60vh] items-center justify-center px-4"><div className="text-center"><p className="text-sm font-medium text-gray-700">{lt("Loading Landly Stay…")}</p><p className="mt-1 text-xs text-gray-500">{lt("Restoring your saved settlement plan and documents.")}</p></div></div></AppShell>;
  }

  return (
    <AppShell>
      <TopBar title={lt("Landly Stay")} />
      <StayHero stayTypeLabel={stayTypeLabel} city={user.city} />
      <div className="px-4 py-4">
        <Tabs value={tabValue} onValueChange={handleTabChange} className="gap-4">
          <TabsList variant="line" className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap rounded-none px-1">
            <TabsTrigger value="overview">{lt("Overview")}</TabsTrigger>
            <TabsTrigger value="first90">{lt("First 90d")}</TabsTrigger>
            <TabsTrigger value="plan">{lt("Plan")}</TabsTrigger>
            <TabsTrigger value="checklist">{lt("Checklist")}</TabsTrigger>
            <TabsTrigger value="documents">{lt("Documents")}</TabsTrigger>
            <TabsTrigger value="guides">{lt("Guides")}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4"><StayQuickActions /><StayDeadlineCards reminders={summary.reminders} /><div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm leading-relaxed text-gray-600 shadow-sm"><p className="font-semibold text-gray-900">{lt("How Landly Stay helps")}</p><p className="mt-2">{lt("Landly Stay turns official immigration, insurance, housing, labor, and student resources into a clearer setup flow. Use it to decide what to do now, what to save, and where to go for official support.")}</p></div></TabsContent>
          <TabsContent value="first90" className="space-y-4"><Stay90DayMissions stayType={draft.stayType} /></TabsContent>
          <TabsContent value="plan" className="space-y-4"><StayPlanBuilder value={draft} onChange={(patch) => { const next = { ...draft, ...patch }; setDraft(next); saveStayPlanInput(next); }} /><StayPlanSummary immediateTasks={immediateTasks} thisMonthTasks={thisMonthTasks} resources={resources} reminders={summary.reminders} /></TabsContent>
          <TabsContent value="checklist" className="space-y-4"><LifeChecklist category={activeCategory} onCategoryChange={handleChecklistCategoryChange} /></TabsContent>
          <TabsContent value="documents" className="space-y-4"><StayDocumentVault /></TabsContent>
          <TabsContent value="guides" className="space-y-4"><StayGuideHub /><StaySupportLauncher /></TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
