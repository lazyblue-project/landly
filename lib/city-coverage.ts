import { careProviders } from "@/data/care-providers";
import { places } from "@/data/places";
import { shopStores } from "@/data/shop-stores";

export const onboardingCities = ["Seoul", "Busan", "Jeju", "Incheon", "Daegu", "Daejeon", "Gwangju"] as const;

export type OnboardingCity = (typeof onboardingCities)[number];
export type CityCoverageLevel = "ready" | "limited" | "preparing";

export interface CityCoverage {
  city: OnboardingCity | string;
  level: CityCoverageLevel;
  placeCount: number;
  careCount: number;
  shopCount: number;
  fallbackCity: "Seoul";
}

const readyThreshold = 8;

function includesCity(value: string, city: string) {
  return value.toLocaleLowerCase().includes(city.toLocaleLowerCase());
}

export function getCityCoverage(city: string): CityCoverage {
  const placeCount = places.filter((place) => place.city === city).length;
  const careCount = careProviders.filter((provider) => includesCity(provider.district, city)).length;
  const shopCount = city === "Seoul" ? shopStores.length : 0;
  const total = placeCount + careCount + shopCount;

  return {
    city,
    level: total >= readyThreshold ? "ready" : total > 0 ? "limited" : "preparing",
    placeCount,
    careCount,
    shopCount,
    fallbackCity: "Seoul",
  };
}

export function isCityPreparing(city: string) {
  return getCityCoverage(city).level === "preparing";
}
