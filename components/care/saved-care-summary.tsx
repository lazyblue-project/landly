"use client";

import Link from "next/link";
import { careProviders } from "@/data/care-providers";
import { useAppStore } from "@/store/app-store";
import { useLocalizedText } from "@/lib/text-localizer";

export function SavedCareSummary() {
  const { savedCareProviderIds, visitPrepNotes } = useAppStore();
  const savedProviders = careProviders.filter((provider) => savedCareProviderIds.includes(provider.id));
  const { lt } = useLocalizedText();

  return (
    <div className="space-y-4 px-4 pb-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Saved care providers")}</p>
            <p className="mt-1 text-xs text-gray-500">{lt("Keep a shortlist of foreigner-friendly clinics and pharmacies.")}</p>
          </div>
          <Link href="/care?tab=providers" className="text-xs font-medium text-rose-700">{lt("Open Care")}</Link>
        </div>
        <div className="mt-3 space-y-2">
          {savedProviders.length === 0 ? (
            <p className="text-sm text-gray-500">{lt("No saved providers yet.")}</p>
          ) : (
            savedProviders.slice(0, 3).map((provider) => (
              <div key={provider.id} className="rounded-xl bg-gray-50 px-3 py-3">
                <p className="text-sm font-medium text-gray-900">{lt(provider.name)}</p>
                <p className="mt-0.5 text-xs text-gray-500">{lt(provider.district)} · {lt(provider.category)}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Visit prep notes")}</p>
            <p className="mt-1 text-xs text-gray-500">{lt("Your most recent symptom and question summaries.")}</p>
          </div>
          <Link href="/care?tab=prep" className="text-xs font-medium text-rose-700">{lt("Visit prep")}</Link>
        </div>
        <div className="mt-3 space-y-2">
          {visitPrepNotes.length === 0 ? (
            <p className="text-sm text-gray-500">{lt("No saved visit notes yet.")}</p>
          ) : (
            visitPrepNotes.slice(0, 3).map((note) => (
              <div key={note.id} className="rounded-xl bg-gray-50 px-3 py-3">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">{note.symptoms || lt("Visit prep")}</p>
                <p className="mt-0.5 text-xs text-gray-500">{lt("Saved")} {new Date(note.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
