"use client";

import { phrases } from "@/data/phrases";
import { PhraseCard } from "@/components/common/phrase-card";
import { useLocalizedText } from "@/lib/text-localizer";

const featuredPhraseIds = ["phrase_001", "phrase_007", "phrase_008", "phrase_009", "phrase_013", "phrase_020", "phrase_021", "phrase_022", "phrase_023"];

export function PassPhrasePack() {
  const passPhrases = phrases.filter((phrase) => featuredPhraseIds.includes(phrase.id));
  const { lt } = useLocalizedText();

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-gray-900">{lt("Travel phrase pack")}</p>
        <p className="mt-1 text-xs text-gray-500">{lt("Keep airport, station, taxi, and last-mile phrases ready before you leave the airport.")}</p>
      </div>
      <div className="mt-4 space-y-3">{passPhrases.map((phrase) => <PhraseCard key={phrase.id} phrase={phrase} />)}</div>
    </section>
  );
}
