import { ChecklistCategory, StayDocument, StayPlanInput, StayType } from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;

export type StayCheckpointStatus = "overdue" | "due-soon" | "upcoming" | "ready";

export interface StayCheckpoint {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  offsetDays: number;
  category: ChecklistCategory;
  href: string;
  priority: "high" | "medium" | "low";
}

export interface StayDocumentTemplate {
  id: string;
  title: string;
  category: StayDocument["category"];
  note: string;
  tags: string[];
  recommendedFor: StayType[];
}

function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(value: Date): string {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

export function addDays(dateString: string, days: number): string {
  const date = parseDate(dateString || formatDate(new Date()));
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function daysBetween(fromDate: string, toDate: string): number {
  return Math.ceil((parseDate(toDate).getTime() - parseDate(fromDate).getTime()) / DAY_MS);
}

export function getTodayString(): string {
  return formatDate(new Date());
}

function stayTypeLabel(stayType: StayType): string {
  if (stayType === "working-holiday") return "working holiday";
  if (stayType === "long-stay") return "long stay";
  return stayType;
}

export function getCheckpointStatus(dueDate: string): StayCheckpointStatus {
  const diff = daysBetween(getTodayString(), dueDate);
  if (diff < 0) return "overdue";
  if (diff <= 7) return "due-soon";
  if (diff <= 30) return "ready";
  return "upcoming";
}

export function getCheckpointStatusLabel(status: StayCheckpointStatus): string {
  if (status === "overdue") return "Overdue";
  if (status === "due-soon") return "Due soon";
  if (status === "ready") return "Prepare now";
  return "Upcoming";
}

export function buildStayCheckpoints(input: StayPlanInput): StayCheckpoint[] {
  const entryDate = input.entryDate || getTodayString();
  const common: StayCheckpoint[] = [
    {
      id: "stay_checkpoint_contact",
      title: "Save official support contacts",
      description: "Keep 1345, local resident support, and emergency routes one tap away before you need them.",
      dueDate: addDays(entryDate, 1),
      offsetDays: 1,
      category: "support",
      href: "/stay?tab=guides",
      priority: "high",
    },
    {
      id: "stay_checkpoint_housing",
      title: "Secure housing proof and address notes",
      description: input.housingStatus === "searching"
        ? "List the questions to ask before deposit, contract, and move-in decisions."
        : "Keep address proof, contract notes, and move-in details ready for official processes.",
      dueDate: addDays(entryDate, 3),
      offsetDays: 3,
      category: "housing",
      href: "/stay?tab=documents",
      priority: "high",
    },
    {
      id: "stay_checkpoint_registration",
      title: "Decide your registration path",
      description: `Use your ${stayTypeLabel(input.stayType)} profile to check which residence or registration process applies.`,
      dueDate: addDays(entryDate, 7),
      offsetDays: 7,
      category: "registration",
      href: "/stay?tab=checklist&category=registration",
      priority: "high",
    },
    {
      id: "stay_checkpoint_booking",
      title: "Book or prepare the official appointment",
      description: "Appointment slots and documents can take time, so do not wait until the final week.",
      dueDate: addDays(entryDate, 14),
      offsetDays: 14,
      category: "registration",
      href: "/stay?tab=guides",
      priority: "high",
    },
    {
      id: "stay_checkpoint_phone_bank",
      title: "Unblock phone and banking setup",
      description: "Local phone number and banking access affect payments, school/work requests, and many Korean apps.",
      dueDate: addDays(entryDate, 21),
      offsetDays: 21,
      category: "banking",
      href: "/stay?tab=checklist&category=banking",
      priority: "medium",
    },
    {
      id: "stay_checkpoint_health",
      title: "Check insurance and clinic basics",
      description: "Know how you will pay for care and where to go before you actually get sick.",
      dueDate: addDays(entryDate, 30),
      offsetDays: 30,
      category: "healthcare",
      href: "/care",
      priority: "medium",
    },
    {
      id: "stay_checkpoint_status",
      title: "Review work, school, or family status documents",
      description: input.hasEmployer
        ? "Keep employment contract, income, and work-condition notes organized."
        : input.hasSchool
        ? "Keep school, enrollment, insurance, and dorm or housing documents together."
        : input.withFamily
        ? "Keep family-related support documents and dependent notes easy to find."
        : "Keep status documents together so official requests do not become urgent later.",
      dueDate: addDays(entryDate, 45),
      offsetDays: 45,
      category: "work_school",
      href: "/stay?tab=documents",
      priority: "medium",
    },
    {
      id: "stay_checkpoint_tax",
      title: "Review tax, labor, and renewal basics",
      description: "Before the three-month mark, save the official routes that may affect work, tax, insurance, or renewal.",
      dueDate: addDays(entryDate, 75),
      offsetDays: 75,
      category: input.hasEmployer ? "tax" : "support",
      href: input.hasEmployer ? "/stay?tab=checklist&category=tax" : "/stay?tab=guides",
      priority: "medium",
    },
    {
      id: "stay_checkpoint_90day",
      title: "Final 90-day residence deadline check",
      description: "Make sure you have not missed any registration, address, insurance, or required status step.",
      dueDate: addDays(entryDate, 90),
      offsetDays: 90,
      category: "registration",
      href: "/stay?tab=checklist&category=registration",
      priority: "high",
    },
  ];

  return common.sort((a, b) => a.offsetDays - b.offsetDays);
}

export const stayDocumentTemplates: StayDocumentTemplate[] = [
  {
    id: "stay_template_passport",
    title: "Passport copy and entry note",
    category: "passport",
    note: "Keep passport number, entry date, and a copy location note. Do not store sensitive images in a shared phone.",
    tags: ["passport", "identity", "entry"],
    recommendedFor: ["student", "worker", "working-holiday", "long-stay"],
  },
  {
    id: "stay_template_residence",
    title: "Residence Card / ARC application set",
    category: "residence",
    note: "Track appointment receipt, application form, photo, fee, and address proof.",
    tags: ["residence", "registration", "arc"],
    recommendedFor: ["student", "worker", "working-holiday", "long-stay"],
  },
  {
    id: "stay_template_contract",
    title: "Housing contract and address proof",
    category: "contract",
    note: "Save contract date, deposit notes, landlord contact, and move-in confirmation.",
    tags: ["housing", "contract", "address"],
    recommendedFor: ["student", "worker", "working-holiday", "long-stay"],
  },
  {
    id: "stay_template_insurance",
    title: "Health insurance and clinic note",
    category: "insurance",
    note: "Track insurance status, payment route, clinic preference, and emergency contact.",
    tags: ["insurance", "nhis", "clinic"],
    recommendedFor: ["student", "worker", "working-holiday", "long-stay"],
  },
  {
    id: "stay_template_school",
    title: "School enrollment and dorm documents",
    category: "school",
    note: "Save enrollment certificate, student ID notes, dorm contract, and school support office route.",
    tags: ["school", "student", "dorm"],
    recommendedFor: ["student"],
  },
  {
    id: "stay_template_work",
    title: "Employment contract and pay note",
    category: "work",
    note: "Save contract date, employer contact, payday, tax, and labor support notes.",
    tags: ["work", "employment", "labor"],
    recommendedFor: ["worker", "working-holiday"],
  },
  {
    id: "stay_template_tax",
    title: "Tax and income timeline note",
    category: "tax",
    note: "Keep year-end tax adjustment, income, and official support route notes together.",
    tags: ["tax", "income", "deadline"],
    recommendedFor: ["worker", "working-holiday", "long-stay"],
  },
];

export function getRecommendedDocumentTemplates(stayType: StayType): StayDocumentTemplate[] {
  return stayDocumentTemplates.filter((template) => template.recommendedFor.includes(stayType));
}

export function getDocumentReadinessLabel(document: StayDocument): string {
  if (document.expiryDate) {
    const daysLeft = daysBetween(getTodayString(), document.expiryDate);
    if (daysLeft < 0) return "Expired";
    if (daysLeft <= 30) return "Expires soon";
  }
  if (!document.issueDate && !document.expiryDate && !document.fileName) return "Needs details";
  return "Ready";
}

export function getDocumentReadinessTone(document: StayDocument): string {
  const label = getDocumentReadinessLabel(document);
  if (label === "Expired") return "bg-rose-50 text-rose-700";
  if (label === "Expires soon") return "bg-amber-50 text-amber-700";
  if (label === "Needs details") return "bg-gray-100 text-gray-600";
  return "bg-emerald-50 text-emerald-700";
}
