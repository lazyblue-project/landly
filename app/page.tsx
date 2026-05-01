"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { HomeHero } from "@/components/home/home-hero";
import { HomeNowPanel } from "@/components/home/home-now-panel";
import { GlobalSearchPanel } from "@/components/home/global-search-panel";
import { HomeReadyPanel } from "@/components/home/home-ready-panel";
import { HomeExplorePanel } from "@/components/home/home-explore-panel";
import { HomePilotPanel } from "@/components/home/home-pilot-panel";
import { FeedbackPrompt } from "@/components/common/feedback-prompt";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { useAppStore } from "@/store/app-store";

export default function HomePage() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const setMode = useAppStore((state) => state.setMode);
  const isBetaTester = useAppStore((state) => state.isBetaTester);

  useEffect(() => {
    if (hasHydrated && !user.onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [hasHydrated, user.onboardingCompleted, router]);

  const handleToggleMode = () => {
    setMode(user.mode === "travel" ? "life" : "travel");
  };

  if (!hasHydrated) {
    return <PageSkeleton />;
  }

  return (
    <AppShell>
      <HomeHero name={user.name} mode={user.mode} city={user.city} onToggleMode={handleToggleMode} />
      <GlobalSearchPanel />
      <HomeNowPanel />
      <HomeReadyPanel />
      {isBetaTester ? <HomePilotPanel /> : null}
      <HomeExplorePanel />
      <FeedbackPrompt context="Home" compact />
    </AppShell>
  );
}
