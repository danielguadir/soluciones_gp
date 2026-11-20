"use client";

import { usePageTracking } from "@/lib/hooks/usePageTracking";
import { InteractiveHero } from "@/components/hero/InteractiveHero";

export default function HomeClient() {
  usePageTracking();
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Interactive Mathematical Hero Section (Solo hasta controles de simulador) */}
      <InteractiveHero />
    </div>
  );
}
