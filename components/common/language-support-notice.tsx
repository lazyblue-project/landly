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
  const isBetaUi = support.level === "beta-ui";
  const isPartial = support.level === "partial-phrase-support";
  const description = compact ? support.shortDescription : support.description;
  const tone = isFullUi ? "emerald" : isBetaUi ? "sky" : isPartial ? "orange" : "amber";

  return (
    <div
      className={cn(
        "rounded-2xl border p-3",
        tone === "emerald" && "border-emerald-100 bg-emerald-50",
        tone === "sky" && "border-sky-100 bg-sky-50",
        tone === "orange" && "border-orange-100 bg-orange-50",
        tone === "amber" && "border-amber-100 bg-amber-50",
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            "mt-0.5 rounded-xl bg-white p-1.5",
            tone === "emerald" && "text-emerald-700",
            tone === "sky" && "text-sky-700",
            tone === "orange" && "text-orange-700",
            tone === "amber" && "text-amber-700"
          )}
        >
          {isFullUi || isBetaUi ? <Languages size={15} /> : <Info size={15} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p
              className={cn(
                "text-xs font-bold",
                tone === "emerald" && "text-emerald-900",
                tone === "sky" && "text-sky-900",
                tone === "orange" && "text-orange-900",
                tone === "amber" && "text-amber-900"
              )}
            >
              {localizeText(currentLanguage, support.title)}
            </p>
            <span
              className={cn(
                "rounded-full bg-white px-2 py-0.5 text-[10px] font-bold",
                tone === "emerald" && "text-emerald-700",
                tone === "sky" && "text-sky-700",
                tone === "orange" && "text-orange-700",
                tone === "amber" && "text-amber-700"
              )}
            >
              {localizeText(currentLanguage, support.badge)}
            </span>
          </div>
          <p
            className={cn(
              "mt-1 text-xs leading-relaxed",
              tone === "emerald" && "text-emerald-700",
              tone === "sky" && "text-sky-700",
              tone === "orange" && "text-orange-700",
              tone === "amber" && "text-amber-700"
            )}
          >
            {localizeText(currentLanguage, description, { language: getLanguageLabel(currentLanguage, "english") })}
          </p>
        </div>
      </div>
    </div>
  );
}
