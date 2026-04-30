"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Phone, RefreshCw } from "lucide-react";
import { SourceDisclosure } from "@/components/common/source-disclosure";
import { infoTrustActions } from "@/data/info-trust-actions";
import { officialSources } from "@/data/official-sources";
import { useLocalizedText } from "@/lib/text-localizer";

export function TrustChecklistBoard() {
  const { lt } = useLocalizedText();

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{lt("Action checklist by situation")}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt("Use this board when a card says demo, partner, curated, or needs confirmation.")}</p>
          </div>
          <RefreshCw size={18} className="text-gray-400" />
        </div>
        <div className="mt-4 space-y-3">
          {infoTrustActions.map((action) => (
            <article key={action.id} className="rounded-2xl bg-gray-50 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600 ring-1 ring-gray-100">{lt(action.module)}</span>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{lt(action.title)}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(action.description)}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <Link href={action.primaryHref} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-3 py-2.5 text-xs font-semibold text-white">
                  {lt(action.primaryLabel)} <ArrowRight size={14} />
                </Link>
                {action.secondaryHref ? (
                  <Link href={action.secondaryHref} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-100">
                    {lt(action.secondaryLabel ?? "Open related page")} <ArrowRight size={14} />
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">{lt("Official routes to keep close")}</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt("These are not substitutes for live official confirmation, but they keep the right number or source one tap away.")}</p>
        <div className="mt-4 space-y-3">
          {officialSources.map((source) => (
            <div key={source.id} className="rounded-2xl border border-gray-100 p-3">
              <p className="text-sm font-semibold text-gray-900">{lt(source.title)}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(source.description)}</p>
              <SourceDisclosure metadata={source.metadata} compact className="mt-3" />
              <div className="mt-3 grid grid-cols-1 gap-2">
                {source.callHref ? (
                  <a href={source.callHref} className="inline-flex items-center justify-center gap-1 rounded-2xl bg-gray-900 px-3 py-2.5 text-xs font-semibold text-white">
                    {lt("Call now")} <Phone size={13} />
                  </a>
                ) : null}
                <a href={source.primaryHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 rounded-2xl bg-white px-3 py-2.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                  {lt(source.primaryLabel)} <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
