export type MapProviderId = "naver" | "kakao" | "google" | "primary";

export interface MapHandoffTarget {
  id?: string;
  name: string;
  address?: string;
  district?: string;
  city?: string;
  naverMapsUrl?: string;
  googleMapsUrl?: string;
  mapLink?: string;
}

export interface MapHandoffLink {
  id: MapProviderId;
  label: string;
  href: string;
  description: string;
  source: "explicit" | "generated";
}

export interface MapPreviewPayload {
  query: string;
  displayArea: string;
  links: MapHandoffLink[];
  hasExplicitMapLink: boolean;
  safetyNote: string;
}

function compactParts(parts: Array<string | undefined>) {
  return parts.map((part) => part?.trim()).filter(Boolean) as string[];
}

export function getMapQuery(target: MapHandoffTarget) {
  return compactParts([target.name, target.address, target.district, target.city]).join(" ");
}

export function getMapDisplayArea(target: MapHandoffTarget) {
  return compactParts([target.address, target.district, target.city]).join(" · ") || target.name;
}

export function getGeneratedMapLinks(query: string): MapHandoffLink[] {
  const encodedQuery = encodeURIComponent(query);

  return [
    {
      id: "naver",
      label: "Naver Map",
      href: `https://map.naver.com/p/search/${encodedQuery}`,
      description: "Best local fallback for Korean place search.",
      source: "generated",
    },
    {
      id: "kakao",
      label: "Kakao Map",
      href: `https://map.kakao.com/?q=${encodedQuery}`,
      description: "Useful for local transit and place context.",
      source: "generated",
    },
    {
      id: "google",
      label: "Google Maps",
      href: `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
      description: "Useful when the user already uses Google Maps.",
      source: "generated",
    },
  ];
}

export function getMapPreviewPayload(target: MapHandoffTarget): MapPreviewPayload {
  const query = getMapQuery(target);
  const links = getGeneratedMapLinks(query);
  const primaryHref = target.mapLink ?? target.naverMapsUrl ?? target.googleMapsUrl;

  if (primaryHref) {
    links.unshift({
      id: "primary",
      label: "Saved map link",
      href: primaryHref,
      description: "Existing map link saved with this card.",
      source: "explicit",
    });
  }

  return {
    query,
    displayArea: getMapDisplayArea(target),
    links,
    hasExplicitMapLink: Boolean(primaryHref),
    safetyNote: "Confirm live hours, route, and exact pin in a map app before moving.",
  };
}
