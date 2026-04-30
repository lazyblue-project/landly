import { Award, BadgePercent, CalendarDays, HeartPulse, Languages, LifeBuoy, MapPin, Megaphone, ShieldAlert, ShieldCheck, ShoppingBag, UserRound, WifiOff } from "lucide-react";

export const moreMenuSections = [
  {
    title: "Travel tools",
    description: "Keep your trip admin, receipts, health, and help close at hand.",
    items: [
      { href: "/assistant", label: "Language kit", description: "Save essential Korean phrases and show-cards.", icon: Languages },
      { href: "/navigate", label: "Map handoff", description: "Open Google Maps, NAVER Map, Korean phrases, and route backups from one place.", icon: MapPin },
      { href: "/offline", label: "Offline kit", description: "Emergency numbers, show-cards, routes, receipts, and documents for weak signal moments.", icon: WifiOff },
      { href: "/calendar", label: "Calendar", description: "See your saved route plans and daily events.", icon: CalendarDays },
      { href: "/stamps", label: "Stamps", description: "Track official goals and your own Korea achievements.", icon: Award },
      { href: "/promotions", label: "Promotions", description: "Current and upcoming events, interest, booking, and saved schedules.", icon: Megaphone },
      { href: "/partners", label: "Partner offers", description: "Coupons, booking pilots, and referral-ready service lanes.", icon: BadgePercent },
      { href: "/trust", label: "Trust Center", description: "Official sources, confirmation status, and safer action checks.", icon: ShieldCheck },
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
