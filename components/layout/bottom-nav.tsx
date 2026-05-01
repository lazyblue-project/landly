"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, HeartPulse, Home, LayoutGrid, LifeBuoy, Plane, ShieldAlert, ShoppingBag, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiCopy } from "@/lib/ui-copy";
import { useAppStore } from "@/store/app-store";
import type { AppMode } from "@/types";

const navByMode = {
  travel: [
    { href: "/", labelKey: "nav.home", fallback: "Home", icon: Home },
    { href: "/pass", labelKey: "nav.pass", fallback: "Pass", icon: Plane },
    { href: "/shop", labelKey: "nav.shop", fallback: "Shop", icon: ShoppingBag },
    { href: "/care", labelKey: "nav.care", fallback: "Care", icon: HeartPulse },
    { href: "/sos", labelKey: "nav.sos", fallback: "SOS", icon: ShieldAlert },
  ],
  life: [
    { href: "/", labelKey: "nav.home", fallback: "Home", icon: Home },
    { href: "/stay", labelKey: "nav.stay", fallback: "Stay", icon: LifeBuoy },
    { href: "/life", labelKey: "nav.life", fallback: "Life", icon: BookOpenText },
    { href: "/care", labelKey: "nav.care", fallback: "Care", icon: HeartPulse },
    { href: "/more", labelKey: "nav.more", fallback: "More", icon: LayoutGrid },
  ],
} satisfies Record<AppMode, Array<{ href: string; labelKey: string; fallback: string; icon: LucideIcon }>>;

const morePrefixes = [
  "/more",
  "/assistant",
  "/navigate",
  "/offline",
  "/calendar",
  "/stamps",
  "/promotions",
  "/trust",
  "/my",
  "/admin",
];

function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/more") return morePrefixes.some((prefix) => pathname.startsWith(prefix));
  return pathname === href || pathname.startsWith(`${href}/`) || pathname.startsWith(`${href}?`);
}

export function BottomNav() {
  const pathname = usePathname();
  const mode = useAppStore((state) => state.user.mode);
  const { t } = useUiCopy();
  const navItems = navByMode[mode];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto border-t border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-around px-1">
        {navItems.map(({ href, labelKey, fallback, icon: Icon }) => {
          const isActive = isNavActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] transition-colors",
                isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={cn("font-medium", isActive && "font-semibold")}>{t(labelKey, undefined, fallback)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
