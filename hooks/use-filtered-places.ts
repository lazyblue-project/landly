import { useEffect, useMemo, useState } from "react";
import { Language, Place, PlaceCategory, PlaceFilter } from "@/types";
import { places as allPlaces } from "@/data/places";

const defaultFilter: PlaceFilter = {
  languages: [],
  foreignCardSupported: false,
  reservationSupported: false,
  lateNight: false,
  soloFriendly: false,
};

export function useFilteredPlaces(
  initialCategory?: PlaceCategory,
  initialLanguages: Language[] = []
) {
  const [category, setCategory] = useState<PlaceCategory | "all">(
    initialCategory ?? "all"
  );
  const [filter, setFilter] = useState<PlaceFilter>({
    ...defaultFilter,
    languages: initialLanguages,
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    setCategory(initialCategory ?? "all");
  }, [initialCategory]);

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      languages: initialLanguages,
    }));
  }, [initialLanguages.join("|")]);

  const filtered = useMemo(() => {
    return allPlaces.filter((place: Place) => {
      if (category !== "all" && place.category !== category) return false;

      if (
        search &&
        !place.name.toLowerCase().includes(search.toLowerCase()) &&
        !place.description.toLowerCase().includes(search.toLowerCase()) &&
        !place.address.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      if (
        filter.languages.length > 0 &&
        !filter.languages.some((lang) =>
          place.supportedLanguages.includes(lang)
        )
      ) {
        return false;
      }

      if (filter.foreignCardSupported && !place.foreignCardSupported) return false;
      if (filter.reservationSupported && !place.reservationSupported) return false;
      if (filter.lateNight && !place.lateNight) return false;
      if (filter.soloFriendly && !place.soloFriendly) return false;

      return true;
    });
  }, [category, filter, search]);

  const toggleFilter = (key: keyof Omit<PlaceFilter, "languages">) => {
    setFilter((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleLanguage = (language: Language) => {
    setFilter((prev) => {
      const hasLanguage = prev.languages.includes(language);
      return {
        ...prev,
        languages: hasLanguage
          ? prev.languages.filter((item) => item !== language)
          : [...prev.languages, language],
      };
    });
  };

  return {
    places: filtered,
    category,
    setCategory,
    filter,
    setFilter,
    toggleFilter,
    toggleLanguage,
    search,
    setSearch,
  };
}
