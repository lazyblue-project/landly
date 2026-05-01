export function isBetaToolsEnabled(isBetaTester = false) {
  return process.env.NEXT_PUBLIC_ENABLE_BETA_TOOLS === "true" || isBetaTester;
}

export function isPartnerOffersEnabled(isBetaTester = false) {
  return process.env.NEXT_PUBLIC_ENABLE_PARTNERS === "true" || isBetaTester;
}
