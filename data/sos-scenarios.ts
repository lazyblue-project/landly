export interface SosScenario {
  id: string;
  title: string;
  summary: string;
  severity: "urgent" | "soon" | "help";
  actions: Array<{ label: string; href: string; type: "link" | "tel" }>;
  steps: string[];
  phraseIds: string[];
}

export const sosScenarios: SosScenario[] = [
  {
    id: "medical-emergency",
    title: "Medical emergency",
    summary: "Use this when breathing, bleeding, chest pain, fainting, or severe injury may be involved.",
    severity: "urgent",
    actions: [
      { label: "Call ambulance 119", href: "tel:119", type: "tel" },
      { label: "Open emergency phrases", href: "/assistant?category=emergency", type: "link" },
      { label: "Open Care triage", href: "/care?tab=triage", type: "link" },
    ],
    steps: [
      "Call 119 immediately if symptoms feel severe or unsafe.",
      "Show the emergency Korean phrase in large mode to someone nearby.",
      "Keep your location, passport name, allergies, and medication notes ready.",
    ],
    phraseIds: ["phrase_013", "phrase_036", "phrase_037"],
  },
  {
    id: "lost-phone-wallet",
    title: "Lost phone, wallet, or passport",
    summary: "Lock cards first, explain the lost item, then ask where to file a report.",
    severity: "urgent",
    actions: [
      { label: "Call police 112", href: "tel:112", type: "tel" },
      { label: "Lost item phrases", href: "/assistant?category=lost_complaint", type: "link" },
      { label: "Tourist hotline 1330", href: "tel:1330", type: "tel" },
    ],
    steps: [
      "Lock your cards or phone account first if payment or identity risk exists.",
      "Use a large Korean phrase to explain what you lost and where you last saw it.",
      "If it may be on public transport, ask station or terminal staff before leaving the area.",
    ],
    phraseIds: ["phrase_012", "phrase_033", "phrase_034", "phrase_035"],
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
      "If breathing, chest pain, fainting, or heavy bleeding is involved, call 119 immediately.",
      "For mild symptoms, use Landly Care to decide between pharmacy and clinic.",
      "Save or show your symptom phrase before you travel so you can reopen it quickly.",
    ],
    phraseIds: ["phrase_010", "phrase_030", "phrase_031", "phrase_018"],
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
    phraseIds: ["phrase_001", "phrase_027", "phrase_028"],
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
    phraseIds: ["phrase_024", "phrase_025", "phrase_026", "phrase_039"],
  },
];
