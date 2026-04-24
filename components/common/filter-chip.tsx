"use client";

import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}

export function FilterChip({ label, active, onClick, className }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300",
        className
      )}
    >
      {label}
    </button>
  );
}
