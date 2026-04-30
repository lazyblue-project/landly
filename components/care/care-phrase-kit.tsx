"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { PhraseCard } from "@/components/common/phrase-card";
import { phrases } from "@/data/phrases";
import { useLocalizedText } from "@/lib/text-localizer";

const carePhraseIds = ["phrase_036", "phrase_037", "phrase_017", "phrase_030", "phrase_031", "phrase_018", "phrase_040", "phrase_041"];
const carePhrases = carePhraseIds
  .map((id) => phrases.find((phrase) => phrase.id === id))
  .filter((phrase): phrase is NonNullable<typeof phrase> => Boolean(phrase));

interface CarePhraseKitProps {
  limit?: number;
}

export function CarePhraseKit({ limit }: CarePhraseKitProps) {
  const { lt } = useLocalizedText();
  const visiblePhrases = typeof limit === "number" ? carePhrases.slice(0, limit) : carePhrases;

  return (
    <section className="space-y-3">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-rose-50 p-2 text-rose-600">
            <MessageCircle size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">{lt("Care phrase kit")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              {lt("Keep emergency, pharmacy, allergy, and reception phrases ready before you need them.")}
            </p>
          </div>
          <Link href="/assistant?category=hospital" className="shrink-0 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white">
            {lt("Open all")}
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {visiblePhrases.map((phrase) => (
          <PhraseCard key={phrase.id} phrase={phrase} />
        ))}
      </div>
    </section>
  );
}
