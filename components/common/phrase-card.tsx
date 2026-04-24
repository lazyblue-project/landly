"use client";

import { useMemo, useState } from "react";
import { Copy, Check, Maximize2, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { PhraseCard as PhraseCardType } from "@/types";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { triggerHaptic } from "@/lib/haptics";
import { useLocalizedText } from "@/lib/text-localizer";

interface PhraseCardProps { phrase: PhraseCardType; className?: string; }

export function PhraseCard({ phrase, className }: PhraseCardProps) {
  const { user, toggleSavedPhrase, showSnackbar } = useAppStore();
  const isSaved = user.savedPhraseIds.includes(phrase.id);
  const [copied, setCopied] = useState(false);
  const [showMode, setShowMode] = useState(false);
  const { lt } = useLocalizedText();

  const localizedText = useMemo(() => {
    if (user.language === "ko") return phrase.korean;
    if (user.language === "en") return phrase.english;
    return phrase.translations[user.language] ?? phrase.english;
  }, [phrase.korean, phrase.english, phrase.translations, user.language]);

  const showModeTranslation = user.language === "ko" ? phrase.english : localizedText;

  const handleCopy = async () => { await navigator.clipboard.writeText(phrase.korean); triggerHaptic("success"); showSnackbar(lt("Korean phrase copied."), "success"); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleSave = () => { triggerHaptic(isSaved ? "light" : "success"); toggleSavedPhrase(phrase.id); showSnackbar(lt(isSaved ? "Phrase removed from saved list." : "Phrase saved for quick reuse."), isSaved ? "default" : "success"); };

  if (showMode) return <div className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-white p-8" onClick={() => setShowMode(false)}><p className="mb-6 text-xs uppercase tracking-widest text-gray-400">{lt("Show this to someone")}</p><p className="text-center text-4xl font-bold leading-relaxed text-gray-900">{phrase.korean}</p><p className="mt-4 text-center text-lg text-gray-400">{showModeTranslation}</p><p className="mt-10 text-xs text-gray-300">{lt("Tap anywhere to close")}</p></div>;

  return (
    <div className={cn("rounded-2xl border border-gray-100 bg-white p-4 shadow-sm", className)}>
      <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">{lt(phrase.situation)}</p>
      <p className="text-xl font-bold text-gray-900">{phrase.korean}</p>
      <p className="mt-1 text-sm text-gray-500">{phrase.romanization}</p>
      <p className="mt-0.5 text-sm text-gray-600">{localizedText}</p>
      <div className="mt-4 flex items-center gap-2">
        <button onClick={handleCopy} className={cn("flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all active:scale-[0.97]", copied ? "border-green-200 bg-green-50 text-green-600" : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100")}>{copied ? <Check size={13} /> : <Copy size={13} />}{lt(copied ? "Copied!" : "Copy")}</button>
        <button onClick={() => { triggerHaptic("light"); setShowMode(true); }} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition-all active:scale-[0.97] hover:bg-gray-100"><Maximize2 size={13} />{lt("Show")}</button>
        <button onClick={handleSave} className={cn("ml-auto flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all active:scale-[0.97]", isSaved ? "border-blue-200 bg-blue-50 text-blue-600" : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100")}>{isSaved ? <BookmarkCheck size={13} /> : <BookmarkPlus size={13} />}{lt(isSaved ? "Saved" : "Save")}</button>
      </div>
    </div>
  );
}
