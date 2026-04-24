export type HapticTone = "light" | "medium" | "success" | "warning";

const patterns: Record<HapticTone, number | number[]> = {
  light: 10,
  medium: 18,
  success: [12, 30, 16],
  warning: [20, 40, 20],
};

export function triggerHaptic(tone: HapticTone = "light") {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
    return;
  }

  navigator.vibrate(patterns[tone]);
}
