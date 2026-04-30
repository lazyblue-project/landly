import { useMemo } from "react";
import { smartActionRules } from "@/data/personal-action-rules";
import type { SmartActionRule } from "@/data/personal-action-rules";
import { useReminderEngine } from "@/hooks/use-reminder-engine";
import { useAppStore } from "@/store/app-store";

export interface SmartAction extends SmartActionRule {
  score: number;
  reasons: string[];
  urgency: "high" | "medium" | "low";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function addReason(reasons: string[], condition: boolean, message: string, score: number) {
  if (!condition) return 0;
  reasons.push(message);
  return score;
}

export function useSmartActionEngine() {
  const user = useAppStore((state) => state.user);
  const departureDate = useAppStore((state) => state.departureDate);
  const receiptRecords = useAppStore((state) => state.receiptRecords);
  const savedPassPlans = useAppStore((state) => state.savedPassPlans);
  const savedCareProviderIds = useAppStore((state) => state.savedCareProviderIds);
  const stayPlanInput = useAppStore((state) => state.stayPlanInput);
  const stayDocuments = useAppStore((state) => state.stayDocuments);
  const calendarEvents = useAppStore((state) => state.calendarEvents);
  const savedPartnerOfferIds = useAppStore((state) => state.savedPartnerOfferIds);
  const requestedPartnerOfferIds = useAppStore((state) => state.requestedPartnerOfferIds);
  const { summary } = useReminderEngine();

  return useMemo(() => {
    const pendingReceipts = receiptRecords.filter(
      (record) => record.refundStatus === "pending" || record.refundStatus === "needs-check"
    );
    const passportMissingReceipts = pendingReceipts.filter((record) => record.passportReady !== true);
    const isLifeMode = user.mode === "life" || user.stayDuration === "over_3months";
    const hasPartnerIntent = savedPartnerOfferIds.length + requestedPartnerOfferIds.length > 0;
    const savedEssentialCount =
      user.savedPlaceIds.length +
      user.savedPhraseIds.length +
      savedPassPlans.length +
      savedCareProviderIds.length +
      stayDocuments.length +
      calendarEvents.length +
      receiptRecords.length;

    const actions = smartActionRules
      .filter((rule) => rule.recommendedModes.includes(user.mode))
      .map((rule): SmartAction => {
        const reasons: string[] = [];
        let score = rule.baseScore;

        score += addReason(reasons, Boolean(user.firstNeed && rule.firstNeeds?.includes(user.firstNeed)), "Matches your first onboarding priority", 26);
        score += addReason(reasons, Boolean(rule.visitPurposes?.includes(user.visitPurpose)), "Matches your visit purpose", 14);
        score += addReason(reasons, Boolean(rule.stayDurations?.includes(user.stayDuration)), "Matches your stay length", 12);

        if (rule.id === "arrival_assistant") {
          score += addReason(reasons, savedPassPlans.length === 0, "No saved arrival route yet", 18);
          score += addReason(reasons, user.mode === "travel" && calendarEvents.length === 0, "No travel dates on Calendar yet", 8);
        }

        if (rule.id === "refund_wallet") {
          score += addReason(reasons, pendingReceipts.length > 0, `${pendingReceipts.length} receipt(s) still need review`, 28);
          score += addReason(reasons, passportMissingReceipts.length > 0, `${passportMissingReceipts.length} receipt(s) need passport check`, 14);
          score += addReason(reasons, pendingReceipts.length > 0 && !departureDate, "Departure date is not set yet", 10);
        }

        if (rule.id === "shopping_checker") {
          score += addReason(reasons, user.mode === "travel" && receiptRecords.length === 0, "No receipts saved yet", 12);
          score += addReason(reasons, user.firstNeed === "shopping_refund", "Shopping refund was selected first", 16);
        }

        if (rule.id === "care_safety") {
          score += addReason(reasons, savedCareProviderIds.length === 0, "No saved clinic or pharmacy yet", 16);
          score += addReason(reasons, user.firstNeed === "hospital_pharmacy" || user.firstNeed === "emergency_help", "Health or emergency help was selected first", 18);
        }

        if (rule.id === "settlement_plan") {
          score += addReason(reasons, isLifeMode && !stayPlanInput, "No settlement plan created yet", 28);
          score += addReason(reasons, isLifeMode && stayDocuments.length < 2, "Important documents are not organized yet", 10);
        }

        if (rule.id === "document_vault") {
          score += addReason(reasons, isLifeMode && stayDocuments.length < 3, "Document vault needs more essentials", 22);
          score += addReason(reasons, isLifeMode && summary.dueSoon + summary.overdue > 0, "A document or checkpoint may need attention", 12);
        }

        if (rule.id === "phrase_pack") {
          score += addReason(reasons, user.savedPhraseIds.length === 0, "No saved Korean phrases yet", 20);
          score += addReason(reasons, user.firstNeed === "korean_phrases", "Korean phrases were selected first", 18);
        }

        if (rule.id === "trust_center") {
          score += addReason(reasons, hasPartnerIntent, "You saved or requested partner offers", 12);
          score += addReason(reasons, pendingReceipts.length > 0 || savedCareProviderIds.length > 0, "You have items that should be checked before acting", 10);
        }

        if (rule.id === "reminder_review") {
          score += addReason(reasons, summary.overdue > 0, `${summary.overdue} overdue reminder(s)`, 40);
          score += addReason(reasons, summary.dueSoon > 0, `${summary.dueSoon} due-soon reminder(s)`, 24);
        }

        if (rule.id === "personal_command_center") {
          score += addReason(reasons, savedEssentialCount > 0, `${savedEssentialCount} saved item(s) across Landly`, 12);
          score += addReason(reasons, calendarEvents.length === 0, "Calendar is still empty", 8);
        }

        const normalizedScore = clamp(score, 0, 100);
        return {
          ...rule,
          score: normalizedScore,
          reasons: reasons.length > 0 ? reasons.slice(0, 3) : ["Recommended for your current Landly setup"],
          urgency: normalizedScore >= 82 ? "high" : normalizedScore >= 62 ? "medium" : "low",
        };
      })
      .sort((a, b) => b.score - a.score);

    const topActions = actions.slice(0, 4);
    const readinessScore = clamp(
      35 +
        Math.min(savedEssentialCount, 8) * 4 +
        (savedPassPlans.length > 0 ? 8 : 0) +
        (user.savedPhraseIds.length > 0 ? 7 : 0) +
        (departureDate ? 6 : 0) +
        (stayPlanInput ? 8 : 0) +
        (summary.overdue > 0 ? -12 : 0) +
        (summary.dueSoon > 0 ? -6 : 0),
      0,
      100
    );

    const focusLabel = topActions[0]?.badge ?? "Next action";
    const focusHref = topActions[0]?.href ?? "/my";

    return {
      actions,
      topActions,
      readinessScore,
      focusLabel,
      focusHref,
      stats: {
        pendingReceipts: pendingReceipts.length,
        passportMissingReceipts: passportMissingReceipts.length,
        reminderFocus: summary.dueSoon + summary.overdue,
        savedEssentialCount,
      },
    };
  }, [
    user,
    departureDate,
    receiptRecords,
    savedPassPlans,
    savedCareProviderIds,
    stayPlanInput,
    stayDocuments,
    calendarEvents,
    savedPartnerOfferIds,
    requestedPartnerOfferIds,
    summary.dueSoon,
    summary.overdue,
  ]);
}
