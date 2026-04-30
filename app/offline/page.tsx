"use client";

import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { OfflineKitCommandCenter } from "@/components/offline/offline-kit-command-center";
import { OfflinePrepChecklist } from "@/components/offline/offline-prep-checklist";
import { OfflinePwaStatusCard } from "@/components/offline/offline-pwa-status-card";
import { FeedbackPrompt } from "@/components/common/feedback-prompt";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";

export default function OfflinePage() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const { lt } = useLocalizedText();

  return (
    <AppShell>
      <TopBar title={lt("Offline kit")} showBack />
      {hasHydrated ? (
        <>
          <OfflineKitCommandCenter />
          <OfflinePwaStatusCard />
          <OfflinePrepChecklist />
          <FeedbackPrompt context="Offline kit" compact />
        </>
      ) : (
        <PageSkeleton />
      )}
    </AppShell>
  );
}
