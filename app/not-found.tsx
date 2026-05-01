import Link from "next/link";
import { Home, Search, ShieldAlert } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-gray-50 px-4 py-8">
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="rounded-2xl bg-sky-50 p-3 text-sky-700 ring-1 ring-sky-100 w-fit">
          <Search size={22} />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-sky-700">Page not found</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-950">This Landly page is not available</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          The link may be outdated or hidden behind a beta feature flag. Use Home, Trust Center, or SOS to continue safely.
        </p>

        <div className="mt-5 grid gap-2">
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white">
            <Home size={16} />
            Go to Home
          </Link>
          <Link href="/trust" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-700">
            <Search size={16} />
            Open Trust Center
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
