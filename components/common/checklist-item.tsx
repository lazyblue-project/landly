"use client";

import { CheckCircle2, Circle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useState } from "react";
import { LifeChecklistItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLocalizedText } from "@/lib/text-localizer";

const difficultyColor: Record<string, string> = {
  easy: "bg-green-50 text-green-700",
  medium: "bg-yellow-50 text-yellow-700",
  hard: "bg-red-50 text-red-700",
};

interface ChecklistItemProps {
  item: LifeChecklistItem;
  isCompleted: boolean;
  onToggle: () => void;
}

export function ChecklistItem({ item, isCompleted, onToggle }: ChecklistItemProps) {
  const [expanded, setExpanded] = useState(false);
  const { lt } = useLocalizedText();

  return (
    <div className={cn("bg-white rounded-2xl border transition-all", isCompleted ? "border-green-200 opacity-75" : "border-gray-100")}>
      <div className="flex items-start gap-3 p-4">
        <button onClick={onToggle} className="shrink-0 mt-0.5">
          {isCompleted ? <CheckCircle2 size={22} className="text-green-500" /> : <Circle size={22} className="text-gray-300" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={cn("text-sm font-semibold", isCompleted ? "line-through text-gray-400" : "text-gray-900")}>{lt(item.title)}</p>
            <Badge className={cn("text-xs shrink-0", difficultyColor[item.difficulty])}>{lt(item.difficulty)}</Badge>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{lt(item.description)}</p>
          <p className="text-xs text-gray-400 mt-1">⏱ {lt(item.estimatedTime)}</p>
        </div>

        <button onClick={() => setExpanded((v) => !v)} className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
          {item.requiredDocuments.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">{lt("Required documents")}</p>
              <ul className="space-y-0.5">
                {item.requiredDocuments.map((doc) => <li key={doc} className="text-xs text-gray-600 flex items-start gap-1.5"><span className="text-gray-400 mt-0.5">•</span>{lt(doc)}</li>)}
              </ul>
            </div>
          )}
          {item.tips.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">{lt("Tips")}</p>
              <ul className="space-y-0.5">
                {item.tips.map((tip) => <li key={tip} className="text-xs text-gray-600 flex items-start gap-1.5"><span className="text-blue-400 mt-0.5">→</span>{lt(tip)}</li>)}
              </ul>
            </div>
          )}
          {item.links.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">{lt("Official links")}</p>
              <div className="space-y-2">
                {item.links.map((link) => (
                  <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700 transition-colors hover:bg-blue-100">
                    <span className="font-medium">{lt(link.label)}</span>
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
