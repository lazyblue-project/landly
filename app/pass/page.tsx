"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { PassHero } from "@/components/pass/pass-hero";
import { PassArrivalForm } from "@/components/pass/pass-arrival-form";
import { PassRecommendationCards } from "@/components/pass/pass-recommendation-cards";
import { PassLauncherGrid } from "@/components/pass/pass-launcher-grid";
import { PassPhrasePack } from "@/components/pass/pass-phrase-pack";
import { SavedPassPlans } from "@/components/pass/pass-saved-plans";
import { PassRoutePlannerSheet } from "@/components/pass/pass-route-planner-sheet";
import { MapAppPickerSheet } from "@/components/pass/map-app-picker-sheet";
import { Snackbar } from "@/components/common/snackbar";
import { Arrival72hFlow } from "@/components/pass/arrival-72h-flow";
import { CompanionPlanner } from "@/components/pass/companion-planner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildCalendarEventFromPassPlan, buildDefaultArrivalInput, buildGoogleMapsDirectionsUrl, buildManualRouteCalendarEvent, buildNaverMapUrl, buildPassPlan, buildTransitMapLinks } from "@/lib/pass-utils";
import { TransitOption, TransitType } from "@/types";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

const allowedTabs = new Set(["overview", "arrival", "first72", "companions", "launchers", "phrases", "saved"]);

