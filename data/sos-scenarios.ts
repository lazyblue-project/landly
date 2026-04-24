export interface SosScenario {
  id: string;
  title: string;
  summary: string;
  severity: "urgent" | "soon" | "help";
  actions: Array<{ label: string; href: string; type: "link" | "tel" }>;
  steps: string[];
}

export const sosScenarios: SosScenario[] = [
  {
    id: "lost-phone-wallet",
    title: "Lost phone or wallet",
    summary: "Get your phrases, open the nearest police help path, and keep the next steps in one place.",
    severity: "urgent",
    actions: [
      { label: "Call police 112", href: "tel:112", type: "tel" },
      { label: "Lost item phrases", href: "/assistant?category=lost_complaint", type: "link" },
      { label: "Support lines", href: "/care?tab=help", type: "link" },
    ],
    steps: [
      "Lock your cards or phone account first if payment or identity risk exists.",
      "Use Landly phrases to explain where you last saw the item and what was inside.",
      "If it may be on public transport, ask station or terminal staff before leaving the area.",
    ],
  },
  {
    id: "late-night-sick",
    title: "Sick late at night",
    summary: "Separate emergency signs from pharmacy-level symptoms and get to the right next step faster.",
    severity: "urgent",
    actions: [
      { label: "Open symptom triage", href: "/care?tab=triage", type: "link" },
      { label: "Find pharmacy", href: "/explore?category=pharmacy", type: "link" },
      { label: "Call ambulance 119", href: "tel:119", type: "tel" },
    ],
    steps: [
      "If breathing, chest pain, or heavy bleeding is involved, call 119 immediately.",
      "For mild symptoms, use Landly Care to decide between pharmacy and clinic.",
      "Save the provider or note before you travel so you can reopen it quickly.",
    ],
  },
  {
    id: "missed-last-train",
    title: "Missed the last train",
    summary: "Switch from rail to taxi or night-safe navigation with less panic and fewer taps.",
    severity: "soon",
    actions: [
      { label: "Open taxi phrases", href: "/assistant?category=taxi", type: "link" },
      { label: "Open Pass launchers", href: "/pass?tab=launchers", type: "link" },
      { label: "Tourist hotline 1330", href: "tel:1330", type: "tel" },
    ],
    steps: [
      "Check if your destination is better by taxi or airport bus rather than waiting around.",
      "Use show mode phrases for drivers if your destination is difficult to pronounce.",
      "Save the route or lodging address before you leave the station area.",
    ],
  },
  {
    id: "paperwork-deadline",
    title: "Paperwork deadline is close",
    summary: "Go straight to the document note, plan, and official guide instead of hunting across tabs.",
    severity: "help",
    actions: [
      { label: "Open Stay plan", href: "/stay?tab=plan", type: "link" },
      { label: "Open document vault", href: "/stay?tab=documents", type: "link" },
      { label: "Open guides", href: "/stay?tab=guides", type: "link" },
    ],
    steps: [
      "Capture what document, appointment, or contract is at risk first.",
      "Save the note in Landly Stay so the next action is visible even if the file lives elsewhere.",
      "Use the official guide card for the latest source before visiting an office.",
    ],
  },
];
