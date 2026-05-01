"use client";

import { Moon, Monitor, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getLandlyThemeMode,
  LandlyThemeMode,
  setLandlyThemeMode,
} from "@/components/layout/theme-sync";
import { useLocalizedText } from "@/lib/text-localizer";
import { useAppStore } from "@/store/app-store";

const themeOptions: Array<{
  value: LandlyThemeMode;
  label: string;
  description: string;
  icon: typeof Sun;
}> = [
  {
    value: "system",
    label: "System",
    description: "Follow this device setting",
    icon: Monitor,
  },
  {
    value: "light",
    label: "Light",
    description: "Keep bright daytime UI",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Reduce glare at night",
    icon: Moon,
  },
];

export function ThemePreferenceCard() {
  const { lt } = useLocalizedText();
  const showSnackbar = useAppStore((state) => state.showSnackbar);
  const [mode, setMode] = useState<LandlyThemeMode>("system");

  useEffect(() => {
    setMode(getLandlyThemeMode());
  }, []);

  const handleSelect = (nextMode: LandlyThemeMode) => {
    setLandlyThemeMode(nextMode);
    setMode(nextMode);
    showSnackbar(`${lt("Appearance updated")} · ${lt(themeOptions.find((item) => item.value === nextMode)?.label ?? "System")}`, "success");
  };

  return (
    <section className="px-4 pb-4">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div>
          <p className="text-sm font-bold text-gray-950">{lt("Appearance")}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            {lt("Choose a comfortable display mode for airport, night, or outdoor use.")}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const selected = mode === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={[
                  "rounded-2xl border px-3 py-3 text-left transition-colors",
                  selected
                    ? "border-sky-200 bg-sky-50 text-sky-800 ring-1 ring-sky-100"
                    : "border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                <Icon size={16} />
                <p className="mt-2 text-xs font-bold">{lt(option.label)}</p>
                <p className="mt-1 text-[10px] leading-snug opacity-75">{lt(option.description)}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
