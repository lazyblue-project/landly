import { CalendarDays, HeartPulse, LifeBuoy, ShieldAlert, ShoppingBag, UserRound, Award, Megaphone } from "lucide-react";

export const moreMenuSections = [
  {
    title: "Travel tools",
    description: "Keep your trip admin, receipts, health, and help close at hand.",
    items: [
      { href: "/calendar", label: "Calendar", description: "See your saved route plans and daily events.", icon: CalendarDays },
      { href: "/stamps", label: "Stamps", description: "Track official goals and your own Korea achievements.", icon: Award },
      { href: "/promotions", label: "Promotions", description: "Current and upcoming events, interest, booking, and saved schedules.", icon: Megaphone },
      { href: "/shop", label: "Shop", description: "Tax refund, receipt locker, and store discovery.", icon: ShoppingBag },
      { href: "/care", label: "Care", description: "Medical triage, clinics, and pharmacy help.", icon: HeartPulse },
      { href: "/sos", label: "SOS", description: "Fast access to emergency numbers and help actions.", icon: ShieldAlert },
    ],
  },
  {
    title: "Living in Korea",
    description: "Organize long-stay tasks and your saved profile tools.",
    items: [
      { href: "/stay", label: "Stay", description: "Plans, deadlines, document vault, and guides.", icon: LifeBuoy },
      { href: "/my", label: "My", description: "Saved places, phrases, and personal setup.", icon: UserRound },
    ],
  },
] as const;
