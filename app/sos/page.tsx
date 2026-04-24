"use client";

import { AppShell } from "@/components/layout/app-shell";
import { TopBar } from "@/components/layout/top-bar";
import { Ambulance, ShieldAlert, Phone } from "lucide-react";
import { useLocalizedText } from "@/lib/text-localizer";

const sosItems = [
  { title: "Emergency ambulance / fire", number: "119", description: "Use for medical emergency, accident, or fire.", icon: Ambulance, color: "text-red-600" },
  { title: "Police", number: "112", description: "Use for theft, assault, or immediate safety concerns.", icon: ShieldAlert, color: "text-blue-600" },
  { title: "Tourist hotline", number: "1330", description: "Use for travel support, interpretation, or general help.", icon: Phone, color: "text-emerald-600" },
];

export default function SosPage() {
  const { lt } = useLocalizedText();
  return (
    <AppShell>
      <TopBar title={lt("SOS")} />
      <div className="space-y-4 px-4 py-4">
        <section className="rounded-3xl bg-gradient-to-br from-rose-600 to-orange-500 p-5 text-white shadow-sm">
          <p className="text-sm text-rose-100">{lt("Landly SOS")}</p>
          <h1 className="mt-1 text-2xl font-bold">{lt("Fast help when you feel stuck in Korea.")}</h1>
          <p className="mt-2 text-sm leading-relaxed text-rose-100">{lt("Keep the right call button close for emergencies, police support, or tourist assistance.")}</p>
        </section>
        {sosItems.map((item) => { const Icon = item.icon; return <a key={item.number} href={`tel:${item.number}`} className="flex items-start gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm hover:bg-gray-50"><div className={`rounded-2xl bg-gray-50 p-3 ${item.color}`}><Icon size={20} /></div><div><p className="text-sm font-semibold text-gray-900">{lt(item.title)}</p><p className="mt-1 text-2xl font-bold text-gray-900">{item.number}</p><p className="mt-1 text-xs leading-relaxed text-gray-500">{lt(item.description)}</p></div></a>; })}
      </div>
    </AppShell>
  );
}
