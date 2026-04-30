"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookmarkPlus,
  Building2,
  CarTaxiFront,
  CheckCircle2,
  GaugeCircle,
  HeartPulse,
  Languages,
  MessageSquareQuote,
  ReceiptText,
  ShieldAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  essentialLanguagePhraseIds,
  languageLabels,
  languageReadinessKits,
  type LanguageReadinessKit,
  type LanguageReadinessTone,
} from "@/data/language-readiness";
import { phrases } from "@/data/phrases";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/lib/haptics";

interface LanguageReadinessPanelProps {
  compact?: boolean;
}

const toneClasses: Record<LanguageReadinessTone, string> = {
  blue: "border-blue-100 bg-blue-50 text-blue-700",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
  amber: "border-amber-100 bg-amber-50 text-amber-700",
  rose: "border-rose-100 bg-rose-50 text-rose-700",
  violet: "border-violet-100 bg-violet-50 text-violet-700",
  gray: "border-gray-100 bg-gray-50 text-gray-700",
};

const kitIcons: Record<string, LucideIcon> = {
  "translation-basics": Languages,
  "arrival-taxi": CarTaxiFront,
  "refund-checkout": ReceiptText,
  "clinic-pharmacy": HeartPulse,
  "emergency-show-card": ShieldAlert,
  "hotel-luggage": Building2,
};

function getReadinessWidthClass(value: number) {
  if (value >= 90) return "w-11/12";
  if (value >= 80) return "w-4/5";
  if (value >= 70) return "w-3/4";
  if (value >= 60) return "w-3/5";
  if (value >= 50) return "w-1/2";
  if (value >= 40) return "w-2/5";
  return "w-1/4";
}

function countSaved(ids: string[], savedPhraseIds: string[]) {
  return ids.filter((id) => savedPhraseIds.includes(id)).length;
}

export function LanguageReadinessPanel({ compact = false }: LanguageReadinessPanelProps) {
  const { user, toggleSavedPhrase, showSnackbar } = useAppStore();
  const { lt } = useLocalizedText();
  const savedEssentialCount = countSaved(essentialLanguagePhraseIds, user.savedPhraseIds);
  const emergencyReady = user.savedPhraseIds.some((id) => {
    const phrase = phrases.find((item) => item.id === id);
    return phrase?.category === "emergency";
  });
  const translatedPhraseCount = phrases.filter((phrase) =>
    user.language === "en" || user.language === "ko" ? true : Boolean(phrase.translations[user.language])
  ).length;
  const readinessScore = Math.min(
    100,
    40 + savedEssentialCount * 8 + (emergencyReady ? 12 : 0) + (user.language !== "en" ? 8 : 0)
  );
  const visibleKits = compact ? languageReadinessKits.slice(0, 3) : languageReadinessKits;
  const unsavedEssentialIds = essentialLanguagePhraseIds.filter((id) => !user.savedPhraseIds.includes(id));

  const handleSaveEssentials = () => {
    if (unsavedEssentialIds.length === 0) {
      showSnackbar(lt("Essential language kit is already saved."), "success");
      return;
    }

    unsavedEssentialIds.forEach((id) => toggleSavedPhrase(id));
    triggerHaptic("success");
    showSnackbar(lt("Essential language kit saved."), "success");
  };

  return (
    <section className={compact ? "px-4 pt-4" : "space-y-4 px-4 py-4"}>
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-indigo-700 ring-1 ring-indigo-100">
              <Languages size={13} />
              {lt("Language readiness")}
            </div>
            <h2 className="mt-3 text-lg font-bold text-gray-900">{lt("Say the right thing faster in Korea")}</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">
              {lt("Save essential Korean show-cards, then jump into the phrase set that matches your current situation.")}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-2 text-indigo-600 shadow-sm">
            <MessageSquareQuote size={20} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/85 px-3 py-2 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{lt("Ready")}</p>
            <p className="mt-1 text-lg font-black text-gray-900">{readinessScore}</p>
          </div>
          <div className="rounded-2xl bg-white/85 px-3 py-2 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{lt("Saved kit")}</p>
            <p className="mt-1 text-lg font-black text-gray-900">{savedEssentialCount}/{essentialLanguagePhraseIds.length}</p>
          </div>
          <div className="rounded-2xl bg-white/85 px-3 py-2 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{lt("Language")}</p>
            <p className="mt-1 truncate text-sm font-black text-gray-900">{lt(languageLabels[user.language])}</p>
          </div>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
          <div className={cn("h-full rounded-full bg-indigo-600", getReadinessWidthClass(readinessScore))} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold">
          <span className="rounded-full bg-white px-2.5 py-1 text-gray-600 ring-1 ring-gray-100">
            {lt("Translated phrase coverage")}: {translatedPhraseCount}/{phrases.length}
          </span>
          <span className={cn("rounded-full px-2.5 py-1 ring-1", emergencyReady ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-amber-50 text-amber-700 ring-amber-100")}>
            {lt(emergencyReady ? "Emergency phrase saved" : "Emergency phrase not saved")}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSaveEssentials}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-900 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-transform active:scale-[0.98]"
          >
            {unsavedEssentialIds.length === 0 ? <CheckCircle2 size={15} /> : <BookmarkPlus size={15} />}
            {lt(unsavedEssentialIds.length === 0 ? "Essential kit saved" : "Save essential kit")}
          </button>
          <Link
            href="/assistant"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-xs font-bold text-gray-700 shadow-sm ring-1 ring-gray-100"
          >
            <GaugeCircle size={15} />
            {lt("Open phrases")}
          </Link>
        </div>
      </div>

      <div className={compact ? "mt-3 space-y-2" : "space-y-3"}>
        {visibleKits.map((kit: LanguageReadinessKit) => {
          const Icon = kitIcons[kit.id] ?? Languages;
          const savedCount = countSaved(kit.phraseIds, user.savedPhraseIds);

          return (
            <Link
              key={kit.id}
              href={kit.href}
              className="group flex items-center gap-3 rounded-3xl border border-gray-100 bg-white p-3 shadow-sm transition-colors hover:border-indigo-100 hover:bg-indigo-50/30"
            >
              <div className={cn("shrink-0 rounded-2xl border p-2.5", toneClasses[kit.tone])}>
                <Icon size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-gray-900">{lt(kit.title)}</p>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                    {savedCount}/{kit.phraseIds.length}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{lt(compact ? kit.description : kit.whenToUse)}</p>
              </div>
              <ArrowRight size={16} className="shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
