"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { PhraseGrid } from "@/components/assistant/phrase-grid";
import { SituationQuickActions } from "@/components/assistant/situation-quick-actions";
import { LanguageReadinessPanel } from "@/components/assistant/language-readiness-panel";
import { FeedbackPrompt } from "@/components/common/feedback-prompt";
import { LanguageSupportNotice } from "@/components/common/language-support-notice";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { useUiCopy } from "@/lib/ui-copy";
import { useAppStore } from "@/store/app-store";
import { PhraseCategory } from "@/types";

const allowed = new Set<PhraseCategory | "all">([
  "all",
  "taxi",
  "transport",
  "food",
  "allergy",
  "shopping",
  "accommodation",
  "hospital",
  "delivery",
  "lost_complaint",
  "emergency",
  "settlement",
]);

export default function AssistantPage() {
  return (
    <Suspense>
      <AssistantPageContent />
    </Suspense>
  );
}

function AssistantPageContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useUiCopy();
  const hasHydrated = useAppStore((state) => state.hasHydrated);
  const maybeCategory = (searchParams.get("category") ?? "all") as PhraseCategory | "all";
  const activeCategory = allowed.has(maybeCategory) ? maybeCategory : "all";

  if (!hasHydrated) return <PageSkeleton />;

  const handleCategoryChange = (nextCategory: PhraseCategory | "all") => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextCategory === "all") {
      params.delete("category");
    } else {
      params.set("category", nextCategory);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <AppShell>
      <TopBar title={t("assistant.title", undefined, "Phrases")} />
      <div className="space-y-3 px-4 pb-2 pt-3">
        <p className="text-xs text-gray-500">
          {t("assistant.subtitle", undefined, "Tap to copy or show to someone")}
        </p>
        <LanguageSupportNotice compact />
      </div>
      {activeCategory === "all" ? (
        <>
          <LanguageReadinessPanel />
          <SituationQuickActions />
        </>
      ) : null}
      <PhraseGrid category={activeCategory} onCategoryChange={handleCategoryChange} />
      <FeedbackPrompt context="Assistant" compact />
    </AppShell>
  );
}
