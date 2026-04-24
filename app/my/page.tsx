"use client";

import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { ProfileSummary } from "@/components/profile/profile-summary";
import { SavedPassPlans } from "@/components/pass/pass-saved-plans";
import { SavedPlacesSection } from "@/components/profile/saved-places-section";
import { SavedPhrasesSection } from "@/components/profile/saved-phrases-section";
import { SavedStayResourcesSection } from "@/components/profile/saved-stay-resources-section";
import { ReminderCenter } from "@/components/profile/reminder-center";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

export default function MyPage() {
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const { lt } = useLocalizedText();
  return (
    <AppShell>
      <TopBar title={lt("My")} />
      {hasHydrated ? <><ProfileSummary /><ReminderCenter /><SavedPassPlans compact /><SavedPlacesSection /><SavedPhrasesSection /><SavedStayResourcesSection /></> : <PageSkeleton />}
    </AppShell>
  );
}
