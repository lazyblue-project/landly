import { CareProvider, PassOption, Place, ShopStore, StayResource, TransitOption, TrustBadge } from "@/types";

function push(badges: TrustBadge[], badge: TrustBadge | null) {
  if (badge) badges.push(badge);
}

export function getPlaceTrustBadges(place: Place) {
  const badges: TrustBadge[] = [];
  push(badges, place.supportedLanguages.includes("en") ? { id: `${place.id}_lang`, label: "English-friendly", tone: "sky" } : null);
  push(badges, place.foreignCardSupported ? { id: `${place.id}_card`, label: "Foreign card OK", tone: "emerald" } : null);
  push(badges, place.reservationSupported ? { id: `${place.id}_reservation`, label: "Reservation ready", tone: "violet" } : null);
  push(badges, place.lateNight ? { id: `${place.id}_late`, label: "Open late", tone: "amber" } : null);
  push(badges, place.soloFriendly ? { id: `${place.id}_solo`, label: "Solo-friendly", tone: "gray" } : null);
  return badges.slice(0, 4);
}

export function getCareTrustBadges(provider: CareProvider) {
  const badges: TrustBadge[] = [];
  push(badges, provider.supportedLanguages.includes("en") ? { id: `${provider.id}_lang`, label: "English-friendly", tone: "sky" } : null);
  push(badges, provider.internationalCare ? { id: `${provider.id}_international`, label: "Foreigner-ready", tone: "emerald" } : null);
  push(badges, provider.reservationSupported ? { id: `${provider.id}_reservation`, label: "Reservation", tone: "violet" } : null);
  push(badges, provider.nightHours ? { id: `${provider.id}_late`, label: "Open late", tone: "amber" } : null);
  push(badges, provider.touristFriendly || provider.residentSupportFriendly ? { id: `${provider.id}_support`, label: "Support aware", tone: "gray" } : null);
  return badges.slice(0, 4);
}

export function getShopTrustBadges(store: ShopStore) {
  const badges: TrustBadge[] = [];
  push(badges, store.supportedLanguages.includes("en") ? { id: `${store.id}_lang`, label: "English-friendly", tone: "sky" } : null);
  push(badges, store.foreignCardSupported ? { id: `${store.id}_card`, label: "Foreign card OK", tone: "emerald" } : null);
  push(badges, store.refundType !== "unknown" ? { id: `${store.id}_refund`, label: "Refund support", tone: "violet" } : null);
  push(badges, store.passportNeededAtCheckout ? { id: `${store.id}_passport`, label: "Passport needed", tone: "amber" } : null);
  return badges.slice(0, 4);
}

export function getStayResourceTrustBadges(resource: StayResource) {
  const badges: TrustBadge[] = [];
  push(badges, ["immigration", "nhis", "tax", "labor", "support-center"].includes(resource.type)
    ? { id: `${resource.id}_official`, label: "Official route", tone: "emerald" }
    : { id: `${resource.id}_guide`, label: "Trusted guide", tone: "sky" });
  push(badges, resource.contactValue ? { id: `${resource.id}_contact`, label: "Direct contact", tone: "gray" } : null);
  push(badges, resource.link ? { id: `${resource.id}_link`, label: "Open link", tone: "violet" } : null);
  return badges.slice(0, 3);
}

export function getTransitTrustBadges(option: TransitOption) {
  const badges: TrustBadge[] = [];
  push(badges, option.luggageFriendly ? { id: `${option.id}_luggage`, label: "Luggage-friendly", tone: "emerald" } : null);
  push(badges, option.nightFriendly ? { id: `${option.id}_night`, label: "Night-friendly", tone: "amber" } : null);
  push(badges, option.type === "airport-rail" || option.type === "limousine-bus"
    ? { id: `${option.id}_official`, label: "Official route type", tone: "sky" }
    : { id: `${option.id}_flex`, label: "Flexible fallback", tone: "gray" });
  return badges.slice(0, 3);
}

export function getPassTrustBadges(passOption: PassOption | null) {
  if (!passOption) return [];
  const badges: TrustBadge[] = [];
  push(badges, passOption.type === "tmoney" ? { id: `${passOption.id}_simple`, label: "Safe default", tone: "emerald" } : null);
  push(badges, passOption.type === "korail-pass" ? { id: `${passOption.id}_intercity`, label: "Intercity-ready", tone: "sky" } : null);
  push(badges, passOption.type === "climate-card" ? { id: `${passOption.id}_city`, label: "City-transit fit", tone: "violet" } : null);
  push(badges, passOption.type === "single-ride" ? { id: `${passOption.id}_light`, label: "Low-commitment", tone: "gray" } : null);
  return badges.slice(0, 3);
}
