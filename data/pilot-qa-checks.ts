import type { PilotQaCheck } from "@/types";

export const pilotQaChecks: PilotQaCheck[] = [
  {
    id: "qa_install_home",
    category: "setup",
    title: "Open Home after a fresh install",
    description: "Confirm the app loads cleanly after clearing localStorage or opening in a private mobile browser.",
    required: true,
    href: "/",
  },
  {
    id: "qa_onboarding_complete",
    category: "journey",
    title: "Complete onboarding and check the launch preview",
    description: "Finish onboarding once and confirm the recommended Home action matches the first stated need.",
    required: true,
    href: "/onboarding",
  },
  {
    id: "qa_offline_core",
    category: "offline",
    title: "Verify offline core pages",
    description: "Turn the network off and reload Offline, SOS, Assistant, Navigate, and Test from the cached app shell.",
    required: true,
    href: "/offline",
  },
  {
    id: "qa_emergency_source",
    category: "trust",
    title: "Check emergency source labels",
    description: "Confirm SOS numbers show official-source and freshness labels before any commercial or partner content.",
    required: true,
    href: "/sos",
  },
  {
    id: "qa_partner_disclosure",
    category: "commercial",
    title: "Confirm partner disclosure gate",
    description: "Open one partner offer and confirm Send interest requires disclosure acknowledgment first.",
    required: true,
    href: "/partners",
  },
  {
    id: "qa_feedback_report",
    category: "handoff",
    title: "Export one feedback report",
    description: "Save at least one feedback note, then copy or download the report before sharing tester results.",
    required: false,
    href: "/test#feedback-report",
  },
];
