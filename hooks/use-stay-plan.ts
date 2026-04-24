import { useMemo } from "react";
import { lifeChecklist } from "@/data/life-checklist";
import { stayResources } from "@/data/stay-resources";
import { StayPlanInput, StayPlanSummary, UserProfile } from "@/types";

const stayTaskMap = {
  student: ["registration", "housing", "healthcare", "telecom", "work_school", "support"],
  worker: ["registration", "housing", "healthcare", "banking", "tax", "work_school"],
  "working-holiday": ["registration", "housing", "telecom", "banking", "support", "tax"],
  "long-stay": ["registration", "housing", "healthcare", "support", "tax", "banking"],
} as const;

const resourceMap = {
  student: ["stay_resource_001", "stay_resource_002", "stay_resource_003", "stay_resource_004"],
  worker: ["stay_resource_001", "stay_resource_002", "stay_resource_004", "stay_resource_006", "stay_resource_007"],
  "working-holiday": ["stay_resource_001", "stay_resource_004", "stay_resource_005", "stay_resource_007"],
  "long-stay": ["stay_resource_001", "stay_resource_002", "stay_resource_004", "stay_resource_005"],
} as const;

export function getDefaultStayInput(user: UserProfile): StayPlanInput {
  const stayType =
    user.visitPurpose === "study"
      ? "student"
      : user.visitPurpose === "work"
      ? "worker"
      : user.visitPurpose === "residence"
      ? "long-stay"
      : "working-holiday";

  return {
    stayType,
    entryDate: new Date().toISOString().slice(0, 10),
    hasEmployer: stayType === "worker",
    hasSchool: stayType === "student",
    housingStatus: "temporary",
    region: user.city,
    withFamily: false,
  };
}

export function buildStayPlan(input: StayPlanInput): StayPlanSummary {
  const categories = stayTaskMap[input.stayType];
  const orderedTasks = lifeChecklist
    .filter((item) => (categories as readonly string[]).includes(item.category))
    .sort((a, b) => a.order - b.order);

  const immediateTaskIds = orderedTasks.slice(0, 4).map((item) => item.id);
  const thisMonthTaskIds = orderedTasks.slice(4, 8).map((item) => item.id);
  const reminders = [
    input.housingStatus === "searching"
      ? "Keep housing questions and deposit notes together before signing anything."
      : "Save contract details and move-in notes in one place.",
    input.hasEmployer
      ? "Use official labor and tax guidance before relying on informal advice."
      : input.hasSchool
      ? "Check school, visa, and insurance documents early in your first month."
      : "Bookmark immigration and local resident support channels this week.",
    "Set a reminder to review your next official deadline before the week ends.",
  ];

  return {
    stayType: input.stayType,
    immediateTaskIds,
    thisMonthTaskIds,
    resourceIds: resourceMap[input.stayType],
    reminders,
  };
}

export function useStayPlan(input: StayPlanInput) {
  return useMemo(() => {
    const summary = buildStayPlan(input);
    const immediateTasks = lifeChecklist.filter((item) => summary.immediateTaskIds.includes(item.id));
    const thisMonthTasks = lifeChecklist.filter((item) => summary.thisMonthTaskIds.includes(item.id));
    const resources = stayResources.filter((resource) => summary.resourceIds.includes(resource.id));
    return {
      summary,
      immediateTasks,
      thisMonthTasks,
      resources,
    };
  }, [input]);
}
