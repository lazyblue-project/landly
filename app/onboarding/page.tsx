"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { LanguageSupportNotice } from "@/components/common/language-support-notice";
import { OnboardingLaunchPreview } from "@/components/onboarding/onboarding-launch-preview";
import { i18nConfig } from "@/i18n/config";
import { getLanguageLabel, getLanguageSupportCopy } from "@/lib/i18n-support";
import { translateUi } from "@/lib/ui-copy";
import { getCityCoverage, onboardingCities } from "@/lib/city-coverage";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import type { AppMode, Language, OnboardingNeed, StayDuration, VisitPurpose } from "@/types";

type Step = "language" | "purpose";
const steps: Step[] = ["language", "purpose"];

const purposes: { value: VisitPurpose; emoji: string }[] = [
  { value: "tourism", emoji: "🗼" },
  { value: "business", emoji: "💼" },
  { value: "study", emoji: "🎓" },
  { value: "work", emoji: "🏢" },
  { value: "residence", emoji: "🏠" },
];

const durations: { value: StayDuration }[] = [
  { value: "under_1week" },
  { value: "1_4weeks" },
  { value: "1_3months" },
  { value: "over_3months" },
];

const firstNeeds: { value: OnboardingNeed; emoji: string }[] = [
  { value: "airport_transport", emoji: "🚇" },
  { value: "shopping_refund", emoji: "🛍️" },
  { value: "hospital_pharmacy", emoji: "🏥" },
  { value: "korean_phrases", emoji: "💬" },
  { value: "long_stay_setup", emoji: "📋" },
  { value: "emergency_help", emoji: "🆘" },
];

function inferMode(purpose: VisitPurpose, duration: StayDuration): AppMode {
  if (purpose === "study" || purpose === "work" || purpose === "residence" || duration === "over_3months") {
    return "life";
  }
  return "travel";
}

