"use client";

import { Languages } from "lucide-react";
import { emergencySupportRoutes } from "@/data/emergency-support-routes";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

export function EmergencyScriptPanel() {
  const { lt } = useLocalizedText();
  const showSnackbar = useAppStore((state) => state.showSnackbar);

  const copyScript = async (script: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(script);
      showSnackbar(lt("Emergency phrase copied."), "success");
    }
  };

  return (
    <section className="px-4 pb-4">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-gray-50 p-2 text-gray-700">
            <Languages size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Emergency show-to-staff scripts")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt("Keep these short. Show one phrase first, then call the right number.")}</p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {emergencySupportRoutes.slice(0, 4).map((route) => (
            <div key={route.id} className="rounded-2xl bg-gray-50 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500">{lt(route.title)} · {route.number}</p>
                  <p className="mt-1 text-base font-bold text-gray-950">{route.koreanScript}</p>
                  <p className="mt-1 text-xs text-gray-500">{lt(route.englishScript)}</p>
                </div>
                <button type="button" onClick={() => copyScript(`${route.koreanScript}\n${route.englishScript}`)} className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700">
                  {lt("Copy")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
