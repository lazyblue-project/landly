"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plane, Compass, MessageSquare, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiCopy } from "@/lib/ui-copy";

const navItems = [
  { href: "/", labelKey: "nav.home", fallback: "Home", icon: Home },
  { href: "/pass", labelKey: "nav.pass", fallback: "Pass", icon: Plane },
  { href: "/explore", labelKey: "nav.explore", fallback: "Explore", icon: Compass },
  { href: "/assistant", labelKey: "nav.assistant", fallback: "Assistant", icon: MessageSquare },
  { href: "/more", labelKey: "nav.more", fallback: "More", icon: LayoutGrid },
];

const morePrefixes = ["/more", "/calendar", "/stamps", "/promotions", "/shop", "/care", "/stay", "/life", "/my", "/sos"];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useUiCopy();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto border-t border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-around px-1">
        {navItems.map(({ href, labelKey, fallback, icon: Icon }) => {
          const isActive = href === "/" ? pathname === href : href === "/more" ? morePrefixes.some((prefix) => pathname.startsWith(prefix)) : pathname.startsWith(href);

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
