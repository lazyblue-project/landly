"use client";

import { Suspense } from "react";
import { StayPageContent } from "@/components/stay/stay-page-content";

export default function StayPage() {
  return (
    <Suspense>
      <StayPageContent />
    </Suspense>
  );
}
