"use client";

import { ActionCard } from "@/components/common/action-card";
import { SectionHeader } from "@/components/common/section-header";
import { useUiCopy } from "@/lib/ui-copy";
import { ActionCard as ActionCardType } from "@/types";

interface RecommendedActionsProps {
  actions: ActionCardType[];
}

export function RecommendedActions({ actions }: RecommendedActionsProps) {
  const { t } = useUiCopy();

  return (
    <section className="px-4 py-4">
      <SectionHeader title={t("home.section_recommended")} />
      <div className="space-y-3">
        {actions.map((card) => (
          <ActionCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
