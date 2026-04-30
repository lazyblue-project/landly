"use client";

import Link from "next/link";
import { BadgePercent, ClipboardCheck, Home, ShieldCheck } from "lucide-react";
import type { Language, OnboardingNeed, StayDuration, VisitPurpose } from "@/types";
import { getOnboardingLaunchAction } from "@/data/onboarding-launch-actions";
import { translateUi } from "@/lib/ui-copy";

interface OnboardingLaunchPreviewProps {
  language: Language;
  purpose: VisitPurpose;
  duration: StayDuration;
  firstNeed: OnboardingNeed;
  city: string;
}

export function OnboardingLaunchPreview({ language, purpose, duration, firstNeed, city }: OnboardingLaunchPreviewProps) {
  const action = getOnboardingLaunchAction({ purpose, duration, firstNeed });
  const t = (key: string, fallback?: string) => translateUi(language, key, undefined, fallback);

  return (
    <section className="mt-4 rounded-[1.75rem] border border-blue-100 bg-blue-50 p-4 text-left">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white p-2 text-blue-600 ring-1 ring-blue-100">
          <Home size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-blue-600">
            {t("onboarding.launch_preview_label", "Your first Home setup")}
          </p>
          <h2 className="mt-1 text-base font-bold text-gray-950">{t(action.title, action.title)}</h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            {t(action.description, action.description)} {city ? t("onboarding.launch_city_suffix", "City:") : ""} {city}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Link href={action.primaryHref} className="rounded-2xl bg-white p-3 text-gray-700 ring-1 ring-blue-100">
          <Home size={15} className="text-blue-600" />
          <p className="mt-2 font-bold">{t(action.primaryLabel, action.primaryLabel)}</p>
        </Link>
        <Link href={action.betaHref} className="rounded-2xl bg-white p-3 text-gray-700 ring-1 ring-blue-100">
          <ClipboardCheck size={15} className="text-violet-600" />
          <p className="mt-2 font-bold">{t(action.betaLabel, action.betaLabel)}</p>
        </Link>
        <Link href={action.partnerHref} className="rounded-2xl bg-white p-3 text-gray-700 ring-1 ring-blue-100">
          <BadgePercent size={15} className="text-rose-600" />
          <p className="mt-2 font-bold">{t(action.partnerLabel, action.partnerLabel)}</p>
        </Link>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-2xl bg-white/80 p-3 text-xs leading-relaxed text-gray-600 ring-1 ring-blue-100">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" />
        <span>{t(action.safetyNote, action.safetyNote)}</span>
      </div>
    </section>
  );
}
