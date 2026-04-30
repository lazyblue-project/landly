"use client";

import Link from "next/link";
import { useLocalizedText } from "@/lib/text-localizer";

const actions = [
  { href: "/sos", title: "Emergency help", description: "Open 119, 112, 1330, and large Korean emergency phrases." },
  { href: "/care?tab=triage", title: "Check symptoms", description: "Use this only after checking emergency signs first." },
  { href: "/care?tab=providers", title: "Find clinic or pharmacy", description: "Search foreigner-friendly providers by type and language." },
  { href: "/care?tab=prep", title: "Prepare visit note", description: "Collect symptoms, allergies, medicine, insurance, and language needs." },
  { href: "/care?tab=phrases", title: "Medical phrases", description: "Show emergency, pharmacy, allergy, and reception phrases quickly." },
  { href: "/care?tab=help", title: "Official support lines", description: "Open 119, 1339, 1330, and support resources from one place." },
];

export function CareQuickActions() {
  const { lt } = useLocalizedText();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {actions.map((action) => (
        <Link key={action.href} href={action.href} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">{lt(action.title)}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(action.description)}</p>
        </Link>
      ))}
    </div>
  );
}
