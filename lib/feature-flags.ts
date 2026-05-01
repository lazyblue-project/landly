export function isBetaToolsEnabled(isBetaTester = false) {
  return process.env.NEXT_PUBLIC_ENABLE_BETA_TOOLS === "true" || isBetaTester;
}

export function isPartnerOffersEnabled(isBetaTester = false) {
  return process.env.NEXT_PUBLIC_ENABLE_PARTNERS === "true" || isBetaTester;
}

export function isFeedbackApiEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_FEEDBACK_API === "true";
}

export function isAdminToolsEnabled(isBetaTester = false) {
  return process.env.NEXT_PUBLIC_ENABLE_ADMIN_TOOLS === "true" || isBetaToolsEnabled(isBetaTester);
}

export function isLaunchToolsEnabled(isBetaTester = false) {
  return process.env.NEXT_PUBLIC_ENABLE_LAUNCH_TOOLS === "true" || isAdminToolsEnabled(isBetaTester);
}

export function isTriageToolsEnabled(isBetaTester = false) {
  return process.env.NEXT_PUBLIC_ENABLE_TRIAGE_TOOLS === "true" || isAdminToolsEnabled(isBetaTester);
}
