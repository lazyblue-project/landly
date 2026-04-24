"use client";

import { Navigation, Route } from "lucide-react";
import { BottomSheet } from "@/components/common/bottom-sheet";
import { useLocalizedText } from "@/lib/text-localizer";

interface MapAppPickerSheetProps {
  open: boolean;
  title?: string;
  googleMapsUrl?: string;
  naverMapUrl?: string;
  onClose: () => void;
}

export function MapAppPickerSheet({ open, title = "Open route", googleMapsUrl, naverMapUrl, onClose }: MapAppPickerSheetProps) {
  const { lt } = useLocalizedText();
  const openUrl = (url?: string) => { if (!url) return; window.open(url, "_blank", "noopener,noreferrer"); onClose(); };

  return (
    <BottomSheet open={open} onClose={onClose} title={title} description="Choose which map app should open this route.">
      <div className="space-y-3">
        <button type="button" onClick={() => openUrl(googleMapsUrl)} className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50">
          <div><p className="text-sm font-semibold text-gray-900">{lt("Open in Google Maps")}</p><p className="mt-1 text-xs text-gray-500">{lt("Great for browser directions and sharing.")}</p></div>
          <Route size={18} className="text-sky-600" />
        </button>
        <button type="button" onClick={() => openUrl(naverMapUrl)} className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50">
          <div><p className="text-sm font-semibold text-gray-900">{lt("Open in NAVER Map app")}</p><p className="mt-1 text-xs text-gray-500">{lt("Helpful when you want a Korea-first navigation app.")}</p></div>
          <Navigation size={18} className="text-emerald-600" />
        </button>
      </div>
    </BottomSheet>
  );
}
