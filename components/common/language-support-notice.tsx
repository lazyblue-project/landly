"use client";

import { Info, Languages } from "lucide-react";
import { getLanguageLabel, getLanguageSupportCopy } from "@/lib/i18n-support";
import { localizeText } from "@/lib/text-localizer";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import type { Language } from "@/types";

interface LanguageSupportNoticeProps {
  language?: Language;
  compact?: boolean;
  className?: string;
}

export function LanguageSupportNotice({ language, compact = false, className }: LanguageSupportNoticeProps) {
  const storeLanguage = useAppStore((state) => state.user.language);
  const currentLanguage = language ?? storeLanguage;
  const support = getLanguageSupportCopy(currentLanguage);
  const isFullUi = support.level === "full-ui";
  const description = compact ? support.shortDescription : support.description;

  return (
    <div
      className={cn(
        "rounded-2xl border p-3",
        isFullUi ? "border-emerald-100 bg-emerald-50" : "border-amber-100 bg-amber-50",
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className={cn("mt-0.5 rounded-xl bg-white p-1.5", isFullUi ? "text-emerald-700" : "text-amber-700")}>
          {isFullUi ? <Languages size={15} /> : <Info size={15} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className={cn("text-xs font-bold", isFullUi ? "text-emerald-900" : "text-amber-900")}>
              {localizeText(currentLanguage, support.title)}
            </p>
            <span className={cn("rounded-full bg-white px-2 py-0.5 text-[10px] font-bold", isFullUi ? "text-emerald-700" : "text-amber-700")}>
              {localizeText(currentLanguage, support.badge)}
            </span>
          </div>
          <p className={cn("mt-1 text-xs leading-relaxed", isFullUi ? "text-emerald-700" : "text-amber-700")}>
            {localizeText(currentLanguage, description, { language: getLanguageLabel(currentLanguage, "english") })}
          </p>
        </div>
      </div>
    </div>
  );
}
