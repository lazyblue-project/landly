import { useMemo } from "react";
import { ActionCard, AppMode } from "@/types";
import { actionCards } from "@/data/action-cards";

export function useRecommendedActions(mode: AppMode): ActionCard[] {
  return useMemo(() => {
    return actionCards
      .filter((card) => card.modes.includes(mode))
      .sort((a, b) => a.priority - b.priority);
  }, [mode]);
}
