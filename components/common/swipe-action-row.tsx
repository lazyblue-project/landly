"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SwipeActionRowProps {
  children: React.ReactNode;
  actions: React.ReactNode;
  className?: string;
}

export function SwipeActionRow({ children, actions, className }: SwipeActionRowProps) {
  const startXRef = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    startXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (startXRef.current === null) return;
    const delta = (event.touches[0]?.clientX ?? startXRef.current) - startXRef.current;
    const bounded = Math.max(-104, Math.min(0, delta));
    setOffset(open ? Math.max(-104, bounded - 104) : bounded);
  };

  const handleTouchEnd = () => {
    const shouldOpen = offset <= -52;
    setOpen(shouldOpen);
    setOffset(shouldOpen ? -104 : 0);
    startXRef.current = null;
  };

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      <div className="absolute inset-y-0 right-0 flex w-[104px] items-stretch gap-2 px-2 py-2">
        {actions}
      </div>
      <div
        className="relative z-10 transition-transform duration-200"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
