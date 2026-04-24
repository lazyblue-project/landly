"use client";

import { useMemo } from "react";
import { phrases } from "@/data/phrases";
import { useAppStore } from "@/store/app-store";
import { EmptyState } from "@/components/common/empty-state";
import { PhraseCard } from "@/components/common/phrase-card";
import { SectionHeader } from "@/components/common/section-header";
import { MessageSquareText } from "lucide-react";
import { useUiCopy } from "@/lib/ui-copy";

export function SavedPhrasesSection() {
  const { user } = useAppStore();
  const { t } = useUiCopy();

  const savedPhrases = useMemo(() => {
    return phrases.filter((phrase) => user.savedPhraseIds.includes(phrase.id));
  }, [user.savedPhraseIds]);

  return (
    <section className="px-4 py-2">
      <SectionHeader
        title={t("my.saved_phrases")}
        subtitle={t("my.saved_phrases_subtitle")}
      />
      {savedPhrases.length === 0 ? (
        <EmptyState
          icon={<MessageSquareText size={36} />}
          title={t("common.empty_saved_phrases")}
        />
      ) : (
        <div className="space-y-3">
          {savedPhrases.map((phrase) => (
            <PhraseCard key={phrase.id} phrase={phrase} />
          ))}
        </div>
      )}
    </section>
  );
}
