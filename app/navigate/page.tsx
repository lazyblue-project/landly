"use client";

import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { NavigationHandoffCenter } from "@/components/navigation/navigation-handoff-center";
import { FeedbackPrompt } from "@/components/common/feedback-prompt";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

export default function NavigatePage() {
  const { hasHydrated } = useAppStore();
  const { lt } = useLocalizedText();

  if (!hasHydrated) {
    return (
      <AppShell>
        <TopBar title={lt("Map handoff")} showBack />
        <PageSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title={lt("Map handoff")} showBack />
      <div className="space-y-4 px-4 py-4">
        <NavigationHandoffCenter />
        <FeedbackPrompt context="Map handoff" compact />
      </div>
    </AppShell>
  );
}
