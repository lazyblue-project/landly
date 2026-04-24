"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { HomeHero } from "@/components/home/home-hero";
import { TodayDashboard } from "@/components/home/today-dashboard";
import { HomeServiceHub } from "@/components/home/home-service-hub";
import { RecommendedActions } from "@/components/home/recommended-actions";
import { QuickHelp } from "@/components/home/quick-help";
import { useAppStore } from "@/store/app-store";
import { useRecommendedActions } from "@/hooks/use-recommended-actions";
import { useLocalizedText } from "@/lib/text-localizer";

export default function HomePage() {
  const router = useRouter();
  const { user, hasHydrated, setMode } = useAppStore();
  const actions = useRecommendedActions(user.mode);
  const { lt } = useLocalizedText();

  useEffect(() => {
    if (hasHydrated && !user.onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [hasHydrated, user.onboardingCompleted, router]);

  const handleToggleMode = () => {
    setMode(user.mode === "travel" ? "life" : "travel");
  };

  if (!hasHydrated) {
    return (
      <AppShell hideNav className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">{lt("Loading Landly…")}</p>
          <p className="mt-1 text-xs text-gray-500">{lt("Preparing your saved travel setup.")}</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <HomeHero name={user.name} mode={user.mode} city={user.city} onToggleMode={handleToggleMode} />
      <TodayDashboard />
      <HomeServiceHub />
      <RecommendedActions actions={actions} />
      <QuickHelp />
    </AppShell>
  );
}
