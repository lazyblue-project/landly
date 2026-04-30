"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Check } from "lucide-react";
import { PageSkeleton } from "@/components/common/page-skeleton";
import { LanguageSupportNotice } from "@/components/common/language-support-notice";
import { OnboardingLaunchPreview } from "@/components/onboarding/onboarding-launch-preview";
import { useAppStore } from "@/store/app-store";
import { AppMode, Language, OnboardingNeed, VisitPurpose, StayDuration } from "@/types";
import { i18nConfig } from "@/i18n/config";
import { getLanguageLabel, getLanguageSupportCopy } from "@/lib/i18n-support";
import { translateUi } from "@/lib/ui-copy";
import { cn } from "@/lib/utils";

type Step = "language" | "purpose" | "duration" | "need" | "city";
const steps: Step[] = ["language", "purpose", "duration", "need", "city"];

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

const cities = ["Seoul", "Busan", "Jeju", "Incheon", "Daegu", "Daejeon", "Gwangju"];

function inferMode(purpose: VisitPurpose, duration: StayDuration): AppMode {
  if (purpose === "study" || purpose === "work" || purpose === "residence") {
    return "life";
  }

  if (duration === "over_3months") {
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

  const handlePurposeChange = (value: VisitPurpose) => {
    setPurpose(value);
    if (value === "study" || value === "work" || value === "residence") {
      setFirstNeed("long_stay_setup");
    }
  };

  const handleDurationChange = (value: StayDuration) => {
    setDuration(value);
    if (value === "over_3months") {
      setFirstNeed("long_stay_setup");
    }
  };

  const handleNext = () => {
    if (isLast) {
      setUser({
        ...user,
        language,
        visitPurpose: purpose,
        stayDuration: duration,
        firstNeed,
        city,
        mode: inferMode(purpose, duration),
      });
      completeOnboarding();
      router.replace("/");
    } else {
      setCurrentStep((s) => s + 1);
    }
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
        <div className="flex gap-1 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= currentStep ? "bg-blue-600" : "bg-gray-200"
              )}
            />
          ))}
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
          {t("onboarding.personalize", "Personalize")}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">
          {step === "language" && t("onboarding.step_language")}
          {step === "purpose" && t("onboarding.step_purpose")}
          {step === "duration" && t("onboarding.step_duration")}
          {step === "need" && t("onboarding.step_need")}
          {step === "city" && t("onboarding.step_city")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {step === "need"
            ? t("onboarding.step_need_subtitle")
            : t("onboarding.subtitle")}
        </p>
      </div>

      <div className="flex-1 px-6 overflow-y-auto">
        {step === "language" && (
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
                      "w-full flex items-start justify-between gap-3 px-4 py-3.5 rounded-2xl border text-left transition-colors",
                      language === loc
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block font-medium text-gray-900">{getLanguageLabel(loc, "combined")}</span>
                      <span className="mt-1 inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gray-500 ring-1 ring-gray-100">
                        {t(support.level === "full-ui" ? "language.support_full_label" : "language.support_phrase_label", support.badge)}
                      </span>
                    </span>
                    {language === loc && <Check size={18} className="mt-1 shrink-0 text-blue-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === "purpose" && (
          <div className="space-y-2">
            {purposes.map(({ value, emoji }) => (
              <button
                key={value}
                onClick={() => handlePurposeChange(value)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-colors",
                  purpose === value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <span className="text-xl">{emoji}</span>
                <span className="font-medium text-gray-900">
                  {t(`onboarding.purpose_${value}`)}
                </span>
                {purpose === value && <Check size={18} className="text-blue-500 ml-auto" />}
              </button>
            ))}
          </div>
        )}

        {step === "duration" && (
          <div className="space-y-2">
            {durations.map(({ value }) => (
              <button
                key={value}
                onClick={() => handleDurationChange(value)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border text-left transition-colors",
                  duration === value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <span className="font-medium text-gray-900">
                  {t(`onboarding.duration_${value}`)}
                </span>
                {duration === value && <Check size={18} className="text-blue-500" />}
              </button>
            ))}
          </div>
        )}

        {step === "need" && (
          <div className="space-y-2">
            {firstNeeds.map(({ value, emoji }) => (
              <button
                key={value}
                onClick={() => setFirstNeed(value)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3.5 rounded-2xl border text-left transition-colors",
                  firstNeed === value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <span className="pt-0.5 text-xl">{emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-gray-900">
                    {t(`onboarding.need_${value}`)}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-gray-500">
                    {t(`onboarding.need_${value}_desc`)}
                  </span>
                </span>
                {firstNeed === value && <Check size={18} className="mt-1 shrink-0 text-blue-500" />}
              </button>
            ))}
          </div>
        )}

        {step === "city" && (
          <div className="space-y-2">
            {cities.map((currentCity) => (
              <button
                key={currentCity}
                onClick={() => setCity(currentCity)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border text-left transition-colors",
                  city === currentCity
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <span className="font-medium text-gray-900">{currentCity}</span>
                {city === currentCity && <Check size={18} className="text-blue-500" />}
              </button>
            ))}
            <OnboardingLaunchPreview
              language={language}
              purpose={purpose}
              duration={duration}
              firstNeed={firstNeed}
              city={city}
            />
          </div>
        )}
      </div>

      <div className="px-6 py-6">
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition-colors active:scale-[0.98]"
        >
          {isLast ? t("onboarding.btn_done") : t("onboarding.btn_next")}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
