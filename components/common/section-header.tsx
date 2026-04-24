"use client";

import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  const { lt } = useLocalizedText();

  return (
    <div className={cn("mb-3 flex items-start justify-between", className)}>
      <div>
        <h2 className="text-base font-semibold text-gray-900">{lt(title)}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-gray-500">{lt(subtitle)}</p> : null}
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  );
}
