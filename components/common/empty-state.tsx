"use client";

import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  const { lt } = useLocalizedText();

  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      {icon ? <div className="mb-4 text-gray-300">{icon}</div> : null}
      <p className="text-sm font-semibold text-gray-600">{lt(title)}</p>
      {description ? <p className="mt-1 max-w-xs text-xs text-gray-400">{lt(description)}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
