"use client";

import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { FeedbackPrompt } from "@/components/common/feedback-prompt";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { ProfileSummary } from "@/components/profile/profile-summary";
import { MyRetentionSnapshot } from "@/components/profile/my-retention-snapshot";
import { PersonalizationInsightsPanel } from "@/components/profile/personalization-insights-panel";
import { OfflinePrepChecklist } from "@/components/offline/offline-prep-checklist";
import { SavedItemsHub } from "@/components/profile/saved-items-hub";
import { ReminderCenter } from "@/components/profile/reminder-center";
import { SavedPassPlans } from "@/components/pass/pass-saved-plans";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

export default function MyPage() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const { lt } = useLocalizedText();

  return (
    <AppShell>
      <TopBar title={lt("My")} />
      {hasHydrated ? (
        <>
          <ProfileSummary />
          <MyRetentionSnapshot />
          <PersonalizationInsightsPanel />
          <OfflinePrepChecklist />
          <SavedItemsHub />
          <ReminderCenter />
          <SavedPassPlans compact />
          <FeedbackPrompt context="My" compact />
        </>
      ) : (
        <PageSkeleton />
      )}
    </AppShell>
  );
}
