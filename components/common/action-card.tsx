"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  Car,
  Cross,
  FileText,
  HeartPulse,
  MessageSquareText,
  Plane,
  Receipt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  ShieldAlert,
  Utensils,
  UtensilsCrossed,
  LucideIcon,
} from "lucide-react";
import { ActionCard as ActionCardType } from "@/types";
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";

const iconMap: Record<string, LucideIcon> = {
  Plane,
  Utensils,
  UtensilsCrossed,
  Car,
  FileText,
  AlertTriangle,
  Smartphone,
  Cross,
  Building2,
  ShoppingBag,
  HeartPulse,
  MessageSquareText,
  Receipt,
  Store,
  CalendarDays,
  Sparkles,
  Siren: ShieldAlert,
};

const categoryColors: Record<string, string> = {
  arrival: "bg-blue-50 text-blue-600",
  food: "bg-orange-50 text-orange-600",
  transport: "bg-purple-50 text-purple-600",
  pass: "bg-sky-50 text-sky-600",
  admin: "bg-gray-50 text-gray-600",
  emergency: "bg-red-50 text-red-600",
  lifestyle: "bg-teal-50 text-teal-600",
  health: "bg-green-50 text-green-600",
  accommodation: "bg-yellow-50 text-yellow-600",
};

interface ActionCardProps {
  card: ActionCardType;
  className?: string;
}

export function ActionCard({ card, className }: ActionCardProps) {
  const Icon = iconMap[card.icon] ?? Plane;
  const colorClass = categoryColors[card.category] ?? "bg-gray-50 text-gray-600";
  const { lt } = useLocalizedText();

  return (
    <Link href={card.href} className={cn("flex items-start gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow active:scale-[0.98]", className)}>
      <div className={cn("shrink-0 p-2.5 rounded-xl", colorClass)}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 leading-snug">{lt(card.title)}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{lt(card.description)}</p>
      </div>
    </Link>
  );
}