function getRecommendedNeed(purpose: VisitPurpose, duration: StayDuration): OnboardingNeed {
  if (purpose === "study" || purpose === "work" || purpose === "residence" || duration === "over_3months") {
    return "long_stay_setup";
  }
  return "airport_transport";
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, hasHydrated, setUser, completeOnboarding } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState<Language>(user.language);
  const [purpose, setPurpose] = useState<VisitPurpose>(user.visitPurpose);
  const [duration, setDuration] = useState<StayDuration>(user.stayDuration);
  const [firstNeed, setFirstNeed] = useState<OnboardingNeed>(
    user.firstNeed ?? getRecommendedNeed(user.visitPurpose, user.stayDuration)
  );
  const [city, setCity] = useState(user.city);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const t = (key: string, fallback?: string) => translateUi(language, key, undefined, fallback);

  const finish = (patch?: Partial<typeof user>) => {
    const nextPurpose = patch?.visitPurpose ?? purpose;
    const nextDuration = patch?.stayDuration ?? duration;
    setUser({
      ...user,
      language: patch?.language ?? language,
      visitPurpose: nextPurpose,
      stayDuration: nextDuration,
      firstNeed: patch?.firstNeed ?? firstNeed,
      city: patch?.city ?? city,
      mode: patch?.mode ?? inferMode(nextPurpose, nextDuration),
    });
    completeOnboarding();
    router.replace("/");
  };

  const handlePurposeChange = (value: VisitPurpose) => {
    setPurpose(value);
    if (value === "study" || value === "work" || value === "residence") {
      setDuration("over_3months");
      setFirstNeed("long_stay_setup");
    } else if (firstNeed === "long_stay_setup") {
      setFirstNeed("airport_transport");
    }
  };

  const handleDurationChange = (value: StayDuration) => {
    setDuration(value);
    if (value === "over_3months") setFirstNeed("long_stay_setup");
  };

  const handleNext = () => {
    if (isLast) finish();
    else setCurrentStep((value) => value + 1);
  };

  const handleSkip = () => {
    const recommendedNeed = getRecommendedNeed(purpose, duration);
    finish({ firstNeed: firstNeed ?? recommendedNeed, mode: inferMode(purpose, duration) });
  };

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-white max-w-md mx-auto pt-10">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto flex flex-col">
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-1 gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  index <= currentStep ? "bg-blue-600" : "bg-gray-200"
                )}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-gray-400">{currentStep + 1}/{steps.length}</span>
        </div>
        <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
          {t("onboarding.personalize", "Personalize")}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          {step === "language" ? t("onboarding.step_language", "Choose your language") : t("onboarding.step_purpose", "Why are you visiting Korea?")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {step === "language"
            ? t("onboarding.subtitle", "Let's personalize your Korea experience")
            : t("onboarding.v45_fast_start_subtitle", "Pick your main mode now. Duration, city, and first need are optional and can be changed later in My.")}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        {step === "language" ? (
          <div className="space-y-3">
            <LanguageSupportNotice language={language} />
            <div className="space-y-2">
              {i18nConfig.locales.map((loc) => {
                const support = getLanguageSupportCopy(loc);
                return (
                  <button
                    key={loc}
                    onClick={() => setLanguage(loc)}
                    className={cn(
                      "w-full flex items-start justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors",
                      language === loc ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block font-medium text-gray-900">{getLanguageLabel(loc, "combined")}</span>
                      <span className="mt-1 inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gray-500 ring-1 ring-gray-100">
                        {t(
                          support.level === "full-ui"
                            ? "language.support_full_label"
                            : support.level === "beta-ui"
                              ? "language.support_beta_ui_label"
                              : support.level === "partial-phrase-support"
                                ? "language.support_partial_label"
                                : "language.support_phrase_label",
                          support.badge
                        )}
                      </span>
                    </span>
                    {language === loc ? <Check size={18} className="mt-1 shrink-0 text-blue-500" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {purposes.map(({ value, emoji }) => (
                <button
                  key={value}
                  onClick={() => handlePurposeChange(value)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors",
                    purpose === value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="font-medium text-gray-900">{t(`onboarding.purpose_${value}`)}</span>
                  {purpose === value ? <Check size={18} className="ml-auto text-blue-500" /> : null}
                </button>
              ))}
            </div>

            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
              <div>
                <p className="text-sm font-bold text-gray-900">{t("onboarding.v45_optional_title", "Optional quick setup")}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  {t("onboarding.v45_optional_desc", "You can skip this now. These choices only tune your Home recommendations.")}
                </p>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{t("onboarding.step_duration", "How long are you staying?")}</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {durations.map(({ value }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleDurationChange(value)}
                        className={cn(
                          "shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition-colors",
                          duration === value ? "bg-gray-900 text-white" : "bg-white text-gray-600 ring-1 ring-gray-100"
                        )}
                      >
                        {t(`onboarding.duration_${value}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{t("onboarding.step_need", "What do you need help with first?")}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {firstNeeds.map(({ value, emoji }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFirstNeed(value)}
                        className={cn(
                          "flex items-center gap-2 rounded-2xl px-3 py-2 text-left text-xs font-semibold transition-colors",
                          firstNeed === value ? "bg-blue-600 text-white" : "bg-white text-gray-600 ring-1 ring-gray-100"
                        )}
                      >
                        <span>{emoji}</span>
                        <span className="line-clamp-1">{t(`onboarding.need_${value}`)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{t("onboarding.step_city", "Which city are you in?")}</p>
                  <div className="space-y-2">
                    {onboardingCities.slice(0, 4).map((currentCity) => {
                      const coverage = getCityCoverage(currentCity);
                      return (
                        <button
                          key={currentCity}
                          type="button"
                          onClick={() => setCity(currentCity)}
                          className={cn(
                            "w-full flex items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left transition-colors",
                            city === currentCity ? "bg-white ring-2 ring-blue-500" : "bg-white ring-1 ring-gray-100"
                          )}
                        >
                          <span>
                            <span className="block text-sm font-semibold text-gray-900">{currentCity}</span>
                            <span className="text-[11px] text-gray-500">
                              {coverage.level === "preparing"
                                ? t("city.coverage_preparing", "Preparing — Seoul content shown first")
                                : coverage.level === "limited"
                                  ? t("city.coverage_limited", "Limited local data")
                                  : t("city.coverage_ready", "Ready")}
                            </span>
                          </span>
                          {city === currentCity ? <Check size={16} className="text-blue-500" /> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <OnboardingLaunchPreview language={language} purpose={purpose} duration={duration} firstNeed={firstNeed} city={city} />
          </div>
        )}
      </div>

      <div className="space-y-2 px-6 py-6">
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-semibold text-white transition-colors hover:bg-blue-700 active:scale-[0.98]"
        >
          {isLast ? t("onboarding.btn_done", "Get started") : t("onboarding.btn_next", "Next")}
          <ChevronRight size={18} />
        </button>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrentStep((value) => Math.max(value - 1, 0))}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 disabled:opacity-0"
          >
            <ChevronLeft size={14} /> {t("common.btn_back", "Back")}
          </button>
          <button type="button" onClick={handleSkip} className="rounded-xl px-3 py-2 text-xs font-semibold text-gray-500">
            {t("onboarding.btn_skip", "Skip for now")}
          </button>
        </div>
      </div>
    </div>
  );
}
