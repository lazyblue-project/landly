"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw, ShieldAlert } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Landly route error", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-gray-50 px-4 py-8">
      <section className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-amber-50 p-3 text-amber-700 ring-1 ring-amber-100">
            <AlertTriangle size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Safe fallback</p>
            <h1 className="mt-1 text-xl font-bold text-gray-950">Something went wrong</h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Landly could not load this screen. Try again, or jump to Home or SOS if you need immediate help.
            </p>
            {error.digest ? <p className="mt-2 text-[11px] font-semibold text-gray-400">Error digest · {error.digest}</p> : null}
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white"
          >
            <RotateCcw size={16} />
            Try again
          </button>
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800">
            <Home size={16} />
            Go to Home
          </Link>
          <Link href="/sos" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            <ShieldAlert size={16} />
            Open SOS
          </Link>
        </div>
      </section>
    </main>
  );
}
