import { CareTriageInput, CareTriageResult } from "@/types";

export function getCareTriageResult(input: CareTriageInput): CareTriageResult {
  if (input.isBreathingIssue || input.isHeavyBleeding || input.hasChestPain || input.severityLevel === "severe") {
    return {
      level: "emergency",
      title: "Get urgent help now",
      summary: "This situation may need emergency evaluation first. Do not wait in the app if symptoms feel dangerous.",
      reasons: [
        input.isBreathingIssue ? "Breathing difficulty reported" : "",
        input.isHeavyBleeding ? "Heavy bleeding reported" : "",
        input.hasChestPain ? "Chest pain reported" : "",
        input.severityLevel === "severe" ? "Severe intensity selected" : "",
      ].filter(Boolean),
      safetyNote: "Call 119, ask nearby staff for help, or go to an emergency-ready hospital immediately.",
      nextActions: ["call-119", "open-sos", "open-care-phrases", "find-clinic"],
    };
  }

  if (input.symptomCategory === "mental-health") {
    return {
      level: "specialist",
      title: "Look for counseling or support",
      summary: "A counseling or mental-health support option may fit better than a general walk-in clinic.",
      reasons: ["Mental health support was selected"],
      safetyNote: "If there is immediate danger to yourself or someone else, use emergency help first.",
      nextActions: ["find-specialist", "open-1330", "prepare-visit-note"],
    };
  }

  if (input.symptomCategory === "skin" || input.symptomCategory === "dental" || input.symptomCategory === "checkup") {
    return {
      level: "specialist",
      title: "A specialist visit may be the best fit",
      summary: "Your situation looks better suited to a specialty clinic such as dermatology, dental care, or a checkup center.",
      reasons: ["A specialty category was selected"],
      nextActions: ["find-specialist", "open-care-phrases", "prepare-visit-note"],
    };
  }

  if (input.isNightTime && input.severityLevel === "mild") {
    return {
      level: "pharmacy",
      title: "Start with a pharmacy or hotline",
      summary: "For mild issues at night, a pharmacy or hotline may be the quickest next step before deciding on a clinic visit.",
      reasons: ["Night-time + mild symptoms"],
      nextActions: ["find-pharmacy", "call-1339", "open-care-phrases"],
    };
  }

  if (input.symptomCategory === "fever-cold" && input.severityLevel === "moderate") {
    return {
      level: "hotline",
      title: "Use a medical hotline first",
      summary: "A hotline can help you decide whether you should visit a clinic now or monitor symptoms first.",
      reasons: ["Cold / fever symptoms with moderate intensity"],
      nextActions: ["call-1339", "find-clinic", "prepare-visit-note"],
    };
  }

  if (input.symptomCategory === "stomach" || input.symptomCategory === "injury" || input.symptomCategory === "other") {
    return {
      level: "clinic",
      title: "A clinic visit is a good next step",
      summary: "A general clinic can usually help you assess common travel or short-term issues and guide you further if needed.",
      reasons: ["Common non-emergency symptom pattern"],
      nextActions: ["find-clinic", "open-care-phrases", "prepare-visit-note"],
    };
  }

  return {
    level: "pharmacy",
    title: "Try a pharmacy first",
    summary: "A pharmacy may be enough for simple symptom relief. Move to a clinic if symptoms get worse or continue.",
    reasons: ["Mild symptom pattern"],
    nextActions: ["find-pharmacy", "open-care-phrases", "find-clinic"],
  };
}
