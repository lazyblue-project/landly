import { useMemo, useState } from "react";
import { careProviders } from "@/data/care-providers";
import { CareProviderCategory, Language } from "@/types";

export function useCareProviders(initialCategory: CareProviderCategory | "all" = "all") {
  const [category, setCategory] = useState<CareProviderCategory | "all">(initialCategory);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState<Language | "all">("all");
  const [internationalOnly, setInternationalOnly] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [reservationOnly, setReservationOnly] = useState(false);

  const providers = useMemo(() => {
    return careProviders.filter((provider) => {
      if (category !== "all" && provider.category !== category) return false;
      if (language !== "all" && !provider.supportedLanguages.includes(language)) return false;
      if (internationalOnly && !provider.internationalCare) return false;
      if (openNowOnly && !provider.nightHours) return false;
      if (reservationOnly && !provider.reservationSupported) return false;

      if (search) {
        const q = search.toLowerCase();
        const hay = [provider.name, provider.description, provider.district, ...provider.specialties].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [category, language, internationalOnly, openNowOnly, reservationOnly, search]);

  return {
    providers,
    category,
    setCategory,
    search,
    setSearch,
    language,
    setLanguage,
    internationalOnly,
    setInternationalOnly,
    openNowOnly,
    setOpenNowOnly,
    reservationOnly,
    setReservationOnly,
  };
}