export default function PassPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const initialTab = searchParams.get("tab") ?? "overview";
  const { user, savePassPlan, addCalendarEvent, hasHydrated } = useAppStore();
  const { lt } = useLocalizedText();

  const [input, setInput] = useState(() => buildDefaultArrivalInput({ city: user.city, stayDuration: user.stayDuration, visitPurpose: user.visitPurpose }));
  const activeTab = allowedTabs.has(initialTab) ? initialTab : "overview";
  const [tabValue, setTabValue] = useState(activeTab);
  const [selectedTransitOptionId, setSelectedTransitOptionId] = useState<string | undefined>(undefined);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [mapPicker, setMapPicker] = useState<{ title: string; googleMapsUrl?: string; naverMapUrl?: string } | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    setInput(buildDefaultArrivalInput({ city: user.city, stayDuration: user.stayDuration, visitPurpose: user.visitPurpose }));
  }, [hasHydrated, user.city, user.stayDuration, user.visitPurpose]);

  useEffect(() => {
    setTabValue(activeTab);
  }, [activeTab]);

  const updateTabQuery = (nextTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleTabChange = (nextTab: string) => {
    setTabValue(nextTab);
    updateTabQuery(nextTab);
  };

  const plan = useMemo(() => buildPassPlan(input, selectedTransitOptionId), [input, selectedTransitOptionId]);

  useEffect(() => {
    if (plan.transitOptions.length === 0) return;
    setSelectedTransitOptionId((current) => current && plan.transitOptions.some((option) => option.id === current) ? current : plan.transitOptions[0]?.id);
  }, [plan.transitOptions]);

  useEffect(() => {
    if (!snackbarMessage) return;
    const timer = window.setTimeout(() => setSnackbarMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [snackbarMessage]);

  const openRoutePicker = (option: TransitOption) => {
    const links = buildTransitMapLinks(input, option);
    setMapPicker({ title: `${lt(option.title)} · ${input.destinationArea}`, googleMapsUrl: links.googleMapsUrl, naverMapUrl: links.naverMapUrl });
  };

  const handleSavePlan = () => {
    const nextPlan = buildPassPlan(input, selectedTransitOptionId);
    savePassPlan(nextPlan);
    addCalendarEvent(buildCalendarEventFromPassPlan(nextPlan));
    setSnackbarMessage("Saved to Pass and Calendar.");
  };

  const handlePlannerChooseMap = (value: { date: string; origin: string; destination: string; transportType: TransitType }) => {
    setMapPicker({ title: `${value.origin} → ${value.destination}`, googleMapsUrl: buildGoogleMapsDirectionsUrl({ origin: value.origin, destination: value.destination, transportType: value.transportType }), naverMapUrl: buildNaverMapUrl({ origin: value.origin, destination: value.destination, transportType: value.transportType }) });
  };

  const handlePlannerSave = (value: { date: string; origin: string; destination: string; transportType: TransitType }) => {
    addCalendarEvent(buildManualRouteCalendarEvent({ date: value.date, origin: value.origin, destination: value.destination, transportType: value.transportType }));
    setPlannerOpen(false);
    setSnackbarMessage("Route saved to Calendar.");
    router.replace("/calendar");
  };

  if (!hasHydrated) {
    return (
      <AppShell>
        <TopBar title={lt("Landly Pass")} />
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">{lt("Loading Landly Pass…")}</p>
            <p className="mt-1 text-xs text-gray-500">{lt("Restoring your saved arrival setup.")}</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title={lt("Landly Pass")} />
      <PassHero />
      <Snackbar message={snackbarMessage} />
      <div className="px-4 py-4">
        <Tabs value={tabValue} onValueChange={handleTabChange} className="gap-4">
          <TabsList variant="line" className="w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap rounded-none px-1">
            <TabsTrigger value="overview">{lt("Overview")}</TabsTrigger>
            <TabsTrigger value="arrival">{lt("Arrival plan")}</TabsTrigger>
            <TabsTrigger value="first72">{lt("First 72h")}</TabsTrigger>
            <TabsTrigger value="companions">{lt("Companions")}</TabsTrigger>
            <TabsTrigger value="launchers">{lt("Launchers")}</TabsTrigger>
            <TabsTrigger value="phrases">{lt("Phrases")}</TabsTrigger>
            <TabsTrigger value="saved">{lt("Saved")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <PassRecommendationCards transitOptions={plan.transitOptions} recommendedPass={plan.recommendedPass} selectedTransitOptionId={selectedTransitOptionId} onSelectTransit={setSelectedTransitOptionId} onSave={handleSavePlan} onOpenRoute={openRoutePicker} />
            <PassLauncherGrid onOpenRoutePlanner={() => setPlannerOpen(true)} />
          </TabsContent>
          <TabsContent value="arrival" className="space-y-4">
            <PassArrivalForm value={input} onChange={(patch) => setInput((prev) => ({ ...prev, ...patch }))} />
            <PassRecommendationCards transitOptions={plan.transitOptions} recommendedPass={plan.recommendedPass} selectedTransitOptionId={selectedTransitOptionId} onSelectTransit={setSelectedTransitOptionId} onSave={handleSavePlan} onOpenRoute={openRoutePicker} />
          </TabsContent>
          <TabsContent value="first72" className="space-y-4"><Arrival72hFlow input={input} /></TabsContent>
          <TabsContent value="companions" className="space-y-4"><CompanionPlanner onApplyGroupSize={(size) => setInput((prev) => ({ ...prev, groupSize: Math.max(1, size) }))} /></TabsContent>
          <TabsContent value="launchers" className="space-y-4"><PassLauncherGrid onOpenRoutePlanner={() => setPlannerOpen(true)} /></TabsContent>
          <TabsContent value="phrases" className="space-y-4"><PassPhrasePack /></TabsContent>
          <TabsContent value="saved" className="space-y-4"><SavedPassPlans /></TabsContent>
        </Tabs>
      </div>

      <PassRoutePlannerSheet open={plannerOpen} onClose={() => setPlannerOpen(false)} onChooseMap={handlePlannerChooseMap} onSave={handlePlannerSave} />
      <MapAppPickerSheet open={!!mapPicker} onClose={() => setMapPicker(null)} title={mapPicker?.title} googleMapsUrl={mapPicker?.googleMapsUrl} naverMapUrl={mapPicker?.naverMapUrl} />
    </AppShell>
  );
}
